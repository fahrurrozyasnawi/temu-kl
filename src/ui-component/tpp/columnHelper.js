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

const columnHelper = createColumnHelper();

const ColumnHelper = (callback) => [
  columnHelper.accessor('name', {
    header: 'Nama'
  }),
  columnHelper.accessor('nHandler', {
    header: 'Jumlah Penjamah'
  }),
  columnHelper.accessor('owner', {
    header: 'Nama Pengelola'
  }),
  columnHelper.accessor('address', {
    header: 'Alamat'
  }),
  columnHelper.accessor('type', {
    header: 'Jenis TPP'
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const value = info.getValue();
      if (!value) {
        return '-';
      }
      return (
        <Button variant="contained" color="success" sx={{ fontSize: 11 }}>
          {value}
        </Button>
      );
    }
  }),
  columnHelper.accessor('kum', {
    header: 'Kriteria Umum Minimal',
    cell: (info) => {
      const value = info.getValue();
      if (!value) {
        return '-';
      }
      return (
        <Button variant="contained" color="success" sx={{ fontSize: 11 }}>
          {value}
        </Button>
      );
    }
  }),
  columnHelper.display({
    header: 'Aksi',
    maxWidth: 160,
    minWidth: 120,
    cell: ({ row }) => {
      const { onAction } = callback;
      return (
        <Fragment>
          <Tooltip title="View">
            <IconButton
              onClick={() => onAction('view', row.original)}
              size="small"
            >
              <PageviewIcon color="info" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => onAction('edit', row.original)}
              size="small"
            >
              <BorderColorIcon color="warning" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => onAction('delete', row.original)}
              size="small"
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Penilaian">
            <IconButton
              onClick={() => onAction('online', row.original)}
              size="small"
            >
              <AssessmentIcon color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Penilaian Offline">
            <IconButton
              onClick={() => onAction('offline', row.original)}
              size="small"
            >
              <FilePresentIcon color="success" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Print">
            <IconButton size="small">
              <PrintIcon color="secondary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gambar">
            <IconButton size="small">
              <ImageIcon color="warning" />
            </IconButton>
          </Tooltip> */}
        </Fragment>
      );
    }
  })
];

export default ColumnHelper;
