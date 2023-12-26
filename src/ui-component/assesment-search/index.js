import { IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const AssesmentSearch = ({
  placeholder = 'Cari',
  searchValues,
  onSearchChange,
  onClickSearch
}) => {
  return (
    <Fragment>
      <TextField
        size="small"
        sx={{ minWidth: 250 }}
        placeholder={placeholder}
        value={searchValues.search}
        disabled={searchValues.isSearch}
        onChange={(e) => onSearchChange('search', e.target.value)}
      />
      <IconButton onClick={() => onClickSearch()}>
        {searchValues.isSearch ? (
          <CloseIcon color="error" />
        ) : (
          <SearchIcon color="primary" />
        )}
      </IconButton>
    </Fragment>
  );
};

AssesmentSearch.propTypes = {
  placeholder: PropTypes.string,
  searchValues: PropTypes.object,
  onSearchChange: PropTypes.func,
  onClickSearch: PropTypes.func
};

export default AssesmentSearch;
