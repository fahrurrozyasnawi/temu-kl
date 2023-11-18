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
    type: data?.type || '', // jenis (Depot, Gerai pangan, dll)
    address: data?.address || '',
    addressData: {
      province: dataUser?.province || null,
      region: dataUser?.region || null,
      district: dataUser?.district || null,
      ward: data?.ward || null
    },
    owner: data?.owner || '', // pengelola/pemilik/penanggung jawab
    nHandler: data?.nHandler || '', // jumlah penjamah pangan

    // gerai pangan
    NIB: data?.NIB || '', // nomor induk berusaha (gerai pangan jajanan)
    reviewer: data?.reviewer || '',
    menuRisk: data?.menuRisk || '', // menu pangan berisiko yang dijual

    // sentra pangan jajanan
    nBooth: data?.nBooth || '',

    // jasa boga
    businessNum: data?.businessNum || '',
    typeCatering: data?.typeCatering || '',

    startDate: data?.startDate ? new Date(data?.startDate) : undefined,
    location: data?.location || '', // lokasi/tempat sumber air baku
    buildingArea: data?.buildingArea || '',
    assesmentDate: data?.assesmentDate
      ? new Date(data?.assesmentDate)
      : undefined,
    nSale: data?.nSale || '', // jumlah  yang dijual per hari
    nDaysSale: data?.nDaysSale || '' // jumlah hari berjualan
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    type: Yup.string().required('Jenis TPP tidak boleh kosong'),
    address: Yup.string(),
    nHandler: Yup.number(),
    assesmentDate: Yup.string().required('Harap masukkann tanggal penilaian'),
    owner: Yup.string().required('Penanggung jawab tidak boleh kosong')
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

  // update state
  useEffect(() => {
    reset(initialValues);
  }, [data, reset]);

  useEffect(() => {
    // watch('type');
  }, [watch('type')]);

  const onSubmit = async (values) => {
    switch (values.type) {
      case 'Depot':
        if (values.startDate === '') {
          toast.error('Harap mengisi Tanggal Mulai Beroperasi');
          return;
        }
        break;
      case 'Gerai Pangan Jajanan':
      case 'Sentra Pangan Jajanan':
        if (values.NIB === '') {
          toast.error('Harap mengisi Nomor Induk Berusaha');
          return;
        }
        break;
      case 'Jasa Boga':
        if (values.businessNum === '') {
          toast.error('Harap mengisi Nomor izin usaha');
          return;
        }
        if (values.typeCatering === '') {
          toast.error('Harap mengisi Tipe Jasa Boga/Katering');
          return;
        }
        break;
      default:
        break;
    }
    console.log('values', values);

    if (edit) {
      await API.putTPP(data?._id, values)
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
      await API.postTPP(values)
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
    reset(initialValues);

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

      setValue('addressData.province', value);
      setValue('addressData.region', null);
      setValue('addressData.district', null);
      setValue('addressData.ward', null);
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

      setValue('addressData.region', value);
      setValue('addressData.district', null);
      setValue('addressData.ward', null);
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
      setValue('addressData.district', value);
      setValue('addressData.ward', null);
    }

    if (type === 'kel') {
      setValue('addressData.ward', value);
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
                label="Jenis TPP"
                // {...register('type')}
                ref={register('type').ref}
                SelectProps={{
                  native: true
                }}
                error={errors.type}
                helperText={errors.type}
              >
                <option value=""></option>
                <option value="Depot">Depot</option>
                <option value="Gerai Pangan Jajanan">
                  Gerai Pangan Jajanan
                </option>
                <option value="Sentra Pangan Jajanan">
                  Sentra Pangan Jajanan
                </option>
                <option value="Jasa Boga">Jasa Boga</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={preview}
                label={
                  TPPAssesments.find((i) => i.name === getValues('type'))
                    ?.nameLabel || 'Nama'
                }
                fullWidth
                {...register('name')}
                error={errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomAutocomplete
                disabled={true}
                freeSolo
                label="Provinsi"
                name="addressData.province"
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
                name="addressData.region"
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
                name="addressData.district"
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
                name="addressData.ward"
                control={control}
                options={areas.ward}
                getOptionLabel={(option) => option.nama}
                onChange={(e, newValue) => handleDataArea('kel', newValue)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={preview}
                label="Nama Pengelola/Pemilik/Penanggung Jawab"
                fullWidth
                {...register('owner')}
              />
            </Grid>

            {getValues('type') === 'Sentra Pangan Jajanan' ? (
              <Grid item xs={12}>
                <TextField
                  disabled={preview}
                  type="number"
                  label="Nomor Induk Berusaha"
                  fullWidth
                  {...register('NIB')}
                />
              </Grid>
            ) : getValues('type') === 'Gerai Pangan Jajanan' ? (
              <Grid item xs={12}>
                <TextField
                  disabled={preview}
                  type="number"
                  label="Nomor Induk Berusaha"
                  fullWidth
                  {...register('NIB')}
                />
              </Grid>
            ) : null}

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
                type="number"
                label="Jumlah Penjamah Pangan/Operator DAM"
                {...register('nHandler')}
              />
            </Grid>

            {getValues('type') === 'Jasa Boga' && (
              <Fragment>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Nomor Izin Usaha"
                    {...register('businessNum')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Tipe Jasa Boga/Katering"
                    id="outlined-select-currency"
                    select
                    SelectProps={{
                      native: true
                    }}
                    {...register('typeCatering')}
                  >
                    <option value=""></option>
                    <option value="A">Golongan A</option>
                    <option value="B">Golongan B</option>
                    <option value="C">Golongan C</option>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah porsi yang dijual/hari"
                    {...register('nSale')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah hari berjualan"
                    {...register('nDaysSale')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Menu pangan berisiko yang dijual"
                    {...register('menuRisk')}
                  />
                </Grid>
              </Fragment>
            )}

            {getValues('type') === 'Sentra Pangan Jajanan' && (
              <Fragment>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah Gerai"
                    {...register('nBooth')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah porsi yang dijual/hari"
                    {...register('nSale')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah hari berjualan"
                    {...register('nDaysSale')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Menu pangan berisiko yang dijual"
                    {...register('menuRisk')}
                  />
                </Grid>
              </Fragment>
            )}

            {getValues('type') === 'Gerai Pangan Jajanan' && (
              <Fragment>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Lokasi Dapur Gerai Pangan"
                    {...register('location')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah porsi yang dijual/hari"
                    {...register('nSale')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah hari berjualan"
                    {...register('nDaysSale')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Menu pangan berisiko yang dijual"
                    {...register('menuRisk')}
                  />
                </Grid>
              </Fragment>
            )}

            {getValues('type') === 'Depot' && (
              <Fragment>
                <Grid item xs={12}>
                  <CustomDatePicker
                    disabled={preview}
                    format="dd/MM/yyyy"
                    control={control}
                    name="startDate"
                    label="Tanggal/Bulan/Tahun Mulai Beroperasi"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Lokasi/Tempat Sumber Air Baku"
                    {...register('location')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    label="Luas Bangunan"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">m</InputAdornment>
                      )
                    }}
                    {...register('buildingArea')}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah galon yang dijual/hari"
                    {...register('nSale')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    disabled={preview}
                    fullWidth
                    type="number"
                    label="Jumlah hari berjualan"
                    {...register('nDaysSale')}
                  />
                </Grid>
              </Fragment>
            )}

            <Grid item xs={12}>
              <CustomDatePicker
                disabled={preview}
                format="dd/MM/yyyy"
                control={control}
                name="assesmentDate"
                label="Tanggal Penilaian"
              />
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
                    reset(initialValues);
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
