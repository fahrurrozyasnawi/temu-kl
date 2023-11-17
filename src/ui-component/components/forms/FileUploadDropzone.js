import {
  Box,
  Card,
  IconButton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fragment } from 'react';

const UploadImagesWrapper = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: '8px',
  '&::after': {
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    content: '""',
    height: '100%',
    position: 'absolute',
    transition: 'opacity 0.3s',
    backgroundColor: theme.palette.secondary[300]
  },
  '&:hover::after': {
    opacity: 0.7
  },
  '&:hover .MuiButtonBase-root.MuiIconButton-root': {
    visibility: 'visible'
  }
}));

const DeleteIconButton = styled(IconButton)(({ theme }) => {
  const bgColor = theme.palette.background.default;
  return {
    top: 10,
    right: 10,
    zIndex: 1,
    padding: '4px',
    visibility: 'hidden',
    position: 'absolute',
    backgroundColor: bgColor,
    transition: 'visibility 0.2s',
    '&:hover': {
      backgroundColor: bgColor
    }
  };
});

const CameraIconButton = styled(IconButton)(({ theme }) => {
  const bgColor = theme.palette.background.default;
  return {
    top: '50%',
    left: '50%',
    zIndex: 1,
    transform: 'translate(-50%, -50%)',
    padding: '4px',
    visibility: 'hidden',
    position: 'absolute',
    backgroundColor: bgColor,
    transition: 'visibility 0.2s',
    '&:hover': {
      backgroundColor: bgColor
    }
  };
}); // --------------------------------------------------------------

// --------------------------------------------------------------
const FileUploadDropzone = ({ onDrop, handleRemoveFile, files, title }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/*': []
    },
    onDrop,
    maxFiles: 1
  });
  return (
    <Card
      sx={{
        padding: 3
      }}
    >
      {title && <Typography variant="h6">{title}</Typography>}
      {files.length > 0 && (
        <Stack direction="row" justifyContent="space-between" gap={2} mt={2}>
          {files.map((file, index) => (
            <Fragment key={index}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{file.name}</Typography>
              </Box>
              <Box>
                <IconButton
                  {...getRootProps({
                    className: 'dropzone'
                  })}
                >
                  <UploadFileIcon
                    sx={{
                      color: 'text.disabled',
                      fontSize: 24
                    }}
                  />
                  <input
                    {...getInputProps()}
                    placeholder="Select click to browse"
                  />
                </IconButton>

                <IconButton onClick={() => handleRemoveFile(file)}>
                  <DeleteIcon
                    sx={{
                      color: 'text.disabled',
                      fontSize: 17
                    }}
                  />
                </IconButton>
              </Box>
            </Fragment>
          ))}
        </Stack>
      )}

      {files.length === 0 && (
        <Box
          {...getRootProps({
            className: 'dropzone'
          })}
          sx={{
            padding: 3,
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <UploadFileIcon
            sx={{
              fontSize: 38,
              color: 'text.disabled'
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Drop your file here or
          </Typography>
          <Typography fontSize={12} color="primary.main">
            Select click to browse
          </Typography>

          <input {...getInputProps()} placeholder="Select click to browse" />
        </Box>
      )}
    </Card>
  );
};

export default FileUploadDropzone;
