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
  columnHelper.accessor('step', {
    header: 'Tahap'
  }),
  columnHelper.accessor('tfu.type', {
    header: 'Jenis TFU'
  }),
  columnHelper.accessor('score', {
    header: 'Nilai'
  }),
  columnHelper.accessor('reviewDate', {
    header: 'Tanggal IS',
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
      const value = info.getValue();
      if (!value) {
        return null;
      }

      return (
        <Button variant="contained" color="success" sx={{ fontSize: 11 }}>
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
      const data = info.row.original;
      const { onAction } = callback;
      return (
        <Fragment>
          <Tooltip title="Print">
            <IconButton onClick={() => onAction('print', data)} size="small">
              <PrintIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </Fragment>
      );
    }
  })
];

export default ColumnHelperView;
