import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomDatePicker = ({
  control,
  name,
  label,
  disabled,
  required = false,
  textRequired = 'Tanggal tidak boleh kosong',
  format = undefined,
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
        <DatePicker
          label={label}
          disabled={disabled}
          format={format}
          value={field.value}
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

export default CustomDatePicker;
