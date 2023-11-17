import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFormik, FieldArray } from 'formik';
import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router';
import SanitaryAssesments from 'utils/assesments/sanitary';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEqual } from 'lodash';
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext
} from 'react-hook-form';
import { getLabel } from 'utils/generator';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import API from 'api';
import { toast } from 'react-hot-toast';
import BaseFormComponent from './baseForm';
import { SanitaryContext } from 'contexts/SanitaryContext';
import { AuthContext } from 'contexts/AuthContext';

const OnlineAssesment = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  // context
  const { dataUser } = useContext(AuthContext);
  const { getDataSanitary, dataSanitary } = useContext(SanitaryContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);
  const [areas, setAreas] = useState({
    province: [],
    region: [],
    district: [],
    ward: []
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataSanitary(_id);
    };

    fetchData();

    return () => {};
  }, []);

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
    reviewer: '',
    sanitary: _id,
    type: '',
    assesmentDate: ''
  };

  const validationSchema = Yup.object().shape({
    reviewer: Yup.string().required('Nama pemeriksa tidak boleh kosong'),
    type: Yup.string().required('Jenis penyakit tidak boleh kosong'),
    assesmentDate: Yup.date().required('Tanggal tidak boleh kosong')
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = methods;

  const onSubmit = async (values) => {
    let score = 0;
    // const assesment = [...values.assesments];
    // setIsSubmit(true);
    // values.assesments = removeScoreProperty(assesment);
    // values.score = calculateScore(assesment, score, type);

    console.log('values', values);

    await API.postSanitaryAssement(values)
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

  const handleTypeChange = (value) => {
    if (value) {
      console.log('running');
      const _assesments =
        SanitaryAssesments.find((i) => i.name === value)?.assesment || [];

      const assesments = processArray(_assesments);

      const baseData = SanitaryAssesments.find(
        (i) => i.name === value
      )?.baseForm;

      // console.log('assesment initial', assesments);
      const newInitialValues = { ...initialValues, baseData, assesments };

      reset(newInitialValues);
    }
    setValue('type', value);
  };

  const BaseComponent = BaseFormComponent.find(
    (i) => i.name === watch('type')
  )?.component;

  const handleDataArea = async (type, value, prefix) => {
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
      setValue(prefix, value);
    }
  };

  // console.log('type', watch('type'));
  return (
    <Box sx={{ pb: 4 }}>
      <Card sx={{ p: 3 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Typography variant="h5">Penilaian</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      label="Nama"
                      fullWidth
                      value={dataSanitary.name}
                      InputLabelProps={{ shrink: !!dataSanitary.name }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      label="Alamat"
                      fullWidth
                      value={dataSanitary.address?.name}
                      InputLabelProps={{ shrink: !!dataSanitary.address?.name }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="outlined-select-currency"
                      select
                      label="Jenis Penyakit"
                      // {...register('type')}
                      name={register('type').name}
                      ref={register('type').ref}
                      onBlur={register('type').onBlur}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      SelectProps={{
                        native: true
                      }}
                      error={errors.type}
                      helperText={errors.type}
                    >
                      <option value=""></option>
                      <option value="Diare">Diare</option>
                      <option value="Malaria">Malaria</option>
                      <option value="DBD">Demam Berdarah Dengue (DBD)</option>
                      <option value="Kulit">Kulit</option>
                      <option value="Kecacingan">Kecacingan</option>
                      <option value="ISPA">ISPA</option>
                      <option value="TBP">TB Paru</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Pemeriksa"
                      {...register('reviewer', { required: true })}
                      error={errors.reviewer?.message}
                      helperText={errors.reviewer?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomDatePicker
                      label="Tanggal Penilaian"
                      name="assesmentDate"
                      format="dd/MM/yyyy"
                      control={control}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Base Form */}
              {watch('type') && (
                <BaseComponent areas={areas} handleDataArea={handleDataArea} />
              )}
              {watch('type') && (
                <Fragment>
                  <Grid mt={4} item xs={12}>
                    <Typography variant="h5">
                      Identifikasi Masalah dan Perilaku
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      {SanitaryAssesments.find(
                        (i) => i.name === watch('type')
                      ).assesment.map((item, index) => (
                        <RenderItem
                          data={dataSanitary}
                          key={index}
                          namePrefix={`assesments.${index}`}
                          item={item}
                          parentDisabled={false}
                          index={index}
                          level={1}
                          watch={watch}
                        />
                      ))}
                    </Grid>
                  </Grid>
                </Fragment>
              )}
              <Grid item xs={12}>
                <Stack direction="row" gap={1}>
                  <Button
                    // disabled={isSubmit}
                    disableElevation
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
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
          </form>
        </FormProvider>
      </Card>
    </Box>
  );
};

// Recursive component to render items
export function RenderItem({
  // setValue,
  data,
  namePrefix,
  item,
  // control,
  parentDisabled,
  level,
  index
}) {
  const { setValue, control, getValues, watch } = useFormContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const shouldDisable = parentDisabled || isDisabled;

  // console.log('getValues data', getValues(`${namePrefix}`));
  // console.log('name prefix', namePrefix);
  // console.log('watch data', watch(`${namePrefix.value}`));

  const labelPrefix = getLabel(level, index);

  const resetChildValues = useCallback(
    (prefix, children) => {
      children.forEach((child, childIndex) => {
        const childPrefix = `${prefix}.children.${childIndex}`;
        setValue(`${childPrefix}.value`, ''); // Reset the child input value
        if (child.children) {
          resetChildValues(childPrefix, child.children); // Recursively reset values of nested children
        }
      });
    },
    [control]
  );

  return (
    <Fragment>
      {item.name && item.children && level < 2 ? (
        <Grid item xs={item.isCanDisabled ? 11 : 12}>
          <Typography
            sx={{ pl: level }}
            textTransform="capitalize"
            fontWeight="bold"
            paragraph
          >{`${labelPrefix}. ${item.name}`}</Typography>
        </Grid>
      ) : item.children ? (
        <Grid item xs={item.isCanDisabled ? 6 : 12}>
          <Typography
            sx={{ pl: level }}
            // fontWeight="bold"
            paragraph
          >{`${labelPrefix}. ${item.name}`}</Typography>
        </Grid>
      ) : (
        <Grid item xs={item.isCanDisabled ? 5 : 6}>
          <Typography
            sx={{ pl: level }}
            paragraph
          >{`${labelPrefix}. ${item.name}`}</Typography>
        </Grid>
      )}

      {item.children ? (
        <Fragment>
          <Controller
            name={`${namePrefix}.name`}
            control={control}
            defaultValue={item.name}
            render={({ field }) => <input type="hidden" {...field} />}
          />
          {item.children.map((child, childIndex) => (
            <RenderItem
              setValue={setValue}
              data={data}
              key={childIndex}
              namePrefix={`${namePrefix}.children.${childIndex}`}
              item={child}
              control={control}
              parentDisabled={shouldDisable}
              level={level + 1}
              index={childIndex}
            />
          ))}
        </Fragment>
      ) : item.options ? (
        <Grid item xs={6}>
          <Controller
            name={`${namePrefix}.name`}
            control={control}
            defaultValue={item.name}
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <Stack gap={1}>
            <Controller
              name={`${namePrefix}.value`}
              control={control}
              defaultValue={item.value}
              render={({ field }) => (
                <TextField {...field} select fullWidth size="small">
                  <MenuItem value="">Pilih..</MenuItem>
                  {item.options.map((i) => {
                    if (typeof i === 'object') {
                      return <MenuItem value={i?.name}>{i?.label}</MenuItem>;
                    }

                    return <MenuItem value={i}>{i}</MenuItem>;
                  })}
                </TextField>
              )}
            />

            {watch(`${namePrefix}.value`) === 'Lainnya' && (
              <Controller
                name={`${namePrefix}.otherValue`}
                control={control}
                defaultValue={item.otherValue}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Jika lainnya, sebutkan.."
                    fullWidth
                    size="small"
                  />
                )}
              />
            )}
            {watch(`${namePrefix}.value`) === 'others' && (
              <Controller
                name={`${namePrefix}.otherValue`}
                control={control}
                defaultValue={item.otherValue}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Sebutkan.."
                    fullWidth
                    size="small"
                  />
                )}
              />
            )}
          </Stack>
        </Grid>
      ) : (
        <Grid item xs={6}>
          <Controller
            name={`${namePrefix}.name`}
            control={control}
            defaultValue={item.name}
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <Controller
            name={`${namePrefix}.value`}
            control={control}
            defaultValue={item.value}
            render={({ field }) => (
              <TextField {...field} fullWidth size="small" />
            )}
          />
        </Grid>
      )}
    </Fragment>
  );
}

const calculateScore = (data, score, type) => {
  for (const item of data) {
    if (item && typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value === 'Ya') {
          score++;
        }
        if (key === 'children' && Array.isArray(item.children)) {
          score = calculateScore(item.children, score, type);
        }
      }
    }
  }

  return score;
};

function processArray(assesments) {
  return assesments.map((item) => {
    const newItem = {
      name: item.name,
      value: item.value
    };

    if (item.otherValue !== undefined) {
      newItem.otherValue = item.otherValue;
    }

    if (item.children && item.children.length > 0) {
      newItem.children = processArray(item.children);
    }

    return newItem;
  });
}

const removeScoreProperty = (arr) => {
  return arr.map((item) => {
    const { score, ...rest } = item;
    if (rest.children) {
      rest.children = removeScoreProperty(rest.children);
    }
    return rest;
  });
};

export default OnlineAssesment;
