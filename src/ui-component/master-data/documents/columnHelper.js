import { Fragment } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  Button,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Link
} from '@mui/material';

// icons
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { filterActionButtons } from 'utils/permissions';
import StaticVar from 'config/StaticVar';

const columnHelper = createColumnHelper();

const options = [
  { name: 'content', label: 'Materi/Konten' },
  { name: 'sanitary', label: 'Klinik Sanitasi' },
  { name: 'water', label: 'Penyehatan Air' },
  { name: 'tpp', label: 'TPP' },
  { name: 'tfu', label: 'TFU' },
  { name: 'healthyHouse', label: 'Penyehatan Rumah' }
];

const ColumnHelper = (callback) => [
  columnHelper.accessor('name', {
    header: 'Nama',
    cell: (info) => {
      const data = info.row.original;
      const { name, filename } = data;

      return (
        <Box>
          <Typography>{name}</Typography>
          <Box
            sx={{
              display: 'inline-block',
              mt: 1,
              p: 0.5,
              // backgroundColor: (theme) => theme.palette.warning.main,
              borderColor: (theme) => theme.palette.warning.main,
              border: 1,
              borderRadius: 1.5
            }}
          >
            {filename}
          </Box>
        </Box>
      );
    }
  }),
  columnHelper.accessor('type', {
    header: 'Jenis',
    cell: (info) => {
      const data = info.row.original;
      let { type } = data;

      type = options.find((i) => i.name === type).label;

      return type;
    }
  }),

  columnHelper.display({
    header: 'Aksi',
    maxWidth: 160,
    minWidth: 120,
    cell: ({ row }) => {
      const { onAction, userPermission } = callback;

      const isAllowed = (permission) => {
        return filterActionButtons(permission, userPermission);
      };
      // console.log('row', row.original);
      return (
        <Fragment>
          <Tooltip title="Download File">
            <IconButton
              LinkComponent={Link}
              href={`${StaticVar.URL_API}/document/download/${row.original.filename}`}
              // onClick={() => onAction('download', row.original)}
              size="small"
              color="success"
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {isAllowed('document:edit') && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => onAction('edit', row.original)}
                size="small"
                color="warning"
              >
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
          )}
          {isAllowed('document:delete') && (
            <Tooltip title="Delete">
              <IconButton
                onClick={() => onAction('delete', row.original)}
                size="small"
                color="warning"
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          )}
        </Fragment>
      );
    }
  })
];

export default ColumnHelper;
