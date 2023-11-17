import React, { Fragment } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  Button,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Switch
} from '@mui/material';

// icons
import PageviewIcon from '@mui/icons-material/Pageview';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PrintIcon from '@mui/icons-material/Print';
import ImageIcon from '@mui/icons-material/Image';
import API from 'api';
import { toast } from 'react-hot-toast';

const columnHelper = createColumnHelper();

const ColumnHelperResidents = (callback) => [
  columnHelper.accessor('name', {
    header: 'Nama'
  }),
  columnHelper.accessor('village', {
    header: 'Desa'
  }),
  columnHelper.display({
    header: 'Umur',
    cell: ({ row }) => {
      const { age } = row.original;

      const ageValue = age?.ageValue || '-';
      const ageType = age?.ageType || null;

      const value = `${ageValue} ${ageType}`;

      return value;
    }
  }),
  columnHelper.accessor('address.province.nama', {
    header: 'Provinsi'
  }),
  columnHelper.accessor('address.region.nama', {
    header: 'Kabupaten'
  }),
  columnHelper.accessor('address.district.nama', {
    header: 'Kecamatan'
  }),
  columnHelper.display({
    header: 'RT/RW',
    cell: ({ row }) => {
      const { address } = row.original;
      const nbAssociate = address?.nbAssociate || '-';
      const ctAssociate = address?.ctAssociate || '-';

      const value = `${nbAssociate}/${ctAssociate}`;

      return value;
    }
  }),
  columnHelper.display({
    header: 'Aksi',
    maxWidth: 40,
    // minWidth: 120,
    cell: ({ row }) => {
      const { onAction } = callback;
      return (
        <Fragment>
          <Tooltip title="Lihat">
            <IconButton
              size="small"
              onClick={() => onAction('preview', row.original)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onAction('edit', row.original)}
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
        </Fragment>
      );
    }
  })
];

export default ColumnHelperResidents;
