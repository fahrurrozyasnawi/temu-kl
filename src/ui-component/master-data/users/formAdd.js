import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import API from 'api';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import CustomTextField from 'ui-component/components/forms/CustomTextField';
import { MasterDataContext } from 'contexts/MasterData';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
    picture: data?.picture || '',
    username: data?.username || '',
    province: data?.province || null,
    region: data?.region || null,
    district: data?.district || null,
    ward: data?.ward || null,
    area: data?.area || '', // Area User
    status: data?.status || '',
    level: data?.level || '',
    permissions: data?.permissions || [],
    puskesmas: data?.puskesmas?._id || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    username: Yup.string()
      .email('Harap masukkan email yang valid')
      .required('Harap masukkan username berupa email anda'),
    password: edit
      ? Yup.string()
      : Yup.string().required('Password tidak boleh kosong')
  });

  // context
  const { publicHealths } = useContext(MasterDataContext);

  // state
  const [areas, setAreas] = useState({
    province: [],
    region: [],
    district: [],
    ward: []
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
    if (values.puskesmas === '') {
      delete values.puskesmas;
    }

    if (edit) {
      await API.putUser(data?._id, values)
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
      await API.postUser(values)
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

  const handleUserAccess = (value) => {
    const permission = userAccess.find((i) => i.value === value).exclude;

    setValue('level', value);
    setValue('permissions', permission);
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
              <TextField
                disabled={preview}
                label="Nama"
                fullWidth
                {...register('name', { required: true })}
                error={errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={preview}
                label="Email"
                type="email"
                fullWidth
                {...register('username', { required: true })}
                error={errors.username?.message}
                helperText={errors.username?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={preview}
                fullWidth
                select
                label="Puskesmas"
                {...register('puskesmas')}
                SelectProps={{
                  native: true
                }}
              >
                <option value=""></option>
                {publicHealths.map((item, index) => (
                  <option value={item._id} key={index}>
                    {item.name}
                  </option>
                ))}
              </TextField>
            </Grid>

            {!edit ? (
              !preview ? (
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    {...register('password', { required: true })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              ) : null
            ) : null}

            <Grid item xs={6}>
              <CustomAutocomplete
                disabled={preview}
                freeSolo
                label="Provinsi"
                name="province"
                control={control}
                options={areas.province}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('prov', newValue)}
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
                onChange={(e, newValue) => handleDataArea('kab', newValue)}
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
                onChange={(e, newValue) => handleDataArea('kec', newValue)}
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
                onChange={(e, newValue) => handleDataArea('kel', newValue)}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <CustomTextField
                select
                fullWidth
                name="level"
                control={control}
                label="User Access"
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="volunteer">Petugas</MenuItem>
              </CustomTextField> */}
              <TextField
                disabled={preview}
                fullWidth
                select
                label="User Access"
                {...register('level')}
                onChange={(e) => handleUserAccess(e.target.value)}
                SelectProps={{
                  native: true
                }}
              >
                <option value=""></option>
                <option value="admin">Admin</option>
                <option value="healthworker">Petugas Puskesmas</option>
                <option value="cadre">Kader</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={preview}
                fullWidth
                select
                label="Status"
                {...register('status')}
                SelectProps={{
                  native: true
                }}
              >
                <option value=""></option>
                <option value="active">Aktif</option>
                <option value="deactive">Non Aktif</option>
              </TextField>
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

const userAccess = [
  { label: 'Admin', value: 'admin', exclude: [] },
  {
    label: 'Putugas Psukesmas',
    value: 'healthworker',
    exclude: [
      'user:add',
      'user:delete',
      'user:edit',
      'puskesmas:add',
      'puskesmas:edit',
      'puskesmas:delete'
    ]
  },
  {
    label: 'Kader',
    value: 'cadre',
    exclude: [
      'user:all',
      'user:add',
      'user:activate',
      'user:delete',
      'user:edit',
      'puskesmas:add',
      'puskesmas:edit',
      'puskesmas:delete',
      'document:add',
      'document:edit',
      'document:delete',
      'tfu:all',
      'tpp:all',
      'water:all',
      'hh:all',
      'sanitary:all',
      'report:delete'
    ]
  }
];

export default FormAdd;
