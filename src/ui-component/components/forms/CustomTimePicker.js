import { TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomTimePicker = ({
  control,
  name,
  label,
  disabled,
  required = false,
  textRequired = 'Waktu tidak boleh kosong',
  ampm = false,
  // onChange,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={required ? { required: textRequired } : {}}
      render={({ field, fieldState }) => (
        <TimePicker
          label={label}
          disabled={disabled}
          ampm={ampm}
          value={new Date(field.value)}
          onChange={(newValue) => field.onChange(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!fieldState.error,
              helperText: fieldState.error?.message,
              onBlur: field.onBlur
            }
          }}
          renderInput={(params) => <TextField {...params} />}
          {...rest}
        />
      )}
    />
  );
};

export default CustomTimePicker;
