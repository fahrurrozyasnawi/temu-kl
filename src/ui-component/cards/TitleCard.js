import { Card, Stack, Typography } from '@mui/material';
import React from 'react';

const TitleCard = ({ title, icon }) => {
  return (
    <Card sx={{ p: 2, minWidth: 120 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" fontWeight="bold">
          {title}
        </Typography>
        {icon && icon}
      </Stack>
    </Card>
  );
};

export default TitleCard;
