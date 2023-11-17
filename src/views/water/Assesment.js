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
import WaterAssesments, { waterTypes } from 'utils/assesments/water';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEqual } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { WaterContext } from 'contexts/WaterContext';
import { getLabel } from 'utils/generator';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import API from 'api';
import { toast } from 'react-hot-toast';

const OnlineAssesment = () => {
  const { _id, type } = useParams();
  console.log('type', type);
  const navigate = useNavigate();

  // context
  const { getDataWater, dataWater } = useContext(WaterContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataWater(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const initialValues = {
    reviewer: '',
    reviewDate: ''
  };

  const validationSchema = Yup.object().shape({
    reviewer: Yup.string().required('Nama pemeriksa tidak boleh kosong'),
    reviewDate: Yup.date().required('Tanggal tidak boleh kosong')
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  const onSubmit = async (values) => {
    let score = 0;
    const assesment = [...values.assesments];
    setIsSubmit(true);
    values.water = _id; // add tpp idrowv
    // values.assesments = removeScoreProperty(assesment);
    values.score = calculateScore(assesment, score, type);

    console.log('values', values);

    await API.postWaterAssement(values, { type })
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

  // console.log('values', dataWater);
  return (
    <Box sx={{ pb: 4 }}>
      <Card sx={{ p: 3 }}>
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
                    value={dataWater.name}
                    InputLabelProps={{ shrink: !!dataWater.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Alamat"
                    fullWidth
                    value={dataWater.address}
                    InputLabelProps={{ shrink: !!dataWater.address }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Jenis Sarana"
                    fullWidth
                    value={
                      waterTypes.find((i) => i.value === dataWater.type)
                        ?.name || ''
                    }
                    InputLabelProps={{ shrink: !!dataWater.type }}
                  />
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
                    name="reviewDate"
                    format="dd/MM/yyyy"
                    control={control}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {/* Form assesments */}
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                {WaterAssesments.find((i) => i.name === type).assesment.map(
                  (item, index) => (
                    <RenderItem
                      setValue={setValue}
                      data={dataWater}
                      key={index}
                      namePrefix={`assesments.${index}`}
                      item={item}
                      control={control}
                      parentDisabled={false}
                      index={index}
                      level={1}
                    />
                  )
                )}
              </Grid>
            </Grid>
            <Grid item xs>
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
      </Card>
    </Box>
  );
};

// Recursive component to render items
export function RenderItem({
  setValue,
  data,
  namePrefix,
  item,
  control,
  parentDisabled,
  level,
  index
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const shouldDisable = parentDisabled || isDisabled;

  const labelPrefix = getLabel(level, index);

  // const handleCheckboxChange = useCallback(() => {
  //   setIsDisabled((prev) => !prev);
  // }, []);

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

  const handleCheckboxChange = useCallback(() => {
    setIsDisabled((prev) => !prev);
    if (!isDisabled) {
      // If the checkbox is being checked (input is being disabled)
      setValue(`${namePrefix}.value`, ''); // Reset the input value
      if (item.children) {
        resetChildValues(namePrefix, item.children); // Reset values of all children
      }
    }
  }, [control, isDisabled, namePrefix, item.children, resetChildValues]);

  if (item.exclude && item.exclude.includes(data.typeCatering)) {
    return null;
  }
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

      {item.isCanDisabled && (
        <Fragment>
          <Grid item xs={5}>
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
                <TextField
                  {...field}
                  select
                  fullWidth
                  size="small"
                  disabled={shouldDisable}
                >
                  <MenuItem value="">Pilih..</MenuItem>
                  <MenuItem value="Ya">Ya</MenuItem>
                  <MenuItem value="Tidak">Tidak</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldDisable}
                  onChange={handleCheckboxChange}
                />
              }
              // label="Disable"
            />
          </Grid>
        </Fragment>
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
              <TextField
                {...field}
                select
                fullWidth
                size="small"
                disabled={shouldDisable}
              >
                <MenuItem value="">Pilih..</MenuItem>
                <MenuItem value="Ya">Ya</MenuItem>
                <MenuItem value="Tidak">Tidak</MenuItem>
              </TextField>
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
