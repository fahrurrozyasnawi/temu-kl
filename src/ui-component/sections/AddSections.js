import { Add, Close, Search } from '@mui/icons-material';
import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';
import React, { useContext } from 'react';
import { filterActionButtons } from 'utils/permissions';

const AddSections = ({
  onClickAdd,
  handleChange,
  options = [],
  values = { search: '', query: '', isSearch: false },
  exclude = '',
  onClickSearch
}) => {
  const { dataUser } = useContext(AuthContext);

  const isAllowwed = filterActionButtons(exclude, dataUser?.permissions);

  return (
    <Card sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={8}>
          <Stack direction="row" gap={1}>
            <TextField
              size="small"
              label="Cari"
              name="search"
              value={values.search}
              disabled={values.isSearch}
              onChange={(e) => handleChange('search', e.target.value)}
            />
            <TextField
              select
              size="small"
              name="query"
              SelectProps={{
                native: true
              }}
              value={values.query}
              disabled={values.isSearch}
              onChange={(e) => handleChange('query', e.target.value)}
            >
              <option value=""></option>
              {options.map((item, index) => (
                <option value={item.value} key={index}>
                  {item.name}
                </option>
              ))}
            </TextField>
            <IconButton onClick={() => onClickSearch()}>
              {values.isSearch ? (
                <Close color="error" />
              ) : (
                <Search color="primary" />
              )}
            </IconButton>
          </Stack>
        </Grid>
        {isAllowwed && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={onClickAdd}
            >
              <Typography color="white" variant="h6">
                Tambah Data
              </Typography>
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default AddSections;
