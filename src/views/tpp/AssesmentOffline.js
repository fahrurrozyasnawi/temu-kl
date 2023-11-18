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
import * as XLSX from 'xlsx';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TPPContext } from 'contexts/TPPContext';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import API from 'api';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import TPPAssesments from 'utils/assesments/tpp';
import { flattenData } from 'utils/generator';

const AssesmentOffline = () => {
  const { _id, type } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    tpp: _id,
    reviewer: '', // jenis (Depot, Gerai pangan, dll)
    reviewDate: undefined,
    typeCook: '', // golongan untuk jasa boga
    sentraType: '', // pengelola atau gerai untuk assesment sentra pangan jajanan
    sentraParent: undefined, // jika sentra adalah gerai maka wajib menambahkan pengelola yang terkait
    owner: ''
  };

  const validationSchema = Yup.object().shape({
    reviewer: Yup.string().required('Nama pemeriksa tidak boleh kosong'),
    reviewDate: Yup.date().required('Tanggal tidak boleh kosong')
  });

  // context
  const { getDataTPP, dataTPP, tppAssesments, getTPPAssements } =
    useContext(TPPContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);
  const [assesments, setAssesments] = useState([]);
  const [fileName, setFileName] = useState('');

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataTPP(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const handleClose = () => {
    reset(initialValues);
    setFileName('');
    navigate(-1);
  };

  const handleDocument = useCallback((acceptedFiles) => {
    console.log('file', acceptedFiles);
    const reader = new FileReader();

    const file = acceptedFiles[0];
    const filename = file.name.split('_');
    if (!filename.includes(dataTPP?.type)) {
      toast.error(`Harap masukkan file data peniliaian ${dataTPP?.type}`);
      return;
    }

    const sentraType = watch('sentraType');
    let assesmentTemplate = null;
    if (type === 'Sentra Pangan Jajanan') {
      if (!sentraType) {
        toast.error('Harap mengisi terlebih dahulu jenis sentra');
        return;
      }

      if (filename.includes(sentraType)) {
        assesmentTemplate = TPPAssesments.find(
          (i) => i.type === sentraType && i.name === dataTPP?.type
        ).assesment;
      } else {
        toast.error('Harap masukkan file dengan tipe sentra yang sesuai');
        return;
      }

      console.log('type sentra', sentraType);
    } else {
      assesmentTemplate = TPPAssesments.find(
        (i) => i.name === dataTPP?.type
      ).assesment;
    }

    // check if theres no assesment in assesmentTemplate, it will be return
    if (!assesmentTemplate) {
      toast.error('Harap masukkan file yang valid!!');
      return;
    }

    // const _flattenData = flattenData(assesmentTemplate);
    // const worksheet = XLSX.utils.json_to_sheet(_flattenData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   worksheet,
    //   'Sentra Pangan Jajanan_booth'
    // );
    // XLSX.writeFile(workbook, 'Sentra Pangan Jajanan_booth.xlsx', {
    //   compression: true
    // });

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(workSheet);
      const dataGenerated = generateAssesments(assesmentTemplate, jsonData);

      console.log('json data', jsonData);
      console.log('data', dataGenerated);

      setFileName(file.name);
      setValue('assesments', dataGenerated);
    };
    reader.readAsBinaryString(acceptedFiles[0]);
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    getValues,
    reset,
    setFocus
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    const fetchData = async () => {
      await getTPPAssements({ sentraType: 'owner' });
    };

    fetchData();
  }, [watch('sentraType')]);

  // useEffect(() => {}, [watch('sentraParent')])

  const handleSentraChange = (type, value) => {
    switch (type) {
      case 'type':
        reset(); // reset all fields first
        setFileName('');

        setValue('sentraType', value);
        break;
      case 'parent':
        setValue('sentraParent', value);
        break;

      default:
        break;
    }
  };

  const onSubmit = async (values) => {
    setIsSubmit(true);
    console.log('values', values);

    // check if user has uploaded file
    if (!fileName) {
      toast.error('Harap mengupload file terlebih dahulu!!');
      return;
    }

    // validate data
    switch (type) {
      case 'Sentra Pangan Jajanan':
        if (values.sentraType === '') {
          toast.error('Harap megisi jenis sentra');
          setFocus('sentraType');
          return;
        }

        if (values.sentraType === 'booth' && !values.sentraParent) {
          toast.error('Harap mengisi nama Pengelola');
          setFocus('sentraParent');
          return;
        }

        const sentraParent = values.sentraParent?._id;
        values.sentraParent = sentraParent;
        break;

      default:
        break;
    }
    console.log('values', values);

    let score = 0;
    const assesment = [...values.assesments];

    // values.assesments = removeScoreProperty(assesment);
    values.score = calculateScore(assesment, score);

    console.log('values', values);

    await API.postTPPAssement(values, { tppType: type })
      .then((res) => {
        console.log('success post data');
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography variant="h5">Penilaian Offline</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Nama TPP"
                    fullWidth
                    value={dataTPP.name}
                    InputLabelProps={{ shrink: !!dataTPP.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Alamat TPP"
                    fullWidth
                    value={dataTPP.address}
                    InputLabelProps={{ shrink: !!dataTPP.address }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Jenis TPP"
                    fullWidth
                    value={dataTPP.type}
                    InputLabelProps={{ shrink: !!dataTPP.type }}
                  />
                </Grid>

                {type === 'Sentra Pangan Jajanan' && (
                  <Grid item xs={12}>
                    <TextField
                      // {...register('sentraType')}
                      name={register('sentraType').name}
                      ref={register('sentraType').ref}
                      onBlur={register('sentraType').onBlur}
                      select
                      label="Jenis Sentra"
                      fullWidth
                      SelectProps={{
                        native: true
                      }}
                      onChange={(e) =>
                        handleSentraChange('type', e.target.value)
                      }
                    >
                      <option value=""></option>
                      <option value="owner">Pengelola</option>
                      <option value="booth">Gerai</option>
                    </TextField>
                  </Grid>
                )}

                {getValues('sentraType') === 'booth' && (
                  <Grid item xs={12}>
                    <CustomAutocomplete
                      freeSolo
                      label="Pengelola"
                      name="sentraParent"
                      control={control}
                      options={tppAssesments}
                      getOptionLabel={(option) => option.tpp?.name}
                      onChange={(e, newValue) =>
                        handleSentraChange('parent', newValue)
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Pemeriksa"
                    {...register('reviewer')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomDatePicker
                    name="reviewDate"
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
            </Grid>
          </Grid>
        </form>
      </Card>
    </Fragment>
  );
};

const calculateScore = (data, score) => {
  for (const item of data) {
    if (item && typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value === 'Tidak') {
          score = score + item.score;
        }
        if (key === 'children' && Array.isArray(item.children)) {
          score = calculateScore(item.children, score);
        }
      }
    }
  }

  return score;
};

const generateAssesments = (template, xlsx) => {
  return template.map((obj) => {
    const matchingName = xlsx.find(
      (item) => item['VARIABEL/KOMPONEN'] === obj.name
    );

    if (matchingName && obj.hasOwnProperty('value')) {
      if (matchingName.hasOwnProperty('NILAI')) {
        obj.value = matchingName.NILAI;
      } else {
        obj.value = '';
      }
    }

    if (obj.children) {
      obj.children = generateAssesments(obj.children, xlsx);
    }

    return obj;
  });
};

export default AssesmentOffline;
