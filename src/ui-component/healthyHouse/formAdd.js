import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import API from 'api';
import { AuthContext } from 'contexts/AuthContext';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import { MasterDataContext } from 'contexts/MasterData';
import TPPAssesments from 'utils/assesments/tpp';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';

const initialValuesReset = {
  name: '',
  type: '',
  address: '',

  // jamban sehat
  location: '',
  nUsed: '',
  job: '',
  visitDate: '',

  // rumah sehat
  nFamily: '',
  assesmentDate: '',
  assesmentPerson: '',
  province: '',
  region: '',
  district: '',
  ward: ''
};

const FormAdd = ({
  open,
  onClose,
  edit,
  data,
  updateState,
  preview = false
}) => {
  // context
  const { dataUser } = useContext(AuthContext);

  const initialValues = {
    name: data?.name || '',
    type: data?.type || '',
    address: data?.address || '',

    // jamban sehat
    location: data?.location || '',
    nUsed: data?.nUsed || undefined,
    job: data?.job || '',
    visitDate: data?.visitDate ? new Date(data?.visitDate) : undefined,

    // rumah sehat
    nFamily: data?.nFamily || '',
    assesmentDate: data?.assesmentDate
      ? new Date(data?.assesmentDate)
      : undefined,
    assesmentPerson: data?.assesmentPerson || '',
    province: data?.province || undefined,
    region: data?.region || undefined,
    district: data?.district || undefined,
    ward: data?.ward || undefined
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    type: Yup.string().required('Jenis TPP tidak boleh kosong'),
    address: Yup.string().required('Alamat tidak boleh kosong')
  });

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
    watch,
    getValues,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      let data = areas;

      try {
        data = (
          await API.getDataArea({ level: 4, parent: dataUser?.district?.kode })
        ).data?.data?.map((i) => ({
          kode: i.kode,
          nama: i.nama
        }));
        // console.log('data', data);
        setAreas((prev) => ({ ...prev, ward: data }));
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchData();
  }, [dataUser]);

  // update state
  useEffect(() => {
    reset(initialValues);
  }, [data, reset]);

  useEffect(() => {
    if (getValues('type') === 'Sanitasi Rumah Sehat') {
      // set data area
      setValue('province', dataUser?.province);
      setValue('region', dataUser?.region);
      setValue('district', dataUser?.district);
    }
  }, [watch('type')]);

  const onSubmit = async (values) => {
    switch (values.type) {
      case 'Sanitasi Rumah Sehat':
        if (!values.ward) {
          toast.error('Harap mengisi Desa/Kelurahan');
          return;
        }
        break;
      case 'Jamban Keluarga':
        if (!values.location) {
          toast.error('Harap mengisi Lokasi Puskesmas');
          return;
        }
        if (!values.job) {
          toast.error('Harap mengisi Pekerjaan');
          return;
        }
        if (!values.nUsed) {
          toast.error('Harap mengisi Jumlah Pemakai');
          return;
        }
        break;
      default:
        break;
    }
    console.log('values', values);

    if (edit) {
      await API.putHealthyHouse(data?._id, values)
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
      await API.postHealthyHouse(values)
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

  const handleTypeTPP = (value) => {
    console.log('run');
    const { type, ...rest } = initialValuesReset;

    reset(rest);

    setValue('ward', null);
    setValue('type', value);
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
  // console.log('get values', watch('type'));

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
                disabled={preview || edit}
                fullWidth
                id="outlined-select-currency"
                select
                name={register('type').name}
                onBlur={register('type').onBlur}
                onChange={(e) => handleTypeTPP(e.target.value)}
                label="Jenis Sanitasi"
                // {...register('type')}
                ref={register('type').ref}
                SelectProps={{
                  native: true
                }}
                error={errors.type}
                helperText={errors.type}
              >
                <option value=""></option>
                <option value="Sanitasi Rumah Sehat">
                  Sanitasi Rumah Sehat
                </option>
                <option value="Jamban Keluarga">Jamban Keluarga</option>
              </TextField>
            </Grid>

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
                fullWidth
                label="Alamat"
                multiline
                rows={2}
                {...register('address')}
              />
            </Grid>

            {getValues('type') === 'Sanitasi Rumah Sehat' && (
              <Fragment>
                <Grid item xs={6}>
                  <CustomAutocomplete
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah Anggota Keluarga"
                    {...register('nFamily')}
                  />
                </Grid>
              </Fragment>
            )}

            {getValues('type') === 'Jamban Keluarga' && (
              <Fragment>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Lokasi Puskesmas"
                    {...register('location')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Pekerjaan"
                    {...register('job')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah Pemakai"
                    {...register('nUsed')}
                  />
                </Grid>
              </Fragment>
            )}

            <Grid item xs={12}>
              <Stack justifyContent="flex-end" direction="row" gap={1}>
                {!preview && (
                  <Button type="submit" variant="contained" color="primary">
                    Simpan
                  </Button>
                )}
                <Button
                  onClick={() => {
                    reset(initialValuesReset);
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
