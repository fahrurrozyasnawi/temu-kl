import { Card, Stack, Typography } from '@mui/material';
import React from 'react';

const StatusCard = ({ value, description, icon }) => {
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" alignItems="flex-start" gap={1}>
        {icon}
        <Stack gap={0.5}>
          <Typography variant="h1">{value}</Typography>
          <Typography variant="caption">{description}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default StatusCard;
