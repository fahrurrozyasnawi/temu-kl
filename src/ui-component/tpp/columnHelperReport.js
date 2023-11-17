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
import DifferenceIcon from '@mui/icons-material/Difference';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';

import moment from 'moment';

const columnHelper = createColumnHelper();

const ColumnHelperReport = (callback) => [
  columnHelper.accessor('recap', {
    header: 'Rekap'
  }),
  columnHelper.accessor('sorting', {
    header: 'Sorting'
  }),
  columnHelper.accessor('quarter', {
    header: 'Triwulan'
  }),
  columnHelper.accessor('year', {
    header: 'Tahun',
    cell: (info) => {
      const year = Number(info.getValue());
      return moment().year(year).format('Y');
    }
  }),
  columnHelper.accessor('untilDate', {
    header: 'Sampai Tgl',
    cell: (info) => moment(info.getValue()).format('LL')
    // cell: (info) => 'Tes'
  }),
  columnHelper.display({
    header: 'Mengetahui',
    cell: ({ row }) => {
      const data = row.original;
      const discover = data.discover;
      return (
        <Box>
          <Typography>{`Mengetahui : ${discover?.occupation}`}</Typography>
          <Typography>{`Nama : ${discover?.name}`}</Typography>
          <Typography>{`NIP : ${discover?.empId}`}</Typography>
        </Box>
      );
    }
  }),
  columnHelper.display({
    header: 'Pelapor',
    cell: ({ row }) => {
      const data = row.original;
      const reporter = data.reporter;
      return (
        <Box>
          <Typography>{`Mengetahui : ${reporter?.occupation}`}</Typography>
          <Typography>{`Nama : ${reporter?.name}`}</Typography>
          <Typography>{`NIP : ${reporter?.empId}`}</Typography>
        </Box>
      );
    }
  }),
  columnHelper.accessor('status', {
    cell: (info) => {
      const value = info.getValue();
      return (
        <Button variant="contained" color="success" sx={{ fontSize: 11 }}>
          {value}
        </Button>
      );
    },
    header: 'Status'
  }),
  columnHelper.display({
    header: 'Aksi',

    minWidth: 150,
    cell: (info) => {
      const { onView } = callback;
      return (
        <Fragment>
          <Tooltip title="Download Excel">
            <IconButton size="small">
              <DifferenceIcon color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton size="small">
              <PictureAsPdfIcon color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus">
            <IconButton size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Fragment>
      );
    }
  })
];

export default ColumnHelperReport;
