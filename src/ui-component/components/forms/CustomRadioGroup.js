import { FormControl, FormLabel, RadioGroup, TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomRadioGroup = ({
  fullWidth = true,
  name,
  control,
  label,
  children,
  disabled,
  ...rest
}) => {
  return (
    <FormControl disabled={disabled} fullWidth={fullWidth}>
      <FormLabel id="demo-legality">{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            {...field}
            {...rest}
          >
            {children}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default CustomRadioGroup;
