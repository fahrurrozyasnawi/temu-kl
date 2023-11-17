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
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';
import { MasterDataContext } from 'contexts/MasterData';
import TPPAssesments from 'utils/assesments/tpp';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import FileUploadDropzone from 'ui-component/components/forms/FileUploadDropzone';
import { debounce } from 'lodash';

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

  // state
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState({ file: null, filename: '' });
  const [files, setFiles] = useState([]);

  const initialValues = {
    name: data?.name || '',
    type: data?.type || '', // jenis (Depot, Gerai pangan, dll)
    filename: data?.filename || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama tidak boleh kosong'),
    type: Yup.string().required('Jenis tidak boleh kosong')
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
    console.log('running');
    reset(initialValues);

    if (edit && data) {
      setFiles([{ name: data?.filename }]);
    }
  }, [data, reset]);

  console.log('data', data);

  const onSubmit = debounce(async (values) => {
    setIsSubmit(true);
    if (edit) {
      await API.putDocument(data?._id, values)
        .then((res) => {
          if (file.file) {
            onSubmitFile();
          }
          toast.success('Berhasil mengubah data');
          updateState((prev) => !prev);
          setFile({ file: null, filename: '' });
          reset();
          onClose();
          setIsSubmit(false);
        })
        .catch((err) => {
          console.log('err update user', err);
          reset();
          toast.error('Terjadi kesalahan, silakhkan coba kembali');
          setIsSubmit(false);
        });
    } else {
      await API.postDocument(values)
        .then((res) => {
          if (file.file) {
            onSubmitFile();
            toast.success('Berhasil menambah data');
            updateState((prev) => !prev);
            reset();
            setFile({ file: null, filename: '' });
            onClose();
            setIsSubmit(false);
          } else {
            toast.error('Harap memilih file terlebih dahulu');
            setIsSubmit(false);
          }
          // console.log('res', res);
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
          console.log('error', err);
          setIsSubmit(false);
        });
    }
  }, 500);

  const onSubmitFile = async () => {
    const data = new FormData();
    if (file.name !== '') {
      data.append('doc', file.file);

      await API.uploadDocument(data)
        .then(() => console.log('succes upload file'))
        .catch((err) => console.log('err image ', err));
    }
  };

  const handleDropFile = useCallback((acceptedFiles) => {
    const maxSize = 2 * 1024 * 1024;

    // const timestamps = new Date().getTime();
    console.log('files', acceptedFiles);
    acceptedFiles.forEach((file) => {
      console.log('file', file);

      if (file.size > maxSize) {
        toast.error(
          'Ukuran file terlalu besar. Pastikan ukuran file tidak lebih dari 2 MB'
        );
        return;
      }
      setFiles(acceptedFiles);
      setFile((prev) => ({
        ...prev,
        file: file,
        filename: file.name
      }));
      setValue('filename', file.name);
    });
  }, []);

  const handleRemoveFile = () => {
    setFiles([]);
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
                label="Jenis Dokumen"
                {...register('type')}
                SelectProps={{
                  native: true
                }}
                error={errors.type?.message}
                helperText={errors.type?.message}
              >
                <option value=""></option>
                <option value="content">Materi/Konten</option>
                <option value="sanitary">Klinik Sanitasi</option>
                <option value="water">Penyehatan Air</option>
                <option value="tpp">TPP</option>
                <option value="tfu">TFU</option>
                <option value="healthyHouse">Penyehatan Rumah</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={preview}
                label="Nama Dokumen"
                fullWidth
                {...register('name')}
                error={errors.name?.message}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <FileUploadDropzone
                files={files}
                title="Upload File"
                onDrop={handleDropFile}
                handleRemoveFile={handleRemoveFile}
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
