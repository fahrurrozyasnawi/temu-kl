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
import ColumnHelperView from 'ui-component/tpp/columnHelperView';
import CustomTable from 'ui-component/sections/customTable';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { TPPContext } from 'contexts/TPPContext';
import DialogFormPrint from './form print/Assesments';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import AssesmentSearch from 'ui-component/assesment-search';

const ViewData = () => {
  const navigate = useNavigate();
  const { _id } = useParams();

  const {
    totalPages,
    dataTPP,
    getDataTPP,
    getDataTPPAssesment,
    tppAssesments,
    getTPPAssements
  } = useContext(TPPContext);

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
  } = useSearch('reviewer', onPaginationChange);

  useEffect(() => {
    const fetchData = async (params = {}) => {
      await getDataTPP(_id);
      await getTPPAssements({ tpp: _id, ...params });
    };

    fetchData({ pageIndex, pageSize, search, query });
    // return () => {
    //   fetchData();
    // };
  }, [pageIndex, pageSize, isSearch]);

  const handleActions = (type, data) => {
    switch (type) {
      case 'print':
        getDataTPPAssesment(data?._id);
        setOpenPrint(true);
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    setOpenPrint(false);
  };

  // console.log('data tpp', tppAssesments);

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
                      label="Nama TPP"
                      value={dataTPP.name}
                      InputLabelProps={{ shrink: !!dataTPP.name }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Alamat"
                      value={dataTPP.address}
                      InputLabelProps={{ shrink: !!dataTPP.address }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Golongan"
                      value={dataTPP.type}
                      InputLabelProps={{ shrink: !!dataTPP.type }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Status"
                      value={dataTPP.status}
                      InputLabelProps={{ shrink: !!dataTPP.status }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Kriteria Umum Minimal"
                      value={dataTPP.kum}
                      InputLabelProps={{ shrink: !!dataTPP.kum }}
                    />
                  </Grid>
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
                  data={tppAssesments}
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
    tpp: 'Pasar',
    tppVal: 129,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  },
  {
    step: 2,
    tpp: 'Pasar',
    tppVal: 120,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  }
];

export default ViewData;
