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
    header: 'Nama'
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
  columnHelper.accessor('ward.nama', {
    header: 'Desa/Kelurahan'
  }),
  columnHelper.accessor('level', {
    header: 'Level Akun',
    cell: (info) => {
      const value = info.getValue();
      const { listUserAccess } = callback;

      if (!value) return '-';

      const label = listUserAccess.find((i) => i.value === value)?.label;

      return label;
    }
  }),
  columnHelper.accessor('status', {
    cell: (info) => {
      const { setUpdateState } = callback;
      const { _id } = info.row.original;

      const handleChnageStatus = async (e) => {
        const status = e.target.checked ? 'active' : 'deactive';
        await API.putUser(_id, { status })
          .then(() => {
            setUpdateState((prev) => !prev);
            toast.success('Status Berhasil diubah');
          })
          .catch((err) => {
            console.log('err status', err);
            toast.error('Gagal mengubah status');
          });
      };

      const value = info.getValue();
      const isActive = value === 'active';

      return (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={isActive} onChange={handleChnageStatus} />
            }
            label="Aktif"
          />
        </FormGroup>
      );
    },
    header: 'Status'
  }),
  columnHelper.display({
    header: 'Aksi',
    maxWidth: 120,
    // minWidth: 120,
    cell: ({ row }) => {
      const { onAction, userPermission } = callback;

      const isAllowed = (permission) => {
        return filterActionButtons(permission, userPermission);
      };

      return (
        <Fragment>
          {isAllowed('user:read') && (
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
          {isAllowed('user:edit') && (
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
          {isAllowed('user:delete') && (
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
