import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentUpload from 'ui-component/components/DocumentUpload';
import HealthyHouseAssesments from 'utils/assesments/healthyHouse';
import * as XLSX from 'xlsx';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { HealthyHouseContext } from 'contexts/HealthyHouseContext';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import API from 'api';

const AssesmentOffline = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    hh: _id,
    reviewer: '', // jenis (Depot, Gerai pangan, dll)
    assesmentDate: undefined
  };

  const validationSchema = Yup.object().shape({
    reviewer: Yup.string().required('Nama pemeriksa tidak boleh kosong'),
    assesmentDate: Yup.date().required('Tanggal tidak boleh kosong')
  });

  // context
  const { getDataHealthyHouse, dataHealthyHouse } =
    useContext(HealthyHouseContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileName, setFileName] = useState('');

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataHealthyHouse(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const handleClose = () => {
    reset(initialValues);
    setFileName('');
    navigate(-1);
  };

  console.log('data tfu', dataHealthyHouse);

  const handleDocument = useCallback((acceptedFiles) => {
    console.log('file', acceptedFiles);
    const reader = new FileReader();

    // validate data
    // If filename doesnt match with type, it will be return alert
    const file = acceptedFiles[0];
    const filename = file.name.split('_');
    console.log('file name ', filename);
    if (!filename.includes(dataHealthyHouse?.type)) {
      toast.error(
        `Harap masukkan file data peniliaian ${dataHealthyHouse?.type}`
      );
      return;
    }

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(workSheet);

      const assesmentTemplate = HealthyHouseAssesments.find(
        (i) => i.name === dataHealthyHouse?.type
      ).assesment;

      const dataGenerated = generateAssesments(assesmentTemplate, jsonData);

      console.log('data generated', dataGenerated);
      setValue('assesments', dataGenerated);
      setFileName(file.name);
    };
    reader.readAsBinaryString(acceptedFiles[0]);
  });

  const {
    handleSubmit,
    reset,
    control,
    register,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  const onSubmit = async (values) => {
    setIsSubmit(true);

    // check if user has uploaded file
    if (!fileName) {
      toast.error('Harap mengupload file terlebih dahulu!!');
      return;
    }

    console.log('values', values);
    await API.postHealthyHouseAssement(values, { type: dataHealthyHouse?.type })
      .then((res) => {
        console.log('success post data');
        setFileName('');
        navigate(-1);
        toast.success('Berhasil menambah data');
      })
      .catch((err) => {
        console.log('err post tpp assesment', err);
        toast.error('Terjadi kesalahan, silahkan dicoba beberapa saat lagi');
      });
  };

  return (
    <Fragment>
      <Box mb={2}>
        <IconButton onClick={() => handleClose()}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5">Penilaian Offline</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Nama TFU"
                    fullWidth
                    value={dataHealthyHouse.name}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Alamat TFU"
                    fullWidth
                    value={dataHealthyHouse.address}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.address }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Jenis TFU"
                    fullWidth
                    value={dataHealthyHouse.type}
                    InputLabelProps={{ shrink: !!dataHealthyHouse.type }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Pemeriksa"
                    {...register('reviewer')}
                    error={errors.reviewer?.message}
                    helperText={errors.reviewer?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomDatePicker
                    name="assesmentDate"
                    format="dd/MM/yyyy"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DocumentUpload onDrop={handleDocument} filename={fileName} />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" gap={2} justifyContent="flex-end">
                    <Button
                      type="submit"
                      disableElevation
                      disabled={isSubmit}
                      variant="contained"
                      color="primary"
                    >
                      Simpan
                    </Button>
                    <Button
                      disableElevation
                      variant="contained"
                      color="grey"
                      onClick={() => handleClose()}
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
    </Fragment>
  );
};

const generateAssesments = (template, xlsx) => {
  return template.map((obj) => {
    const matchingName = xlsx.find(
      (item) => item['VARIABEL/KOMPONEN'] === obj.name
    );

    if (matchingName && obj.hasOwnProperty('value')) {
      if (matchingName['NILAI']) {
        obj.value = 'Ya';
      } else {
        obj.value = 'Tidak';
      }
    }

    if (obj.children) {
      obj.children = generateAssesments(obj.children, xlsx);
    }

    return obj;
  });
};

export default AssesmentOffline;
