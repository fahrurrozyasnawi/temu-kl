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
import ColumnHelperView from 'ui-component/tfu/columnHelperView';
import CustomTable from 'ui-component/sections/customTable';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import { TFUContext } from 'contexts/TFUContext';
import DialogFormPrint from './form print/Assesments';
import usePagination from 'hooks/usePagination';
import AssesmentSearch from 'ui-component/assesment-search';
import useSearch from 'hooks/useSearch';

const ViewData = () => {
  const navigate = useNavigate();
  const { _id } = useParams();

  const {
    totalPages,
    dataTFU,
    getDataTFU,
    getDataTFUAssesment,
    tfuAssesments,
    getTFUAssements
  } = useContext(TFUContext);

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
      await getDataTFU(_id);
      await getTFUAssements({ tfu: _id, ...params });
    };

    fetchData({ pageIndex, pageSize, search, query });
    // return () => {
    //   fetchData();
    // };
  }, [pageIndex, pageSize, isSearch]);

  const handleActions = (type, data) => {
    switch (type) {
      case 'print':
        getDataTFUAssesment(data?._id);
        setOpenPrint(true);
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    setOpenPrint(false);
  };

  console.log('data tfu', tfuAssesments);

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
                      label="Nama TFU"
                      value={dataTFU.name}
                      InputLabelProps={{ shrink: !!dataTFU.name }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Alamat"
                      value={dataTFU.address}
                      InputLabelProps={{ shrink: !!dataTFU.address }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Golongan"
                      value={dataTFU.type}
                      InputLabelProps={{ shrink: !!dataTFU.type }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Status"
                      value={dataTFU.status}
                      InputLabelProps={{ shrink: !!dataTFU.status }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      label="Kriteria Umum Minimal"
                      value={dataTFU.kum}
                      InputLabelProps={{ shrink: !!dataTFU.kum }}
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
                  data={tfuAssesments}
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
    tfu: 'Pasar',
    tfuVal: 129,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  },
  {
    step: 2,
    tfu: 'Pasar',
    tfuVal: 120,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  }
];

export default ViewData;
