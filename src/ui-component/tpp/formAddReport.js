import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

const FormAddReport = ({ open, onClose }) => {
  return (
    <Dialog open={open}>
      <form>
        <Box sx={{ p: 3 }}>
          <Typography mb={2} variant="h4">
            Buat Report
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Periode Rekap" fullWidth name="period" />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Provinsi" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Kabupaten/Kota" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Kecamatan" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Kelurahan" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">Mengetahui</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Jabatan" name="position" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nama" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="NIP" name="empId" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">Dibuat Oleh</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Jabatan" name="position" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nama" name="name" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="NIP" name="empId" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Stack justifyContent="flex-end" direction="row" gap={1}>
                <Button type="submit" variant="contained" color="primary">
                  Simpan
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                  variant="contained"
                  color="grey"
                >
                  Batal
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Dialog>
  );
};

export default FormAddReport;
