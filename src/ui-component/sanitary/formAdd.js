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
  govermentState: undefined,
  district: undefined,
  healthPublic: '',
  district: undefined,

  // status card
  registerNum: '',
  name: '',
  familyName: '',
  gender: '',
  age: {
    value: '',
    ageType: ''
  },
  job: '',
  address: {
    name: '',
    nbAssociate: '', // rt
    ctAssociate: '', // rw
    ward: undefined
  },
  class: '', // Golongan (Umum, Askes, dll)
  type: '' // jenis penyakit
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
  const { publicHealths } = useContext(MasterDataContext);

  const initialValues = {
    govermentState: data?.govermentState || undefined,
    district: data?.district || undefined,
    healthPublic: data?.healthPublic || '',

    // status card
    registerNum: data?.registerNum || '',
    name: data?.name || '',
    familyName: data?.familyName || '',
    gender: data?.gender || '',
    age: {
      value: data?.age?.value || '',
      ageType: data?.age?.ageType || ''
    },
    job: data?.job || '',
    address: {
      name: data?.address?.name || '',
      hamlet: data?.address?.hamlet || '',
      nbAssociate: data?.address?.nbAssociate || '', // rt
      ctAssociate: data?.address?.ctAssociate || '', // rw
      ward: data?.address?.ward || undefined
    },
    class: {
      value: data?.class?.value || '',
      other: data?.class?.other || ''
    } // Golongan (Umum, Askes, dll)
  };

  const validationSchema = Yup.object().shape({
    healthPublic: Yup.string().required('Puskesmas tidak boleh kosong'),
    name: Yup.string().required('Nama tidak boleh kosong')
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
    // set data area
    setValue('healthPublic', dataUser?.puskesmas?._id);
    // setValue('region', dataUser?.region);
    setValue('govermentState', dataUser?.region);
    setValue('district', dataUser?.district);
  }, []);

  useEffect(() => {}, [watch('class.value')]);

  const onSubmit = async (values) => {
    console.log('values', values);

    if (edit) {
      await API.putSanitary(data?._id, values)
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
      await API.postSanitary(values)
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
  // console.log('puskesmas', publicHealths);
  // console.log('data user', dataUser);

  return (
    <Dialog open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 3 }}>
          <Typography mb={2} variant="h4">
            Tambah Data
          </Typography>
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <TextField
                disabled={preview || edit}
                fullWidth
                id="outlined-select-currency"
                select
                label="Jenis Penyakit"
                {...register('type')}
                SelectProps={{
                  native: true
                }}
                error={errors.type}
                helperText={errors.type}
              >
                <option value=""></option>
                <option value="Diare">Diare</option>
                <option value="Malaria">Malaria</option>
                <option value="Demam Berdarah Dengue">
                  Demam Berdarah Dengue (DBD)
                </option>
                <option value="Kulit">Kulit</option>
                <option value="Kecacingan">Kecacingan</option>
                <option value="ISPA">ISPA</option>
                <option value="TBP">TB Paru</option>
              </TextField>
            </Grid> */}

            <Grid item xs={6}>
              <CustomAutocomplete
                freeSolo
                label="Pemerintah Daerah Kabupaten/Kota"
                name="govermentState"
                control={control}
                options={areas.region}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('kab', newValue)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                disabled={true}
                fullWidth
                id="outlined-select-currency"
                select
                label="Puskesmas"
                {...register('healthPublic')}
                SelectProps={{
                  native: true
                }}
                error={errors.healthPublic}
                helperText={errors.healthPublic}
              >
                <option value=""></option>
                {publicHealths.map((item, index) => (
                  <option value={item._id} key={index}>
                    {item.name}
                  </option>
                ))}
              </TextField>
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
                label="Nama pasien/klien"
                {...register('name')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={preview}
                fullWidth
                label="Nama KK"
                {...register('familyName')}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" gap={2} alignItems="end">
                <TextField
                  disabled={preview}
                  label="Umur"
                  type="number"
                  fullWidth
                  {...register('age.value')}
                />
                <TextField
                  disabled={preview}
                  fullWidth
                  select
                  SelectProps={{
                    native: true
                  }}
                  {...register('age.ageType')}
                >
                  <option value="day">Hari</option>
                  <option value="month">Bulan</option>
                  <option value="year">Tahun</option>
                </TextField>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={preview}
                fullWidth
                label="Alamat"
                multiline
                rows={2}
                {...register('address.name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={preview}
                fullWidth
                label="Dusun"
                {...register('address.hamlet')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled={preview}
                fullWidth
                type="number"
                label="RT"
                {...register('address.nbAssociate')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled={preview}
                fullWidth
                type="number"
                label="RW"
                {...register('address.ctAssociate')}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                disabled={preview}
                freeSolo
                label="Desa"
                name="address.ward"
                control={control}
                options={areas.ward}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('kel', newValue)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                disabled={preview}
                fullWidth
                select
                label="Golongan"
                SelectProps={{
                  native: true
                }}
                {...register('class.value')}
              >
                <option value=""> </option>
                <option value="Umum">Umum</option>
                <option value="Askes">Askes</option>
                <option value="Lainnya">Lainnya</option>
              </TextField>
            </Grid>

            {getValues('class.value') === 'Lainnya' && (
              <Grid item xs={6}>
                <TextField
                  disabled={preview}
                  fullWidth
                  label="Lainnya"
                  {...register('class.other')}
                />
              </Grid>
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
