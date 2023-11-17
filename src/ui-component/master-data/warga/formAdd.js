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
    idNum: data?.idNum || null,
    village: data?.village || '',
    age: {
      ageValue: data?.age?.ageValue || '',
      ageType: data?.age?.ageType || ''
    },
    address: {
      street: data?.address?.street || '',
      nbAssociate: data?.address?.nbAssociate || '', // rt
      ctAssociate: data?.address?.ctAssociate || '', // rw
      province: data?.address?.province || null,
      region: data?.address?.region || null,
      district: data?.address?.district || null,
      ward: data?.address?.ward || null
    },
    posCode: data?.posCode || '',
    phone: data?.phone || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    idNum: Yup.string()
      .min(16, 'NIK harus 16 digit')
      .max(16, 'NIK tidak boleh lebih dari 16 digit'),
    age: Yup.object().shape({
      ageValue: Yup.number('Harap masukkan umur').required(
        'Harap masukkan umur'
      ),
      ageType: Yup.string().required('Harap masukkan umur')
    })
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
      // console.log('data', data);
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
      await API.putResident(data?._id, values)
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
      await API.postResident(values)
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

      setValue('address.province', value);
      setValue('address.region', null);
      setValue('address.district', null);
      setValue('address.ward', null);
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

      setValue('address.region', value);
      setValue('address.district', null);
      setValue('address.ward', null);
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
      setValue('address.district', value);
      setValue('address.ward', null);
    }

    if (type === 'kel') {
      setValue('address.ward', value);
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
                      {...register('name')}
                      error={errors.name?.message}
                      helperText={errors.name?.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="NIK"
                      type="number"
                      fullWidth
                      {...register('idNum')}
                      error={errors.idNum?.message}
                      helperText={errors.idNum?.message}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      label="Umur"
                      fullWidth
                      type="number"
                      {...register('age.ageValue')}
                      error={errors.age?.ageValue?.message}
                      helperText={errors.age?.ageValue?.message}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      select
                      label="Tipe"
                      fullWidth
                      {...register('age.ageType')}
                      error={errors.age?.ageType?.message}
                      helperText={errors.age?.ageType?.message}
                      SelectProps={{
                        native: true
                      }}
                    >
                      <option value=""></option>
                      <option value="bulan">Bulan</option>
                      <option value="tahun">Tahun</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled={preview}
                      label="Desa"
                      fullWidth
                      {...register('village')}
                      error={errors.village?.message}
                      helperText={errors.village?.message}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomAutocomplete
                      disabled={preview}
                      freeSolo
                      label="Provinsi"
                      name="address.province"
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
                      name="address.region"
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
                      name="address.district"
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
                      name="address.ward"
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
                      label="Jalan"
                      fullWidth
                      multiline
                      rows={3}
                      {...register('address.street')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="RT"
                      fullWidth
                      {...register('address.nbAssociate')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      disabled={preview}
                      type="number"
                      label="RW"
                      fullWidth
                      {...register('address.ctAssociate')}
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
                      type="tel"
                      label="Telp"
                      fullWidth
                      {...register('phone')}
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
