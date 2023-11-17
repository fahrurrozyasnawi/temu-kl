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
import { filterActionButtons } from 'utils/permissions';

const columnHelper = createColumnHelper();

const ColumnHelperUsers = (callback) => [
  columnHelper.accessor('name', {
    header: 'Puskesmas'
  }),
  columnHelper.accessor('code', {
    header: 'Kode Puskesmas'
  }),
  columnHelper.accessor('province.nama', {
    header: 'Provinsi'
  }),
  columnHelper.accessor('region.nama', {
    header: 'Kabupaten'
  }),
  columnHelper.accessor('district.nama', {
    header: 'Kecamatan'
  }),
  columnHelper.accessor('village', {
    header: 'Desa'
  }),
  columnHelper.display({
    header: 'Aksi',
    maxWidth: 40,
    // minWidth: 120,
    cell: ({ row }) => {
      const { onAction, userPermission } = callback;

      const isAllowed = (permission) => {
        return filterActionButtons(permission, userPermission);
      };

      return (
        <Fragment>
          {isAllowed('puskesmas:read') && (
            <Fragment>
              <Tooltip title="Lihat">
                <IconButton
                  size="small"
                  onClick={() => onAction('preview', row.original)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Fragment>
          )}
          {isAllowed('puskesmas:edit') && (
            <Fragment>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => onAction('edit', row.original)}
                >
                  <BorderColorIcon color="warning" />
                </IconButton>
              </Tooltip>
            </Fragment>
          )}
          {isAllowed('puskesmas:delete') && (
            <Fragment>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => onAction('delete', row.original)}
                  size="small"
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </Fragment>
          )}
        </Fragment>
      );
    }
  })
];

export default ColumnHelperUsers;
