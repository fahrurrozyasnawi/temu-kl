import { AuthContext } from 'contexts/AuthContext';
import { SanitaryContext } from 'contexts/SanitaryContext';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import API from 'api';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Counseling = () => {
  const { _id } = useParams();
  const [searchParams] = useSearchParams();
  const isModePreview = searchParams.get('mode');
  const navigate = useNavigate();

  // context
  const { dataUser } = useContext(AuthContext);
  const { dataSanitaryAssesment, getDataSanitaryAssement } =
    useContext(SanitaryContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataSanitaryAssement(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const initialValues = {
    isHaveCounseling: true,
    counselingDate: undefined,
    counseling: {
      condition: '', // kondisi/problem
      recommend: '' // saran/rekomendasi
    },
    result: '',
    intervention: ''
  };

  const validationSchema = Yup.object().shape({
    counselingDate: Yup.date().required('Tanggal tidak boleh kosong')
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    if (isModePreview) {
      const _initialValues = {
        counselingDate: new Date(dataSanitaryAssesment?.counselingDate),
        counseling: {
          condition: dataSanitaryAssesment?.condition, // kondisi/problem
          recommend: dataSanitaryAssesment?.recommend // saran/rekomendasi
        },
        result: dataSanitaryAssesment?.result,
        intervention: dataSanitaryAssesment?.intervention
      };

      reset(_initialValues);
    }
  }, [dataSanitaryAssesment]);

  const onSubmit = async (values) => {
    console.log('values', values);
    setIsSubmit(true);

    await API.putSanitaryAssement(_id, values)
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
    <Box sx={{ pb: 4 }}>
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Konseling</Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomDatePicker
                label="Tanggal Konseling"
                name="counselingDate"
                format="dd/MM/yyyy"
                control={control}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Kondisi/Problem"
                {...register('counseling.condition')}
                InputLabelProps={{
                  shrink:
                    dataSanitaryAssesment.counseling?.condition || undefined
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Saran/Rekomendasi"
                {...register('counseling.recommend')}
                InputLabelProps={{
                  shrink:
                    dataSanitaryAssesment.counseling?.recommend || undefined
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Hasil"
                {...register('result')}
                InputLabelProps={{
                  shrink: dataSanitaryAssesment.result || undefined
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Intervensi"
                {...register('intervention')}
                InputLabelProps={{
                  shrink: dataSanitaryAssesment.intervention || undefined
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" gap={1}>
                {!isModePreview && (
                  <Button
                    disabled={isSubmit}
                    disableElevation
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Simpan
                  </Button>
                )}
                <Button
                  disableElevation
                  variant="contained"
                  color="grey"
                  onClick={() => navigate(-1)}
                >
                  {isModePreview ? 'Tutup' : 'Batal'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
};

export default Counseling;
