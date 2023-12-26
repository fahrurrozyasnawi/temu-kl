import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ColumnHelperView from 'ui-component/sanitary/columnHelperView';
import CustomTable from 'ui-component/sections/customTable';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import { SanitaryContext } from 'contexts/SanitaryContext';
import { getNestedProperty } from 'utils/generator';
import { Close } from '@mui/icons-material';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';
import AssesmentSearch from 'ui-component/assesment-search';
// import { sanitaryTypes } from 'utils/assesments/sanitary';

const ViewData = () => {
  const navigate = useNavigate();
  const { _id } = useParams();

  const {
    totalPages,
    dataSanitary,
    getDataSanitary,
    sanitaryAssesments,
    getSanitaryAssements
  } = useContext(SanitaryContext);

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
      await getDataSanitary(_id);
      await getSanitaryAssements({ sanitary: _id, ...params });
    };

    fetchData({ pageIndex, pageSize, search, query });
    // return () => {
    //   fetchData();
    // };
  }, [pageIndex, pageSize, isSearch]);

  const handleActions = (type, row) => {
    switch (type) {
      case 'counseling':
        navigate(`/sanitary/counseling/${row._id}`);
        break;
      case 'preview':
        navigate(`/sanitary/counseling/${row._id}?mode=preview`);
        break;

      default:
        break;
    }
  };

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
                    label="Nama Sanitary"
                    value={dataSanitary.name}
                    InputLabelProps={{ shrink: !!dataSanitary.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Alamat"
                    value={dataSanitary.address?.name}
                    InputLabelProps={{ shrink: !!dataSanitary.address?.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Golongan"
                    value={
                      dataSanitary.class?.value !== 'Lainnya'
                        ? dataSanitary.class?.value
                        : dataSanitary.class?.other
                    }
                    InputLabelProps={{ shrink: !!dataSanitary.class?.value }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Status"
                    value={dataSanitary.status}
                    InputLabelProps={{ shrink: !!dataSanitary.status }}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Kriteria Umum Minimal"
                    value={dataSanitary.kum}
                    InputLabelProps={{ shrink: !!dataSanitary.kum }}
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
              <Typography variant="h5">Cari Data</Typography>
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
                data={sanitaryAssesments}
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
  );
};

const _data = [
  {
    step: 1,
    sanitary: 'Pasar',
    sanitaryVal: 129,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  },
  {
    step: 2,
    sanitary: 'Pasar',
    sanitaryVal: 120,
    isDate: new Date(),
    inputDate: new Date(),
    status: 'Memenuhi Syarat',
    reviewer: 'Titin Yuanri, SKM'
  }
];

export default ViewData;
