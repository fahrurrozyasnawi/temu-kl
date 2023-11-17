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
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import API from 'api';
import { Controller, useForm } from 'react-hook-form';
import CustomTimePicker from 'ui-component/components/forms/CustomTimePicker';
import CustomRadioGroup from 'ui-component/components/forms/CustomRadioGroup';
import { WaterContext } from 'contexts/WaterContext';

const FormGeneralInfo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const layoutMode = searchParams.get('m');
  const _id = searchParams.get('id');

  // get data saved from localStorage
  const dataJSON = JSON.parse(localStorage.getItem('water_form_info'));

  // context
  const { dataUser } = useContext(AuthContext);
  const { dataWater, getDataWater, setDataWater } = useContext(WaterContext);

  const [areas, setAreas] = useState({
    province: [],
    region: [],
    district: [],
    ward: []
  });

  // use effect
  useEffect(() => {
    if (_id) {
      getDataWater(_id);
    }
    if (layoutMode === 'add') {
      setDataWater({});
    }
  }, [_id, layoutMode]);

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

  const initialValues = {
    name: dataJSON?.name || dataWater?.name || '', // nama pengelola SAM
    legality: dataJSON?.legality || dataWater?.legality || '',
    letterNum: dataJSON?.letterNum || dataWater?.letterNum || '',
    address: dataJSON?.address || dataWater?.address || '',
    phone: dataJSON?.phone || dataWater?.phone || '',
    eventCode: dataJSON?.eventCode || dataWater?.eventCode || '',
    province: dataJSON?.province || dataWater?.province || undefined,
    region: dataJSON?.region || dataWater?.region || undefined,
    district: dataJSON?.district || dataWater?.district || undefined,
    ward: dataJSON?.ward || dataWater?.ward || undefined,
    class: dataJSON?.class || dataWater?.class || '',
    headWard: dataJSON?.headWard || dataWater?.headWard || '',
    phoneHeadWard: dataJSON?.phoneHeadWard || dataWater?.phoneHeadWard || '',
    isPersonQC: dataJSON?.isPersonQC || dataWater?.isPersonQC || '', // tersedia pengawas internal kualitas air minum
    trainingStatus: dataJSON?.trainingStatus || dataWater?.trainingStatus || '', // pelatihan pengawas internal kualitas air minum
    waterSource: {
      name: dataJSON?.waterSource?.name || dataWater?.waterSource?.name || '',
      mediumType:
        dataJSON?.waterSource?.mediumType ||
        dataWater?.waterSource?.mediumType ||
        '',
      condition:
        dataJSON?.waterSource?.condition ||
        dataWater?.waterSource?.condition ||
        '',
      waterPipe:
        dataJSON?.waterSource?.waterPipe ||
        dataWater?.waterSource?.waterPipe ||
        '', //sambungan air ke rumah
      timeOp:
        dataJSON?.waterSource?.timeOp || dataWater?.waterSource?.timeOp || '',
      serviceTarget:
        dataJSON?.waterSource?.serviceTarget ||
        dataWater?.waterSource?.serviceTarget ||
        ''
    },
    nInstallation: {
      ipa: dataJSON?.nInstallation?.ipa || dataWater?.nInstallation?.ipa || '',
      reservoir:
        dataJSON?.nInstallation?.reservoir ||
        dataWater?.nInstallation?.reservoir ||
        ''
    },
    nPopulate: {
      num: dataJSON?.nPopulate?.num || dataWater?.nPopulate?.num || null,
      populateType:
        dataJSON?.nPopulate?.populateType ||
        dataWater?.nPopulate?.populateType ||
        ''
    },
    nCust: {
      num: dataJSON?.nCust?.num || dataWater?.nCust?.num || null,
      populateType:
        dataJSON?.nCust?.populateType || dataWater?.nCust?.populateType || ''
    },
    scope: {
      ward: dataJSON?.scope?.ward || dataWater?.scope?.ward || '',
      district: dataJSON?.scope?.district || dataWater?.scope?.district || '',
      region: dataJSON?.scope?.region || dataWater?.scope?.region || '',
      province: dataJSON?.scope?.province || dataWater?.scope?.province || ''
    },
    isManagementRate:
      dataJSON?.isManagementRate || dataWater?.isManagementRate || '',
    rates: dataJSON?.rates || dataWater?.rates || '',
    maintenance: dataJSON?.maintenance || dataWater?.maintenance || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    address: Yup.string().required('Alamat tidak boleh kosong')
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
    reset(initialValues);
    if (!dataJSON) {
      setValue('province', dataUser?.province);
      setValue('region', dataUser?.region);
      setValue('district', dataUser?.district);
    }
  }, [dataWater]);

  useEffect(() => {
    console.log('run watch');
    // watch('');
  }, [watch('legality'), watch('isManagementRate')]);

  const onSubmit = async (values) => {
    console.log('values', values);
    const _dataJSON = JSON.stringify(values);
    localStorage.setItem('water_form_info', _dataJSON);

    // go to next page
    if (layoutMode === 'add') {
      navigate('/water/form/inspect');
    } else {
      navigate(`/water/form/inspect?m=${layoutMode}&id=${_id}`);
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
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <IconButton
            onClick={() => {
              localStorage.removeItem('water_form_info');
              navigate(-1);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Informasi Umum</Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Nama"
                  fullWidth
                  {...register('name')}
                  error={errors.name?.message}
                  helperText={errors.name?.message}
                  InputLabelProps={{ shrink: dataWater?.name || undefined }}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="end" gap={1}>
                  <CustomRadioGroup
                    disabled={layoutMode === 'view'}
                    label="Legalitas SK"
                    name="legality"
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

                  {getValues('legality') === 'Ya' && (
                    <TextField
                      disabled={layoutMode === 'view'}
                      label="No SK"
                      fullWidth
                      {...register('letterNum')}
                      error={errors.letterNum?.message}
                      helperText={errors.letterNum?.message}
                      InputLabelProps={{
                        shrink: dataWater?.letterNum || undefined
                      }}
                    />
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Alamat SAM"
                  fullWidth
                  {...register('address')}
                  error={errors.address?.message}
                  helperText={errors.address?.message}
                  InputLabelProps={{ shrink: dataWater?.address || undefined }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="No Telp/HP Penanggung Jawab"
                  fullWidth
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  helperText={errors.phone?.message}
                  InputLabelProps={{ shrink: dataWater?.phone || undefined }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Kode Penyelenggara SAM"
                  fullWidth
                  {...register('eventCode')}
                  error={errors.eventCode?.message}
                  helperText={errors.eventCode?.message}
                  InputLabelProps={{
                    shrink: dataWater?.eventCode || undefined
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <CustomAutocomplete
                  disabled={layoutMode === 'view'}
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
                  disabled={layoutMode === 'view'}
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
                  disabled={layoutMode === 'view'}
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
                  disabled={layoutMode === 'view'}
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
                <CustomRadioGroup
                  disabled={layoutMode === 'view'}
                  label="Klasifikasi Desa/Kelurahan"
                  name="class"
                  control={control}
                >
                  <FormControlLabel
                    value="Perkotaan"
                    control={<Radio />}
                    label="Perkotaan"
                  />
                  <FormControlLabel
                    value="Pedesaan"
                    control={<Radio />}
                    label="Pedesaan"
                  />
                </CustomRadioGroup>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Nama Kepala Desa/Kelurahan"
                  fullWidth
                  {...register('headWard')}
                  error={errors.headWard?.message}
                  helperText={errors.headWard?.message}
                  InputLabelProps={{ shrink: dataWater?.headWard || undefined }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="No Telp/HP Kepala Desa/Kelurahan"
                  fullWidth
                  type="tel"
                  {...register('phoneHeadWard')}
                  error={errors.phoneHeadWard?.message}
                  helperText={errors.phoneHeadWard?.message}
                  InputLabelProps={{
                    shrink: dataWater?.phoneHeadWard || undefined
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" gap={4}>
                  <CustomRadioGroup
                    disabled={layoutMode === 'view'}
                    fullWidth={false}
                    label="Tersedia pengawas internal kualitas air minumKelurahan"
                    name="isPersonQC"
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

                  <CustomRadioGroup
                    disabled={layoutMode === 'view'}
                    fullWidth={false}
                    label="Pelatihan pengawas internal kualitas air minum"
                    name="trainingStatus"
                    control={control}
                  >
                    <FormControlLabel
                      value="Sudah Terlatih"
                      control={<Radio />}
                      label="Sudah Terlatih"
                    />
                    <FormControlLabel
                      value="Bersertifikat"
                      control={<Radio />}
                      label="Bersertifikat"
                    />
                  </CustomRadioGroup>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Sumber Air :</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Nama"
                  fullWidth
                  {...register('waterSource.name')}
                  error={errors.waterSource?.name?.message}
                  helperText={errors.waterSource?.name?.message}
                  InputLabelProps={{
                    shrink: dataWater?.waterSource?.name || undefined
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Jenis Sarana"
                  fullWidth
                  {...register('waterSource.mediumType')}
                  error={errors.waterSource?.mediumType?.message}
                  helperText={errors.waterSource?.mediumType?.message}
                  InputLabelProps={{
                    shrink: dataWater?.waterSource?.mediumType || undefined
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Kondisi Sarana"
                  fullWidth
                  {...register('waterSource.condition')}
                  error={errors.waterSource?.condition?.message}
                  helperText={errors.waterSource?.condition?.message}
                  InputLabelProps={{
                    shrink: dataWater?.waterSource?.condition || undefined
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Sambungan Meteran Air ke Rumah"
                  fullWidth
                  {...register('waterSource.waterPipe')}
                  error={errors.waterSource?.waterPipe?.message}
                  helperText={errors.waterSource?.waterPipe?.message}
                  InputLabelProps={{
                    shrink: dataWater?.waterSource?.waterPipe || undefined
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <CustomTimePicker
                  disabled={layoutMode === 'view'}
                  label="Jam Operasional"
                  name="waterSource.timeOp"
                  control={control}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Target Layanan"
                  fullWidth
                  {...register('waterSource.serviceTarget')}
                  error={errors.waterSource?.serviceTarget?.message}
                  helperText={errors.waterSource?.serviceTarget?.message}
                  InputLabelProps={{
                    shrink: dataWater?.waterSource?.serviceTarget || undefined
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  Jumlah instalasi pengolahan air (Sumber air/Reservoar) :
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" gap={2}>
                  <TextField
                    disabled={layoutMode === 'view'}
                    InputProps={{
                      endAdornment: 'IPA'
                    }}
                    fullWidth
                    type="number"
                    {...register('nInstallation.ipa')}
                    InputLabelProps={{
                      shrink: dataWater?.nInstallation?.ipa || undefined
                    }}
                  />
                  <TextField
                    disabled={layoutMode === 'view'}
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: 'RESERVOIR'
                    }}
                    {...register('nInstallation.reservoir')}
                    InputLabelProps={{
                      shrink: dataWater?.nInstallation?.reservoir || undefined
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Total Populasi Rumah Tangga"
                  fullWidth
                  type="number"
                  InputProps={{
                    endAdornment: 'Kab/Kota/Kec/Kel/Desa'
                  }}
                  {...register('nPopulate.num')}
                  InputLabelProps={{
                    shrink: dataWater?.nPopulate?.num || undefined
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="Jumlah pelanggan/jumlah rumah tangga yang dilayani (Kab/Kota/Kec/Kel/Desa)"
                  fullWidth
                  InputProps={{
                    endAdornment: 'Kab/Kota/Kec/Kel/Desa'
                  }}
                  {...register('nCust.num')}
                  InputLabelProps={{
                    shrink: dataWater?.nCust?.num || undefined
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Cakupan :</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" gap={2}>
                  <TextField
                    disabled={layoutMode === 'view'}
                    InputProps={{
                      endAdornment: 'Desa'
                    }}
                    fullWidth
                    type="number"
                    {...register('scope.province')}
                    InputLabelProps={{
                      shrink: dataWater?.scope?.province || undefined
                    }}
                  />
                  <TextField
                    disabled={layoutMode === 'view'}
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: 'Kecamatan'
                    }}
                    {...register('scope.region')}
                    InputLabelProps={{
                      shrink: dataWater?.scope?.region || undefined
                    }}
                  />
                  <TextField
                    disabled={layoutMode === 'view'}
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: 'Kab/Kota'
                    }}
                    {...register('scope.district')}
                    InputLabelProps={{
                      shrink: dataWater?.scope?.district || undefined
                    }}
                  />
                  <TextField
                    disabled={layoutMode === 'view'}
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: 'Provinsi'
                    }}
                    {...register('scope.ward')}
                    InputLabelProps={{
                      shrink: dataWater?.scope?.ward || undefined
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" gap={4} alignItems="end">
                  <CustomRadioGroup
                    disabled={layoutMode === 'view'}
                    label="Ada pengelolaan tarif atau tidak"
                    name="isManagementRate"
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

                  {getValues('isManagementRate') === 'Ya' && (
                    <TextField
                      disabled={layoutMode === 'view'}
                      label="Tarif"
                      fullWidth
                      select
                      {...register('rates')}
                      SelectProps={{
                        native: true
                      }}
                    >
                      <option value=""></option>
                      <option value="Tidak Ada Tarif">Tidak Ada Tarif</option>
                      <option value="Jumlah pengumpulan biaya < biaya operasional dan pemeliharaan">
                        {
                          'Jumlah pengumpulan biaya < biaya operasional dan pemeliharaan'
                        }
                      </option>
                      <option value="Jumlah pengumpulan biaya >= biaya operasional dan pemeliharaan">
                        {
                          'Jumlah pengumpulan biaya >= biaya operasional dan pemeliharaan'
                        }
                      </option>
                      <option value="Jumlah pengumpulan biaya >= biaya operasional, pemeliharaan, pengembangan, dan cost recovery">
                        {
                          'Jumlah pengumpulan biaya >= biaya operasional, pemeliharaan, pengembangan, dan cost recovery'
                        }
                      </option>
                    </TextField>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  disabled={layoutMode === 'view'}
                  label="BOP Pemeliharaan"
                  fullWidth
                  select
                  {...register('rates')}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value=""></option>
                  <option value="100.000 s/d 1.000.000 per bulan">
                    100.000 s/d 1.000.000 per bulan
                  </option>
                  <option value="1.000.000 s/d 2.500.000 per bulan">
                    1.000.000 s/d 2.500.000 per bulan
                  </option>
                  <option value="2.500.000 s/d 5.000.000 per bulan">
                    2.500.000 s/d 5.000.000 per bulan
                  </option>
                  <option value="> 5.000.000 per bulan">
                    {'> 5.000.000 per bulan'}
                  </option>
                </TextField>
              </Grid>

              {/* button save */}
              <Grid item xs={12}>
                <Stack my={4} justifyContent="flex-end" direction="row" gap={1}>
                  <Button type="submit" variant="contained" color="primary">
                    Lanjut
                  </Button>
                  <Button
                    onClick={() => {
                      // reset(initialValues);
                      navigate(-1);
                      localStorage.removeItem('water_form_info');
                    }}
                    variant="contained"
                    color="grey"
                  >
                    Batal
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

export default FormGeneralInfo;
