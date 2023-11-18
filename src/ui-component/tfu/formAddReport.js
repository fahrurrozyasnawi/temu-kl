import React, { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from 'contexts/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import API from 'api';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';

const FormAddReport = ({ open, onClose, updateState }) => {
  // context
  const { dataUser } = useContext(AuthContext);

  const initialValues = {
    name: '',
    type: 'tfu',
    report: null
  };

  // state
  const [areas, setAreas] = useState({
    province: [],
    region: [],
    district: [],
    ward: []
  });

  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      let data = areas;

      try {
        data = (
          await API.getDataArea({ level: 2, parent: dataUser?.province?.kode })
        ).data?.data?.map((i) => ({
          kode: i.kode,
          nama: i.nama
        }));
        // console.log('data', data);
        setAreas((prev) => ({
          ...prev,
          region: data
        }));

        // setValue
        setValue('report.province', dataUser?.province);
        // setValue('report.region', dataUser?.region);
        // setValue('report.district', dataUser?.district);
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchData();
  }, [dataUser]);

  const onSubmit = async (values) => {
    console.log('values', values);

    await API.postReport(values)
      .then(() => {
        toast.success('Berhasil menambah data');
        updateState((prev) => !prev);
        reset();
        onClose();
      })
      .catch((err) => {
        console.log('err post report', err);
        toast.error('Terjadi kesalahan, silahkan dicoba beberapa saat lagi');
      });
  };

  const handleDataArea = async (type, value) => {
    if (type === 'prov') {
      const kode = value?.kode;
      const data = (
        await API.getDataArea({ level: 2, parent: kode })
      ).data.data.map((i) => ({
        kode: i.kode,
        nama: i.nama
      }));

      setAreas((prev) => ({
        ...prev,
        region: data,
        district: [],
        ward: []
      }));

      setValue('report.province', value);
      setValue('report.region', null);
      setValue('report.district', null);
      setValue('report.ward', null);
    }

    if (type === 'kab') {
      const kode = value?.kode;
      const data = (
        await API.getDataArea({ level: 3, parent: kode })
      ).data.data.map((i) => ({
        kode: i.kode,
        nama: i.nama
      }));

      setAreas((prev) => ({
        ...prev,
        district: data,
        ward: []
      }));

      setValue('report.region', value);
      setValue('report.district', null);
      setValue('report.ward', null);
    }

    if (type === 'kec') {
      const kode = value?.kode;
      const data = (
        await API.getDataArea({ level: 4, parent: kode })
      ).data.data.map((i) => ({
        kode: i.kode,
        nama: i.nama
      }));

      setAreas((prev) => ({ ...prev, ward: data }));
      setValue('report.district', value);
      setValue('report.ward', null);
    }

    if (type === 'kel') {
      setValue('report.ward', value);
    }
  };
  return (
    <Dialog open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 3 }}>
          <Typography mb={2} variant="h4">
            Buat Report
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomDatePicker
                label="Periode"
                name="report.period"
                format="dd/MM/yyyy"
                control={control}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutocomplete
                disabled={true}
                freeSolo
                label="Provinsi"
                name="report.province"
                control={control}
                options={areas.province}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('prov', newValue)}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutocomplete
                // disabled={true}
                freeSolo
                label="Kabupaten/Kota"
                name="report.region"
                control={control}
                options={areas.region}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('kab', newValue)}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutocomplete
                // disabled={true}
                freeSolo
                label="Kecamatan"
                name="report.district"
                control={control}
                options={areas.district}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('kec', newValue)}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutocomplete
                freeSolo
                label="Kelurahan/Desa"
                name="report.ward"
                control={control}
                options={areas.ward}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('kel', newValue)}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">Mengetahui</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Jabatan"
                    {...register('report.leader.position', { required: true })}
                    // error={errors.report}
                    // helperText={errors.report}
                    // error={errors.report?.leader?.position}
                    // helperText={errors.report?.leader?.position}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nama"
                    {...register('report.leader.name', { required: true })}
                    // error={errors.report}
                    // helperText={errors.report}
                    // error={errors.report?.leader?.name}
                    // helperText={errors.report?.leader?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="NIP"
                    {...register('report.leader.empId', { required: true })}
                    // error={errors.report}
                    // helperText={errors.report}
                    // error={errors.report?.leader?.empId}
                    // helperText={errors.report?.leader?.empId}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">Dibuat Oleh</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Jabatan"
                    {...register('report.maker.position', { required: true })}
                    // error={errors.report}
                    // helperText={errors.report}
                    // error={errors.report?.maker?.position}
                    // helperText={errors.report?.maker?.position}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nama"
                    {...register('report.maker.name', { required: true })}
                    // error={errors.report}
                    // helperText={errors.report}
                    // error={errors.report?.maker?.name}
                    // helperText={errors.report?.maker?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="NIP"
                    {...register('report.maker.empId', { required: true })}
                    // error={errors.report}
                    // helperText={errors.report}
                    // error={errors.report?.maker?.empId}
                    // helperText={errors.report?.maker?.empId}
                  />
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
