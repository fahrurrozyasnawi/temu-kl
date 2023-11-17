import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import React, { Fragment } from 'react';

// icons
import PageviewIcon from '@mui/icons-material/Pageview';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PrintIcon from '@mui/icons-material/Print';
import ImageIcon from '@mui/icons-material/Image';

const ActionComponent = (callback) => {
  return (
    <Fragment>
      <Tooltip title="View">
        <IconButton size="small">
          <PageviewIcon color="info" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton size="small">
          <BorderColorIcon color="warning" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small">
          <DeleteIcon color="error" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Penilaian">
        <IconButton size="small">
          <AssessmentIcon color="success" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Penilaian Offline">
        <IconButton size="small">
          <FilePresentIcon color="success" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Print">
        <IconButton size="small">
          <PrintIcon color="secondary" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Gambar">
        <IconButton size="small">
          <ImageIcon color="warning" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};

export default ActionComponent;
