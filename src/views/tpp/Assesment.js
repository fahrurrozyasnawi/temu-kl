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
import TPPAssesments, { tppAssesmentsMarket } from 'utils/assesments/tpp';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { TPPContext } from 'contexts/TPPContext';
import { getLabel } from 'utils/generator';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import API from 'api';
import { toast } from 'react-hot-toast';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';

const OnlineAssesment = () => {
  const { _id, type } = useParams();
  const navigate = useNavigate();

  // context
  const { getDataTPP, dataTPP, tppAssesments, getTPPAssements } =
    useContext(TPPContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataTPP(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    getValues,
    reset,
    setFocus
  } = useForm();

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

    setIsSubmit(true);
    values.tpp = _id; // add tpp id

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

  // console.log('tppAssesments', tppAssesments);
  // console.log('type', type);
  // console.log('sentraType', getValues('sentraType'));
  // console.log('sentraParent', getValues('sentraParent'));
  // console.log('values', getValues());
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
                    {...register('reviewer', { required: true })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomDatePicker
                    required={true}
                    textRequired="Harap masukkan tanggal penilaian"
                    label="Tanggal Penilaian"
                    name="assesmentDate"
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
                justifyContent="space-between"
              >
                {type === 'Sentra Pangan Jajanan' &&
                  getValues('sentraType') &&
                  TPPAssesments.find(
                    (i) => i.type === getValues('sentraType')
                  )?.assesment.map((item, index) => (
                    <RenderItem
                      setValue={setValue}
                      data={dataTPP}
                      key={index}
                      namePrefix={`assesments.${index}`}
                      item={item}
                      control={control}
                      parentDisabled={false}
                      index={index}
                      level={1}
                    />
                  ))}

                {type &&
                  type !== 'Sentra Pangan Jajanan' &&
                  TPPAssesments.find((i) => i.name === type).assesment.map(
                    (item, index) => (
                      <RenderItem
                        setValue={setValue}
                        data={dataTPP}
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
                  disabled={isSubmit}
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
      {item.name && item.children && level < 3 ? (
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
            fontWeight={level < 3 ? 'bold' : undefined}
          >{`${labelPrefix}. ${item.name}`}</Typography>
        </Grid>
      )}

      {item.score && ( // add property score to assesment results
        <Controller
          name={`${namePrefix}.score`}
          control={control}
          defaultValue={item.score}
          render={({ field }) => <input type="hidden" {...field} />}
        />
      )}

      {item.isCanDisabled && item.children ? (
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
      ) : item.isCanDisabled ? (
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
      ) : null}

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
            name={`${namePrefix}.score`}
            control={control}
            defaultValue={item.score}
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
