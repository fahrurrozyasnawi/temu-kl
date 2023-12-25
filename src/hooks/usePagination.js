import { useState } from 'react';
import PropTypes from 'prop-types';

const usePagination = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState({
    pageSize: initialPageSize,
    pageIndex: 0
  });

  const { pageIndex, pageSize } = pagination;
  return {
    onPaginationChange: setPagination,
    pagination,
    pageIndex,
    pageSize
  };
};

usePagination.propTypes = {
  // searchParams: PropTypes.any,
  initialPageSize: PropTypes.number
};

export default usePagination;
