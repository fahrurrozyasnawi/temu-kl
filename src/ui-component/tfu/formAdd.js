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
import { AuthContext } from 'contexts/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import { MasterDataContext } from 'contexts/MasterData';

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
  const { publicHealths, getPublicHealths } = useContext(MasterDataContext);

  const initialValues = {
    name: data?.name || '',
    type: data?.type || '',
    desc: data?.desc || '',
    address: data?.address || '',
    province: dataUser?.province || null,
    region: dataUser?.region || null,
    district: dataUser?.district || null,
    ward: data?.ward || null,
    area: dataUser?.puskesmas?.name || '',
    areaId: dataUser?.puskesmas?._id || '',
    puskesmas: dataUser?.puskesmas?._id || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    type: Yup.string().required('Jenis TFU tidak boleh kosong'),
    desc: Yup.string(),
    ward: Yup.object({}).required('Data kelurahan tidak boleh kosong'),
    address: Yup.string()
  });

  // state
  const [areas, setAreas] = useState({
    province: [],
    region: [],
    district: [],
    ward: []
  });

  // console.log('user', dataUser);

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

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getPublicHealths();
    };

    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  // update state
  useEffect(() => {
    reset(initialValues);
  }, [data, reset]);

  // useEffect(() => {
  //   // test
  // },[])

  const onSubmit = async (values) => {
    if (values.puskesmas === '') {
      delete values.puskesmas;
    }
    console.log('values', values);

    if (edit) {
      await API.putTFU(data?._id, values)
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
      await API.postTFU(values)
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

  // const handlePuskesmasChange = (value) => {
  //   console.log(' value', value);
  // };

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
                {...register('name')}
                error={errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={preview}
                label="Deskripsi"
                fullWidth
                multiline
                rows={4}
                {...register('desc')}
                error={errors.desc?.message}
                helperText={errors.desc?.message}
              />
            </Grid>
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
                disabled={true}
                fullWidth
                id="outlined-select-currency"
                select
                label="Area/Puskesmas"
                {...register('area')}
                SelectProps={{
                  native: true
                }}
                error={errors.area}
                helperText={errors.area}
              >
                <option value=""></option>
                {publicHealths.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </TextField>
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
            <Grid item xs={12}>
              <TextField
                disabled={preview}
                fullWidth
                id="outlined-select-currency"
                select
                label="Jenis TFU"
                {...register('type')}
                SelectProps={{
                  native: true
                }}
                error={errors.type}
                helperText={errors.type}
              >
                <option value=""></option>
                <option value="Pasar">Pasar</option>
                <option value="Sekolah">Sekolah</option>
                <option value="Masjid">Masjid</option>
                <option value="Gereja">Gereja</option>
                <option value="Puskesmas">Puskesmas</option>
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

export default FormAdd;
