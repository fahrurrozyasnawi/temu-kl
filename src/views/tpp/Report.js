import {
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import CustomTable from 'ui-component/sections/customTable';
import ColumnHelperReport from 'ui-component/tpp/columnHelperReport';
import FormAddReport from 'ui-component/tpp/formAddReport';
import { TPPContext } from 'contexts/TPPContext';
import API from 'api';
import { toast } from 'react-hot-toast';
import DeleteDialog from 'ui-component/components/deleteDialog';
import { AuthContext } from 'contexts/AuthContext';

const Report = () => {
  // context
  const { reports, getReports } = useContext(TPPContext);
  const { dataUser } = useContext(AuthContext);

  const [openFormAdd, setOpenFormAdd] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      await getReports({ type: 'tpp' });
    };

    fetchData();
  }, [updateState]);

  const handleClose = () => {
    setOpenFormAdd(false);
    setDeleteModal((prev) => ({ ...prev, open: false, text: '', id: '' }));
  };

  const handleClickAction = (type, row) => {
    switch (type) {
      case 'offline':
        navigate(`/tpp/assesment/offline/${row.type}/${row._id}`);
        break;
      case 'online':
        navigate(`/tpp/assesment/online/${row.type}/${row._id}`);
        break;
      case 'delete':
        console.log('delete click');
        setDeleteModal({ open: true, text: row.name, id: row._id });
        break;
      default:
        return;
    }
  };

  const onDelete = async (id) => {
    await API.deleteReport(id)
      .then((res) => {
        toast.success('Data telah dihapus');
        setUpdateState((prev) => !prev);
        handleClose();
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Terjadi kesalahan, silahkan coba lagi!!');
      });
  };

  console.log('data user', dataUser);
  console.log('data report', reports);
  return (
    <Fragment>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Report</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <Button onClick={() => setOpenFormAdd(true)} variant="contained">
                Tambah Baru
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" gap={1} alignItems="center">
              <TextField size="small" sx={{ minWidth: 250 }} placeholder="" />
              <TextField
                select
                size="small"
                sx={{ minWidth: 250 }}
                placeholder="Pilih..."
              >
                <MenuItem value="recap">Rekap</MenuItem>
                <MenuItem value="quarter">Triwulan</MenuItem>
                <MenuItem value="year">Tahun</MenuItem>
                <MenuItem value="discover">Mengetahui</MenuItem>
                <MenuItem value="reporter">Pelapor</MenuItem>
              </TextField>
              <IconButton>
                <SearchIcon color="primary" />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              data={_data}
              columns={ColumnHelperReport({
                onAction: handleClickAction,
                permissions: dataUser?.permissions
              })}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Dialog */}
      <FormAddReport
        updateState={setUpdateState}
        open={openFormAdd}
        onClose={handleClose}
      />

      <DeleteDialog
        open={deleteModal.open}
        text={deleteModal.text}
        onClose={handleClose}
        onDelete={() => onDelete(deleteModal.id)}
      />
    </Fragment>
  );
};

const _data = [
  {
    recap: 'Puskesmas',
    sorting: 'Sampai Tanggal',
    quarter: 0,
    year: '2023',
    untilDate: new Date(),
    discover: {
      name: 'Hairul Muslimin, SKM',
      occupation: 'Kepala Puskesmas',
      empId: '197611122005021002'
    },
    reporter: {
      name: 'Sanitarian Ahli Muda',
      occupation: '',
      empId: '198004202010012013'
    },
    status: 'Completed'
  }
];

export default Report;
