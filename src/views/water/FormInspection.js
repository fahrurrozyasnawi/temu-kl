import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import API from 'api';
import { Controller, useForm } from 'react-hook-form';
import CustomRadioGroup from 'ui-component/components/forms/CustomRadioGroup';
import { toast } from 'react-hot-toast';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { WaterContext } from 'contexts/WaterContext';

const FormInspection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const layoutMode = searchParams.get('m');
  const _id = searchParams.get('id');

  // get data saved from localStorage
  const dataGenInfoJSON = JSON.parse(localStorage.getItem('water_form_info'));

  // context
  const { dataWater, getDataWater, setDataWater } = useContext(WaterContext);

  useEffect(() => {
    if (!dataGenInfoJSON) {
      toast.error('Harap mengisi informasi umum terlebih dahulu');
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    // const fetchData = async () => {
    //   await getD
    //  }
    if (_id) {
      getDataWater(_id);
    }
  }, [_id]);

  const initialValues = {
    type: dataWater?.type || '', // jenis air
    temperature: dataWater?.temperature || '',
    precipitation: dataWater?.precipitation || '',
    year: dataWater?.year || '', // tahun konstruksi
    isFloodPlace: {
      value: dataWater?.isFloodPlace?.value || '',
      reason: dataWater?.isFloodPlace?.reason || ''
    },
    waterAvailable: {
      value: dataWater?.waterAvailable?.value || '',
      reason: dataWater?.waterAvailable?.reason || ''
    },
    loc: {
      lu: dataWater?.loc?.lu || '',
      ls: dataWater?.loc?.ls || ''
    }
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().required('Jenis Sarana tidak boleh kosong')
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

  useEffect(() => {
    watch();
  }, [watch]);

  useEffect(() => {
    if (dataWater?._id) {
      reset(initialValues);

      const year = new Date().setYear(dataWater?.year);
      setValue('year', year);
    }
  }, [dataWater]);

  const onSubmit = async (values) => {
    // console.log('values', values);
    values.year = new Date(values.year).getFullYear();

    const newValues = { ...values, ...dataGenInfoJSON };

    console.log('final values', newValues);
    if (_id) {
      await API.putWater(_id, newValues)
        .then(() => {
          localStorage.removeItem('water_form_info');
          navigate('/water');
          toast.success('Berhasil menambah data');
        })
        .catch((err) => {
          console.log('error', err);
          toast.error('Terjadi kesalahan, silahkan dicoba beberapa saat lagi');
        });
    } else {
      await API.postWater(newValues)
        .then(() => {
          localStorage.removeItem('water_form_info');
          navigate('/water');
          toast.success('Berhasil menambah data');
        })
        .catch((err) => {
          console.log('error', err);
          toast.error('Terjadi kesalahan, silahkan dicoba beberapa saat lagi');
        });
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Inspeksi Kesehatan Lingkungan</Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Jenis Sarana SAM"
                  fullWidth
                  select
                  {...register('type')}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value=""></option>
                  <option value="PPSR">
                    PERPIPAAN-SAMBUNGAN RUMAH (PP-SR)
                  </option>
                  <option value="PPKU">
                    PERPIPAAN-KERAN UMUM (PP-KU)/HYDRANT UMUM/TERMINAL AIR
                  </option>
                  <option value="SGLPT">
                    SUMBER GALI DENGAN POMPA/POMPA TANGAN (SGL-PT)
                  </option>
                  <option value="SGL">SUMBER GALI</option>
                  <option value="PMA">PENAMPUNGAN MATA AIR/MATA AIR</option>
                  <option value="PPAH)">
                    PENGUMPULAN DAN PENYIMPANAN AIR HUJAN (PPAH)
                  </option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <CustomRadioGroup
                  disabled={layoutMode === 'view'}
                  label="Temperatur"
                  name="temperature"
                  control={control}
                >
                  <FormControlLabel
                    value="0-15 derajat Celcius"
                    control={<Radio />}
                    label="0-15 derajat Celcius"
                  />
                  <FormControlLabel
                    value="15-30 derajat Celcius"
                    control={<Radio />}
                    label="15-30 derajat Celcius"
                  />
                  <FormControlLabel
                    value=">30 derajat Celcius"
                    control={<Radio />}
                    label=">30 derajat Celcius"
                  />
                </CustomRadioGroup>
              </Grid>

              <Grid item xs={12}>
                <CustomRadioGroup
                  disabled={layoutMode === 'view'}
                  label="Presipitasi Saat IKL"
                  name="precipitation"
                  control={control}
                >
                  <FormControlLabel
                    value="Hujan lebat"
                    control={<Radio />}
                    label="Hujan lebat"
                  />
                  <FormControlLabel
                    value="Hujan"
                    control={<Radio />}
                    label="Hujan"
                  />
                  <FormControlLabel
                    value=">Panas"
                    control={<Radio />}
                    label=">Panas"
                  />
                </CustomRadioGroup>
              </Grid>

              <Grid item xs={6}>
                <CustomDatePicker
                  disabled={layoutMode === 'view'}
                  label="Tahun Konstruksi"
                  name="year"
                  control={control}
                  views={['year']}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="end" gap={1}>
                  <CustomRadioGroup
                    disabled={layoutMode === 'view'}
                    label="Apakah sarana terletak di daerah banjir?"
                    name="isFloodPlace.value"
                    control={control}
                  >
                    <FormControlLabel
                      value="Ya"
                      control={<Radio />}
                      label="Ya"
                    />
                    <FormControlLabel
                      value="Tidak"
                      control={<Radio />}
                      label="Tidak"
                    />
                    <FormControlLabel
                      value="Tidak Tahu"
                      control={<Radio />}
                      label="Tidak Tahu"
                    />
                  </CustomRadioGroup>

                  {getValues('isFloodPlace.value') === 'Ya' && (
                    <TextField
                      disabled={layoutMode === 'view'}
                      label="Jika YA, jelaskan frekuensi banjir, lama dan tingkat"
                      fullWidth
                      {...register('isFloodPlace.reason')}
                    />
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" alignItems="end" gap={1}>
                  <CustomRadioGroup
                    disabled={layoutMode === 'view'}
                    label="Apakah saat ini air tersedia?"
                    name="waterAvailable.value"
                    control={control}
                  >
                    <FormControlLabel
                      value="Ya"
                      control={<Radio />}
                      label="Ya"
                    />
                    <FormControlLabel
                      value="Tidak"
                      control={<Radio />}
                      label="Tidak"
                    />
                  </CustomRadioGroup>

                  {getValues('waterAvailable.value') === 'Ya' && (
                    <CustomRadioGroup
                      disabled={layoutMode === 'view'}
                      label="Jika TIDAK, sebutkan alasannya?"
                      name="waterAvailable.reason"
                      control={control}
                    >
                      <FormControlLabel
                        value="Banjir"
                        control={<Radio />}
                        label="Banjir"
                      />
                      <FormControlLabel
                        value="Kemarau"
                        control={<Radio />}
                        label="Kemarau"
                      />
                      <FormControlLabel
                        value="Listrik Padam"
                        control={<Radio />}
                        label="Listrik Padam"
                      />
                      <FormControlLabel
                        value="Pompa/Sarana rusak"
                        control={<Radio />}
                        label="Pompa/Sarana rusak"
                      />
                    </CustomRadioGroup>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Titik GPS :</Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="LU"
                  fullWidth
                  {...register('geoLocation.lu')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="LS"
                  fullWidth
                  {...register('geoLocation.ls')}
                />
              </Grid>

              {/* button save */}
              <Grid item xs={12}>
                <Stack my={4} justifyContent="flex-end" direction="row" gap={1}>
                  {layoutMode !== 'view' ? (
                    <Button type="submit" variant="contained" color="primary">
                      Simpan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setDataWater({});
                        navigate('/water');
                        localStorage.removeItem('water_form_info');
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Tutup
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      // reset(initialValues);
                      navigate(-1);
                      // localStorage.removeItem('water_form_info');
                    }}
                    variant="contained"
                    color="grey"
                  >
                    Kembali
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Card>
  );
};

export default FormInspection;
