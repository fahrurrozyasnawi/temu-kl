import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const useSearch = (initialQuerySearch, resetPagination) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearch, setIsSearch] = useState(
    !!searchParams.get('search' || !!searchParams.get('query'))
  );
  const [filterValue, setFilterValue] = useState({
    search: searchParams.get('search') || '',
    query: searchParams.get('query') || initialQuerySearch
  });

  const filterValues = { ...filterValue, isSearch };

  const handleSearchChange = useCallback((name, value) => {
    setFilterValue((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setSearch = () => {
    if (!!resetPagination) {
      resetPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }

    if (isSearch) {
      setFilterValue((prev) => ({ ...prev, search: '' }));
      setSearchParams();
    } else {
      setSearchParams(filterValue);
    }
    setIsSearch((prev) => !prev);
  };

  return {
    filterValues,
    search: searchParams.get('search') || filterValue.search,
    query: searchParams.get('query') || filterValue.query,
    handleSearchChange,
    isSearch,
    setSearch
  };
};

useSearch.propTypes = {
  initialQuerySearch: PropTypes.string.isRequired,
  resetPagination: PropTypes.func
};

export default useSearch;
