import { Grid, Stack, TextField, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomAutocomplete from 'ui-component/components/forms/CustomAutocomplete';

const DiareAssesments = ({ areas, handleDataArea }) => {
  const { register, control } = useFormContext();

  return (
    <Fragment>
      <Grid item xs={6}>
        <TextField fullWidth label="Nama" {...register('name')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Umur"
            {...register('age.value')}
          />
          <TextField
            fullWidth
            {...register('age.ageType')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Bulan">Bulan</option>
            <option value="Tahun">Tahun</option>
          </TextField>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nama orang tua/KK"
          {...register('parent')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Pekerjaan" {...register('job')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField fullWidth label="Alamat" {...register('address.name')} />
          <TextField
            fullWidth
            label="RT"
            type="number"
            {...register('address.nbAssociate')}
          />
          <TextField
            fullWidth
            label="RW"
            type="number"
            {...register('address.ctAssociate')}
          />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <CustomAutocomplete
          freeSolo
          label="Kelurahan/Desa"
          name="ward"
          control={control}
          options={areas.ward}
          getOptionLabel={(option) => option.nama}
          onChange={(e, newValue) => handleDataArea('kab', newValue)}
        />
      </Grid>
    </Fragment>
  );
};

const MalariaForm = ({ areas, handleDataArea }) => {
  const { register, control, watch } = useFormContext();
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">Informasai Umum</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama" {...register('name')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Umur"
            {...register('age.value')}
          />
          <TextField
            fullWidth
            {...register('age.ageType')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Bulan">Bulan</option>
            <option value="Tahun">Tahun</option>
          </TextField>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Jenis Kelamin"
          {...register('gender')}
          select
          SelectProps={{
            native: true
          }}
        >
          <option value=""></option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nama orang tua/KK"
          {...register('parent')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Pekerjaan" {...register('job')} />
      </Grid>
      <Grid item xs={12}>
        <CustomAutocomplete
          freeSolo
          label="Kelurahan/Desa"
          name="ward"
          control={control}
          options={areas.ward}
          getOptionLabel={(option) => option.nama}
          onChange={(e, newValue) => handleDataArea('kab', newValue)}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            fullWidth
            label="Tipe rumah"
            {...register('homeType.value')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Tembok">Tembok</option>
            <option value="Bambu">Bambu</option>
            <option value="Kayu">Kayu</option>
            <option value="Campuran tembok dan kayu">
              Campuran tembok dan kayu
            </option>
            <option value="Lainnya">Lainnya</option>
          </TextField>

          {watch('homeType.value') === 'Lainnya' && (
            <TextField
              fullWidth
              placeholder="Sebutkan.."
              {...register('homeType.other')}
            />
          )}
        </Stack>
      </Grid>
    </Fragment>
  );
};

const FormDBDAndSkin = ({ areas, handleDataArea }) => {
  const { register, control, watch } = useFormContext();
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">Informasai Umum</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama" {...register('name')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Umur"
            {...register('age.value')}
          />
          <TextField
            fullWidth
            {...register('age.ageType')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Bulan">Bulan</option>
            <option value="Tahun">Tahun</option>
          </TextField>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Pekerjaan" {...register('job')} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Pendidikan"
          {...register('education')}
          select
          SelectProps={{
            native: true
          }}
        >
          <option value=""></option>
          <option value="TIDAK/BELUM SEKOLAH">TIDAK/BELUM SEKOLAH</option>
          <option value="BELUM TAMAT SD/SEDERAJAT">
            BELUM TAMAT SD/SEDERAJAT
          </option>
          <option value="TAMAT SD/SEDERAJAT">TAMAT SD/SEDERAJAT</option>
          <option value="SLTP/SEDERAJAT">SLTP/SEDERAJAT</option>
          <option value="SLTA/SEDERAJAT">SLTA/SEDERAJAT</option>
          <option value="DIPLOMA I/II">DIPLOMA I/II</option>
          <option value="AKADEMI/DIPLOMA III/S. MUDA">
            AKADEMI/DIPLOMA III/S. MUDA
          </option>
          <option value="DIPLOMA IV/STRATA I">DIPLOMA IV/STRATA I</option>
          <option value="STRATA II">STRATA II</option>
          <option value="STRATA III">STRATA III</option>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nama orang tua/KK"
          {...register('parent')}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField fullWidth label="Alamat" {...register('address.name')} />
          <TextField
            fullWidth
            label="RT"
            type="number"
            {...register('address.nbAssociate')}
          />
          <TextField
            fullWidth
            label="RW"
            type="number"
            {...register('address.ctAssociate')}
          />
          <TextField
            fullWidth
            label="RK"
            // type="number"
            {...register('address.rk')}
          />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <CustomAutocomplete
          freeSolo
          label="Kelurahan/Desa"
          name="ward"
          control={control}
          options={areas.ward}
          getOptionLabel={(option) => option.nama}
          onChange={(e, newValue) => handleDataArea('kab', newValue)}
        />
      </Grid>
    </Fragment>
  );
};

const FormWormy = ({ areas, handleDataArea }) => {
  const { register, control, watch } = useFormContext();
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">Informasai Umum</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama" {...register('name')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Umur"
            {...register('age.value')}
          />
          <TextField
            fullWidth
            {...register('age.ageType')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Bulan">Bulan</option>
            <option value="Tahun">Tahun</option>
          </TextField>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Pekerjaan/Sekolah" {...register('job')} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Pendidikan"
          {...register('education')}
          select
          SelectProps={{
            native: true
          }}
        >
          <option value=""></option>
          <option value="TIDAK/BELUM SEKOLAH">TIDAK/BELUM SEKOLAH</option>
          <option value="BELUM TAMAT SD/SEDERAJAT">
            BELUM TAMAT SD/SEDERAJAT
          </option>
          <option value="TAMAT SD/SEDERAJAT">TAMAT SD/SEDERAJAT</option>
          <option value="SLTP/SEDERAJAT">SLTP/SEDERAJAT</option>
          <option value="SLTA/SEDERAJAT">SLTA/SEDERAJAT</option>
          <option value="DIPLOMA I/II">DIPLOMA I/II</option>
          <option value="AKADEMI/DIPLOMA III/S. MUDA">
            AKADEMI/DIPLOMA III/S. MUDA
          </option>
          <option value="DIPLOMA IV/STRATA I">DIPLOMA IV/STRATA I</option>
          <option value="STRATA II">STRATA II</option>
          <option value="STRATA III">STRATA III</option>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nama orang tua/KK"
          {...register('parent')}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField fullWidth label="Alamat" {...register('address.name')} />
          <TextField
            fullWidth
            label="RT"
            type="number"
            {...register('address.nbAssociate')}
          />
          <TextField
            fullWidth
            label="RW"
            type="number"
            {...register('address.ctAssociate')}
          />
          <TextField
            fullWidth
            label="RK"
            // type="number"
            {...register('address.rk')}
          />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <CustomAutocomplete
          freeSolo
          label="Kelurahan/Desa"
          name="ward"
          control={control}
          options={areas.ward}
          getOptionLabel={(option) => option.nama}
          onChange={(e, newValue) => handleDataArea('kab', newValue)}
        />
      </Grid>
    </Fragment>
  );
};

const FormISPA = ({ areas, handleDataArea }) => {
  const { register, control, watch } = useFormContext();
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">Informasai Umum</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama anak/balita" {...register('name')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Umur"
            {...register('age.value')}
          />
          <TextField
            fullWidth
            {...register('age.ageType')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Bulan">Bulan</option>
            <option value="Tahun">Tahun</option>
          </TextField>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama Ayah" {...register('parent.father')} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama Ibu" {...register('parent.mother')} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Pekerjaan Ayah" {...register('job')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            fullWidth
            label="Pendidikan Ayah"
            {...register('education.father')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="TIDAK/BELUM SEKOLAH">TIDAK/BELUM SEKOLAH</option>
            <option value="BELUM TAMAT SD/SEDERAJAT">
              BELUM TAMAT SD/SEDERAJAT
            </option>
            <option value="TAMAT SD/SEDERAJAT">TAMAT SD/SEDERAJAT</option>
            <option value="SLTP/SEDERAJAT">SLTP/SEDERAJAT</option>
            <option value="SLTA/SEDERAJAT">SLTA/SEDERAJAT</option>
            <option value="DIPLOMA I/II">DIPLOMA I/II</option>
            <option value="AKADEMI/DIPLOMA III/S. MUDA">
              AKADEMI/DIPLOMA III/S. MUDA
            </option>
            <option value="DIPLOMA IV/STRATA I">DIPLOMA IV/STRATA I</option>
            <option value="STRATA II">STRATA II</option>
            <option value="STRATA III">STRATA III</option>
          </TextField>
          <TextField
            fullWidth
            label="Pendidikan Ibu"
            {...register('education.mother')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="TIDAK/BELUM SEKOLAH">TIDAK/BELUM SEKOLAH</option>
            <option value="BELUM TAMAT SD/SEDERAJAT">
              BELUM TAMAT SD/SEDERAJAT
            </option>
            <option value="TAMAT SD/SEDERAJAT">TAMAT SD/SEDERAJAT</option>
            <option value="SLTP/SEDERAJAT">SLTP/SEDERAJAT</option>
            <option value="SLTA/SEDERAJAT">SLTA/SEDERAJAT</option>
            <option value="DIPLOMA I/II">DIPLOMA I/II</option>
            <option value="AKADEMI/DIPLOMA III/S. MUDA">
              AKADEMI/DIPLOMA III/S. MUDA
            </option>
            <option value="DIPLOMA IV/STRATA I">DIPLOMA IV/STRATA I</option>
            <option value="STRATA II">STRATA II</option>
            <option value="STRATA III">STRATA III</option>
          </TextField>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField fullWidth label="Alamat" {...register('address.name')} />
          <TextField
            fullWidth
            label="RT"
            type="number"
            {...register('address.nbAssociate')}
          />
          <TextField
            fullWidth
            label="RW"
            type="number"
            {...register('address.ctAssociate')}
          />
          <TextField
            fullWidth
            label="RK"
            // type="number"
            {...register('address.rk')}
          />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <CustomAutocomplete
          freeSolo
          label="Kelurahan/Desa"
          name="ward"
          control={control}
          options={areas.ward}
          getOptionLabel={(option) => option.nama}
          onChange={(e, newValue) => handleDataArea('kab', newValue)}
        />
      </Grid>
    </Fragment>
  );
};

const FormTBP = ({ areas, handleDataArea }) => {
  const { register, control, watch } = useFormContext();
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">Informasai Umum</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nama" {...register('name')} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField
            type="number"
            fullWidth
            label="Umur"
            {...register('age.value')}
          />
          <TextField
            fullWidth
            {...register('age.ageType')}
            select
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            <option value="Bulan">Bulan</option>
            <option value="Tahun">Tahun</option>
          </TextField>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Pekerjaan" {...register('job')} />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nama orang tua/KK"
          {...register('parent')}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" gap={2}>
          <TextField fullWidth label="Alamat" {...register('address.name')} />
          <TextField
            fullWidth
            label="RT"
            type="number"
            {...register('address.nbAssociate')}
          />
          <TextField
            fullWidth
            label="RW"
            type="number"
            {...register('address.ctAssociate')}
          />
          <TextField
            fullWidth
            label="RK"
            // type="number"
            {...register('address.rk')}
          />
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <CustomAutocomplete
          freeSolo
          label="Kelurahan/Desa"
          name="ward"
          control={control}
          options={areas.ward}
          getOptionLabel={(option) => option.nama}
          onChange={(e, newValue) => handleDataArea('kab', newValue)}
        />
      </Grid>
    </Fragment>
  );
};

const BaseFormComponent = [
  {
    name: 'Diare',
    component: DiareForm
  },
  {
    name: 'Malaria',
    component: MalariaForm
  },
  {
    name: 'DBD',
    component: FormDBDAndSkin
  },
  {
    name: 'Kulit',
    component: FormDBDAndSkin
  },
  {
    name: 'Kecacingan',
    component: FormWormy
  },
  {
    name: 'ISPA',
    component: FormISPA
  },
  {
    name: 'TBP',
    component: FormTBP
  }
];

export default BaseFormComponent;
