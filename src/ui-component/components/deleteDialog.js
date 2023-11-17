import { Check, Close } from '@mui/icons-material';
import { Box, Button, Dialog, Stack, Typography } from '@mui/material';
import React from 'react';

const DeleteDialog = ({ open, text, onClose, onDelete }) => {
  return (
    <Dialog open={open}>
      <Box p={4}>
        <Typography variant="h4">{`Apakah anda yakin ingin menghapus ${text}?`}</Typography>
        <Stack mt={4} direction="row" gap={2} justifyContent="center">
          <Button
            variant="contained"
            color="error"
            startIcon={<Check />}
            onClick={() => onDelete()}
          >
            Ya
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Close />}
            onClick={() => onClose()}
          >
            Tidak
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default DeleteDialog;
