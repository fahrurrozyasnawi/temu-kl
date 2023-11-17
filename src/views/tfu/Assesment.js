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
import TFUAssesments, { tfuAssesmentsMarket } from 'utils/assesments/tfu';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { TFUContext } from 'contexts/TFUContext';
import { getLabel } from 'views/utilities/generator';
import CustomDatePicker from 'ui-component/components/forms/CustomDatePicker';
import API from 'api';
import { toast } from 'react-hot-toast';

const OnlineAssesment = () => {
  const { _id, type } = useParams();
  const navigate = useNavigate();

  // context
  const { getDataTFU, dataTFU } = useContext(TFUContext);

  // useState
  const [isSubmit, setIsSubmit] = useState(false);

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDataTFU(_id);
    };

    fetchData();

    return () => {};
  }, []);

  const { handleSubmit, control, register } = useForm();

  const onSubmit = async (values) => {
    setIsSubmit(true);

    let score = 0;
    const assesment = [...values.assesments];

    values.score = calculateScore(assesment, score);
    values.tfu = _id; // add tfu id

    console.log('values', values);

    await API.postTFUAssement(values)
      .then((res) => {
        console.log('success post data');
        navigate(-1);
        toast.success('Berhasil menambah data');
      })
      .catch((err) => {
        console.log('err post tfu assesment', err);
        toast.error('Terjadi kesalahan, silahkan dicoba beberapa saat lagi');
      });
  };

  // console.log('values', values);
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
                    label="Nama TFU"
                    fullWidth
                    value={dataTFU.name}
                    InputLabelProps={{ shrink: !!dataTFU.name }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Alamat TFU"
                    fullWidth
                    value={dataTFU.address}
                    InputLabelProps={{ shrink: !!dataTFU.address }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    label="Jenis TFU"
                    fullWidth
                    value={dataTFU.type}
                    InputLabelProps={{ shrink: !!dataTFU.type }}
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
                {TFUAssesments.find((i) => i.name === type).assesment.map(
                  (item, index) => (
                    <RenderItem
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
                {/* {type === 'Pasar' &&
                  tfuAssesmentsMarket.map((item, index) => (
                    <RenderItem
                      key={index}
                      namePrefix={`assesments.${index}`}
                      item={item}
                      control={control}
                      parentDisabled={false}
                      index={index}
                      level={1}
                    />
                  ))} */}
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

  const handleCheckboxChange = useCallback(() => {
    setIsDisabled((prev) => !prev);
  }, []);

  return (
    <Fragment>
      {item.name && item.children ? (
        <Grid item xs={item.isCanDisabled ? 11 : 12}>
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            paragraph
          >{`${labelPrefix}. ${item.name}`}</Typography>
        </Grid>
      ) : (
        <Grid item xs={item.isCanDisabled ? 5 : 6}>
          <Typography paragraph>{`${labelPrefix}. ${item.name}`}</Typography>
        </Grid>
      )}

      {item.isCanDisabled && (
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
            name={`${namePrefix}.mandatory`}
            control={control}
            defaultValue={item.mandatory}
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <Controller
            name={`${namePrefix}.weight`}
            control={control}
            defaultValue={item.weight}
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <Controller
            name={`${namePrefix}.value`}
            control={control}
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
        if (value === 'Ya') {
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

// const removeScoreProperty = (arr) => {
//   return arr.map((item) => {
//     const { score, ...rest } = item;
//     if (rest.children) {
//       rest.children = removeScoreProperty(rest.children);
//     }
//     return rest;
//   });
// };

export default OnlineAssesment;
