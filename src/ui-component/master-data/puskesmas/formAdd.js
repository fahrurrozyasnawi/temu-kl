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
import API from 'api';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import CustomTextField from 'ui-component/components/forms/CustomTextField';
import Scrollbar from 'ui-component/components/ScrollBar';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

const FormAdd = ({
  open,
  onClose,
  edit,
  data,
  updateState,
  preview = false
}) => {
  const initialValues = {
    name: data?.name || '',
    code: data?.code || '',
    type: data?.type || '',
    province: data?.province || null,
    region: data?.region || null,
    district: data?.district || null,
    ward: data?.ward || null,
    serialNum: data?.serialNum || undefined, // Nomor urut
    village: data?.village || '',
    street: data?.street || '',
    num: data?.num || undefined,
    nbAssociate: data?.nbAssociate || '',
    ctAssociate: data?.ctAssociate || '',
    posCode: data?.posCode || '',
    phone: data?.phone || '',
    fax: data?.fax || '',
    year: data?.year || undefined,
    email: data?.email || '',
    cp: data?.cp || '',
    status: data?.status || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    code: Yup.string(),
    type: Yup.string()
    // serialNum: Yup.number(),
    // village: Yup.string(),
    // street: Yup.string(),
    // // num: Yup.number(),
    // nbAssociate: Yup.string(),
    // ctAssociate: Yup.string(),
    // posCode: Yup.string(),
    // phone: Yup.string(),
    // fax: Yup.string(),
    // year: Yup.string(),
    // email: Yup.string().email(),
    // cp: Yup.string(),
    // status: Yup.string()
  });

  // state
  const [areas, setAreas] = useState({
    province: [],
    region: [],
    district: [],
    ward: []
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      const data = (
        await API.getDataArea({ level: 1, kode: 73 })
      ).data.data.map((i) => ({
        kode: i.kode,
        nama: i.nama
      }));
      console.log('data', data);
      setAreas((prev) => ({ ...prev, province: data }));
    };
    fetchData();
  }, []);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  // update state
  useEffect(() => {
    reset(initialValues);
  }, [data, reset]);

  const onSubmit = async (values) => {
    console.log('values', values);
    if (edit) {
      await API.putPublicHealth(data?._id, values)
        .then((res) => {
          toast.success('Berhasil mengubah data');
          updateState((prev) => !prev);
          reset();
          onClose();
        })
        .catch((err) => {
          console.log('err update user', err);
          reset();
          toast.error('Terjadi kesalahan, silakhkan coba kembali');
        });
    } else {
      await API.postPublicHealth(values)
        .then((res) => {
          // console.log('res', res);
          toast.success('Berhasil menambah data');
          updateState((prev) => !prev);
          reset();
          onClose();
        })
        .catch((err) => {
          onClose();
          // console.log('err add user', err.response?.data?.msg);
          if (err.response?.data?.msg) {
            reset();
            toast.error(err.response?.data?.msg);
            return;
          }
          reset();
          toast.error('Terjadi kesalahan, silahkan coba kembali!!');
        });
    }
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

      setValue('province', value);
      setValue('region', null);
      setValue('district', null);
      setValue('ward', null);
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

      setValue('region', value);
      setValue('district', null);
      setValue('ward', null);
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
      setValue('district', value);
      setValue('ward', null);
    }

    if (type === 'kel') {
      setValue('ward', value);
    }
  };

  return (
    <Dialog open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 3 }}>
          <Typography mb={2} variant="h4">
            Tambah Data
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PerfectScrollbar style={{ maxHeight: 550 }}>
                <Grid pt={1} container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Nama"
                      fullWidth
                      {...register('name', { required: true })}
                      error={errors.name?.message}
                      helperText={errors.name?.message}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomAutocomplete
                      disabled={preview}
                      freeSolo
                      label="Provinsi"
                      name="province"
                      control={control}
                      options={areas.province}
                      getOptionLabel={(option) => option.nama}
                      onChange={(e, newValue) =>
                        handleDataArea('prov', newValue)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomAutocomplete
                      disabled={preview}
                      freeSolo
                      label="Kabupaten/Kota"
                      name="region"
                      control={control}
                      options={areas.region}
                      getOptionLabel={(option) => option.nama}
                      onChange={(e, newValue) =>
                        handleDataArea('kab', newValue)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomAutocomplete
                      disabled={preview}
                      freeSolo
                      label="Kecamatan"
                      name="district"
                      control={control}
                      options={areas.district}
                      getOptionLabel={(option) => option.nama}
                      onChange={(e, newValue) =>
                        handleDataArea('kec', newValue)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomAutocomplete
                      disabled={preview}
                      freeSolo
                      label="Kelurahan/Desa"
                      name="ward"
                      control={control}
                      options={areas.ward}
                      getOptionLabel={(option) => option.nama}
                      onChange={(e, newValue) =>
                        handleDataArea('kel', newValue)
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Kode Puskesmas"
                      fullWidth
                      {...register('code', { required: true })}
                      error={errors.code?.message}
                      helperText={errors.code?.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      fullWidth
                      select
                      label="Jenis Puskesmas"
                      {...register('type')}
                      SelectProps={{
                        native: true
                      }}
                    >
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Nomor Urut"
                      fullWidth
                      {...register('serialNum')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Desa"
                      fullWidth
                      {...register('village')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Jalan"
                      fullWidth
                      {...register('street')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="Nomor"
                      fullWidth
                      {...register('num')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="RT"
                      fullWidth
                      {...register('nbAssociate')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="RW"
                      fullWidth
                      {...register('ctAssociate')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="Kode POS"
                      fullWidth
                      {...register('posCode')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="Telp"
                      fullWidth
                      {...register('phone')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      label="Fax"
                      fullWidth
                      {...register('fax')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomDatePicker
                      fullWidth
                      name="year"
                      label="Tahun"
                      control={control}
                      openTo="year"
                      views={['year']}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Email"
                      type="email"
                      fullWidth
                      {...register('email')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Kontak Person"
                      fullWidth
                      {...register('cp')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Status Pemekaran"
                      fullWidth
                      {...register('status')}
                    />
                  </Grid>
                </Grid>
              </PerfectScrollbar>
            </Grid>

            <Grid item xs={12}>
              <Stack justifyContent="flex-end" direction="row" gap={1}>
                {!preview && (
                  <Button type="submit" variant="contained" color="primary">
                    Simpan
                  </Button>
                )}
                <Button
                  onClick={() => {
                    onClose();
                  }}
                  variant="contained"
                  color="grey"
                >
                  {preview ? 'Tutup' : 'Batal'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Dialog>
  );
};

export default FormAdd;
