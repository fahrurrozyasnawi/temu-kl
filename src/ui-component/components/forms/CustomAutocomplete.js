import { Autocomplete, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const CustomAutocomplete = ({
  control,
  name,
  label,
  options,
  getOptionLabel,
  onChange,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field: { value }, fieldState: { error } }) => (
        <Autocomplete
          {...rest}
          value={value}
          onChange={onChange}
          options={options}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password' // disable autocomplete and autofill
              }}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      )}
    />
  );
};

export default CustomAutocomplete;
