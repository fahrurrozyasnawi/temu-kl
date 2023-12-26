import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ColumnHelperView from 'ui-component/water/columnHelperView';
import CustomTable from 'ui-component/sections/customTable';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import { WaterContext } from 'contexts/WaterContext';
import { waterTypes } from 'utils/assesments/water';
import DialogFormPrint from './form print/Assesments';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import AssesmentSearch from 'ui-component/assesment-search';

const ViewData = () => {
  const navigate = useNavigate();
  const { _id } = useParams();

  const {
    totalPages,
    dataWater,
    getDataWater,
    getDataWaterAssesment,
    waterAssesments,
    getWaterAssements
  } = useContext(WaterContext);

  // state
  const [openPrint, setOpenPrint] = useState(false);
  // pagination hooks
  const { onPaginationChange, pagination, pageIndex, pageSize } =
    usePagination();

  // search hooks
  const {
    filterValues,
    isSearch,
    search,
    setSearch,
    query,
    handleSearchChange
  } = useSearch('reviewer');

  useEffect(() => {
    const fetchData = async (params = {}) => {
      await getDataWater(_id);
      await getWaterAssements({ water: _id, ...params });
    };

    fetchData({ pageIndex, pageSize, search, query });
    // return () => {
    //   fetchData();
    // };
  }, [pageIndex, pageSize, isSearch]);

  const handleActions = (type, data) => {
    switch (type) {
      case 'print':
        getDataWaterAssesment(data?._id);
        setOpenPrint(true);
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    setOpenPrint(false);
  };

  return (
    <Fragment>
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
                      label="Nama Water"
                      value={dataWater.name}
                      InputLabelProps={{ shrink: !!dataWater.name }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Alamat"
                      value={dataWater.address}
                      InputLabelProps={{ shrink: !!dataWater.address }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Golongan"
                      value={
                        waterTypes.find((i) => i.value === dataWater.type)
                          ?.name || ''
                      }
                      InputLabelProps={{ shrink: !!dataWater.type }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Status"
                      value={dataWater.status}
                      InputLabelProps={{ shrink: !!dataWater.status }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Kriteria Umum Minimal"
                    value={dataWater.kum}
                    InputLabelProps={{ shrink: !!dataWater.kum }}
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
                  <AssesmentSearch
                    placeholder="Cari pemeriksa"
                    searchValues={filterValues}
                    onClickSearch={setSearch}
                    onSearchChange={handleSearchChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  data={waterAssesments}
                  columns={ColumnHelperView({ onAction: handleActions })}
                  useServerSidePagination
                  pageCount={totalPages}
                  pagination={pagination}
                  onPaginationChange={onPaginationChange}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {/* Dialog print */}
      <DialogFormPrint open={openPrint} onClose={handleClose} />
    </Fragment>
  );
};

const _data = [
  {
    step: 1,
    water: 'Pasar',
    waterVal: 129,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  },
  {
    step: 2,
    water: 'Pasar',
    waterVal: 120,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  }
];

export default ViewData;
