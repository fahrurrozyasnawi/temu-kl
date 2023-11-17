import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import ColumnHelperView from 'ui-component/healthyHouse/columnHelperView';
import CustomTable from 'ui-component/sections/customTable';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import { HealthyHouseContext } from 'contexts/HealthyHouseContext';

const ViewData = () => {
  const navigate = useNavigate();
  const { _id } = useParams();

  const {
    dataHealthyHouse,
    getDataHealthyHouse,
    healthyHouseAssesments,
    getHealthyHouseAssements
  } = useContext(HealthyHouseContext);

  useEffect(() => {
    const fetchData = async () => {
      await getDataHealthyHouse(_id);
      await getHealthyHouseAssements({ hh: _id });
    };

    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  console.log('data healthyHouse', healthyHouseAssesments);

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography variant="h5">View Data</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Nama HealthyHouse"
                    value={dataHealthyHouse.name}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Alamat"
                    value={dataHealthyHouse.address}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.address }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Golongan"
                    value={dataHealthyHouse.type}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.type }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Status"
                    value={dataHealthyHouse.status}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.status }}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Kriteria Umum Minimal"
                    value={dataHealthyHouse.kum}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.kum }}
                  />
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Data Penilaian</Typography>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" gap={1} alignItems="center">
                <TextField
                  size="small"
                  sx={{ minWidth: 250 }}
                  placeholder="Cari"
                />
                <IconButton>
                  <SearchIcon color="primary" />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <CustomTable
                data={healthyHouseAssesments}
                columns={ColumnHelperView({})}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

const _data = [
  {
    step: 1,
    healthyHouse: 'Pasar',
    healthyHouseVal: 129,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  },
  {
    step: 2,
    healthyHouse: 'Pasar',
    healthyHouseVal: 120,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  }
];

export default ViewData;
