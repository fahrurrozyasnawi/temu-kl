import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomTextField = ({ name, control, label, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field }) => <TextField {...rest} {...field} label={label} />}
    />
  );
};

export default CustomTextField;
