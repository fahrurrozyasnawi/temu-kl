import React, { Fragment } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  Button,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';

// icons
import BorderColorIcon from '@mui/icons-material/BorderColor';
import moment from 'moment';
import { Visibility } from '@mui/icons-material';

const columnHelper = createColumnHelper();

const ColumnHelperView = (callback) => [
  columnHelper.group({
    id: 'type',
    columns: [
      columnHelper.accessor('assesmentDate', {
        header: 'Tanggal',
        cell: (info) => {
          const value = info.getValue();

          // if(!value){
          //   retur
          // }
          return moment(value).format('LL');
        }
      })
    ]
  }),
  columnHelper.group({
    id: 'type',
    columns: [
      columnHelper.accessor('type', {
        header: 'Jenis Penyakit'
      })
    ]
  }),
  columnHelper.group({
    header: 'Konseling',
    textAlign: 'center',
    columns: [
      columnHelper.accessor('counseling.condition', {
        header: 'Kondisi/Masalah',
        cell: (info) => info.getValue() || '-'
      }),
      columnHelper.accessor('counseling.recommend', {
        header: 'Saran/Rekomendasi',
        cell: (info) => info.getValue() || '-'
      })
    ]
  }),
  columnHelper.group({
    id: 'result',
    header: 'Inspeksi Kesehatan Lingkungan',
    textAlign: 'center',
    columns: [
      columnHelper.accessor('counselingDate', {
        header: 'Tanggal Konseling',
        cell: (info) => {
          const value = info.getValue();

          // if(!value){
          //   retur
          // }
          return moment(value).format('LL');
        }
      }),
      columnHelper.accessor('result', {
        header: 'Hasil',
        cell: (info) => info.getValue() || '-'
      })
    ]
  }),
  columnHelper.group({
    id: 'rest',
    columns: [
      columnHelper.accessor('intervention', {
        header: 'Intervensi',
        cell: (info) => info.getValue() || '-'
      }),
      columnHelper.accessor('reviewer', {
        header: 'Pemeriksa'
      }),
      columnHelper.display({
        header: 'Aksi',
        maxWidth: 150,
        minWidth: 120,
        cell: (info) => {
          const { onAction } = callback;
          const data = info.row.original;
          const { isHaveCounseling } = info.row.original;
          return (
            <Fragment>
              <Tooltip title="Lihat Hasil Konseling">
                <IconButton
                  disabled={!isHaveCounseling}
                  onClick={() => onAction('preview', data)}
                  size="small"
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Konseling">
                <IconButton
                  onClick={() => onAction('counseling', data)}
                  disabled={isHaveCounseling}
                  size="small"
                  color="primary"
                >
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
            </Fragment>
          );
        }
      })
    ]
  })
];

export default ColumnHelperView;
