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
import React, { Fragment, useState } from 'react';
import CustomTable from 'ui-component/sections/customTable';
import ColumnHelperReport from 'ui-component/tfu/columnHelperReport';
import FormAddReport from 'ui-component/tfu/formAddReport';

const Report = () => {
  const [openFormAdd, setOpenFormAdd] = useState(false);

  const handleCloseFormAdd = () => {
    setOpenFormAdd(false);
  };

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
            <CustomTable data={_data} columns={ColumnHelperReport({})} />
          </Grid>
        </Grid>
      </Card>

      {/* Dialog */}
      <FormAddReport open={openFormAdd} onClose={handleCloseFormAdd} />
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
