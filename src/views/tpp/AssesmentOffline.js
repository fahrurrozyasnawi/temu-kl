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

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TPPContext } from 'contexts/TPPContext';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { useForm } from 'react-hook-form';

const AssesmentOffline = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  // context
  const { getDataTPP, dataTPP } = useContext(TPPContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);
  const [assesments, setAssesments] = useState([]);

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataTPP(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const handleDocument = useCallback((acceptedFiles) => {
    console.log('file', acceptedFiles);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(workSheet);

      console.log('data', jsonData);
    };
    reader.readAsBinaryString(acceptedFiles[0]);
  });

  const { handleSubmit, control, register } = useForm();

  const onSubmit = (values) => {
    console.log('values', values);
  };

  return (
    <Fragment>
      <Box mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
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
                <DocumentUpload onDrop={handleDocument} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" gap={2} justifyContent="flex-end">
                  <Button disableElevation variant="contained" color="primary">
                    Simpan
                  </Button>
                  <Button
                    disableElevation
                    variant="contained"
                    color="grey"
                    onClick={() => navigate(-1)}
                  >
                    Batal
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Fragment>
  );
};

export default AssesmentOffline;
