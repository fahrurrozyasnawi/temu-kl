import React, { Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Card, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DocumentUpload = ({ onDrop, filename }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx'
      ]
    }
  });

  return (
    <Card
      elevation={3}
      {...getRootProps()}
      sx={{
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        cursor: 'pointer'
        // borderWidth: 2,
        // borderRadius: 2,
        // borderColor: '#eeeeee',
        // borderStyle: 'dashed',
        // // backgroundColor: '#fafafa',
        // color: '#bdbdbd',
        // outline: 'none',
        // transition: 'border .24s ease-in-out'
      }}
    >
      {filename && <Typography variant="h5">{filename}</Typography>}
      {!filename && (
        <Fragment>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Letakkan file di sini...</Typography>
          ) : (
            <Box textAlign="center">
              <CloudUploadIcon color="success" style={{ fontSize: 50 }} />
              <Typography>Upload file atau drag file di sini</Typography>
            </Box>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default DocumentUpload;
