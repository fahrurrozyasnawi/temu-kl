import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const useSearch = (initialQuerySearch) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearch, setIsSearch] = useState(false);
  const { search = '', query = initialQuerySearch } =
    Object.fromEntries(searchParams);

  const filterValues = { search, query, isSearch };

  // const debounceParams = useCallback(
  //   debounce((newFilters) => {
  //     setSearchParams(newFilters);
  //   }, 300),
  //   []
  // );

  const handleSearchChange = useCallback((name, value) => {
    const oldParams = Object.fromEntries(searchParams);
    const newFilters = { ...oldParams, [name]: value };

    // Exclude empty values
    Object.keys(newFilters).forEach((key) => {
      if (!newFilters[key]) {
        delete newFilters[key];
      }
    });

    setSearchParams(newFilters);
  }, []);

  const setSearch = () => {
    if (isSearch) {
      setSearchParams();
    }
    setIsSearch((prev) => !prev);
  };

  return {
    filterValues,
    search,
    query,
    handleSearchChange,
    isSearch,
    setSearch
  };
};

useSearch.propTypes = {
  initialQuerySearch: PropTypes.string.isRequired
};

export default useSearch;
