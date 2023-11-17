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
import PageviewIcon from '@mui/icons-material/Pageview';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PrintIcon from '@mui/icons-material/Print';
import ImageIcon from '@mui/icons-material/Image';
import moment from 'moment';

const columnHelper = createColumnHelper();

const ColumnHelperView = (callback) => [
  columnHelper.accessor('hh.type', {
    header: 'Jenis Sanitasi'
  }),
  columnHelper.accessor('scoreAssesment', {
    header: 'Nilai',
    cell: (info) => parseInt(info.getValue())
  }),
  columnHelper.accessor('reviewDate', {
    header: 'Tanggal Inspeksi',
    cell: (info) => {
      const value = info.getValue();

      // if(!value){
      //   retur
      // }
      return moment(value).format('LL');
    }
  }),
  columnHelper.accessor('createdAt', {
    header: 'Tanggal Input',
    cell: (info) => moment(info.getValue()).format('LL')
  }),
  columnHelper.accessor('status', {
    cell: (info) => {
      let color = 'grey';
      const value = info.getValue();

      switch (value) {
        case 'Resiko Rendah':
        case 'Baik':
        case 'Cukup':
          color = 'success';
          break;
        case 'Resiko Sedang':
        case 'Kurang Baik':
          color = 'warning';
          break;
        case 'Resiko Tinggi':
        case 'Tidak Baik':
          color = 'error';
          break;
        default:
          break;
      }

      if (!value) {
        return null;
      }

      return (
        <Button variant="contained" color={color} sx={{ fontSize: 11 }}>
          {value}
        </Button>
      );
    },
    header: 'Status'
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
      return (
        <Fragment>
          <Tooltip title="Print">
            <IconButton size="small">
              <PrintIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </Fragment>
      );
    }
  })
];

export default ColumnHelperView;
