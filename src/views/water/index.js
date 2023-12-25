import { Box, Card } from '@mui/material';
import { WaterContext } from 'contexts/WaterContext';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from 'ui-component/components/deleteDialog';
import AddSections from 'ui-component/sections/AddSections';
import ColumnHelper from 'ui-component/water/columnHelper';
import CustomTable from 'ui-component/sections/customTable';
import FormAdd from 'ui-component/healthyHouse/formAdd';
import AssesmentOffline from './AssesmentOffline';
import API from 'api';
import { toast } from 'react-hot-toast';
import { getNestedProperty } from 'utils/generator';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';

const Water = () => {
  const navigate = useNavigate();

  // context
  const { getWaters, waters, totalPages } = useContext(WaterContext);

  const [updateState, setUpdateState] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  // pagination hooks
  const { onPaginationChange, pagination, pageIndex, pageSize } =
    usePagination();

  // search hooks
  const {
    filterValues,
    isSearch,
    search,
    setSearch,
    query,
    handleSearchChange
  } = useSearch('name');

  // use effect
  useEffect(() => {
    const fetchData = async (params = {}) => {
      await getWaters(params);
    };

    fetchData({ pageIndex, pageSize, search, query });
  }, [updateState, pageIndex, pageSize, isSearch]);

  const handleClose = async () => {
    setDeleteModal({ open: false, text: '', id: '' });
  };

  const handleClickAction = (type, row) => {
    switch (type) {
      case 'preview':
        navigate(`/water/form?m=view&id=${row._id}`);
        break;
      case 'view':
        navigate(`/water/view/${row._id}`);
        break;
      case 'add':
        navigate('/water/form?m=add');
        break;
      case 'edit':
        navigate(`/water/form?m=edit&id=${row._id}`);
        break;
      case 'offline':
        navigate(`/water/assesment/offline/${row.type}/${row._id}`);
        break;
      case 'online':
        navigate(`/water/assesment/online/${row.type}/${row._id}`);
        break;
      case 'delete':
        console.log('delete click');
        setDeleteModal({ open: true, text: row.name, id: row._id });
        break;
      default:
        return;
    }
  };

  const onDelete = async (id) => {
    await API.deleteWater(id)
      .then(() => {
        toast.success('Data telah dihapus');
        setUpdateState((prev) => !prev);
        handleClose();
      })
      .catch((err) => {
        console.log('err', err);
        toast.error('Terjadi kesalahan, silahkan coba lagi!!');
      });
  };

  return (
    <Fragment>
      <AddSections
        onClickAdd={() => handleClickAction('add')}
        options={options}
        values={filterValues}
        onClickSearch={setSearch}
        handleChange={handleSearchChange}
      />
      <Box mt={2}>
        <CustomTable
          data={waters}
          columns={ColumnHelper({
            onAction: handleClickAction
          })}
          useServerSidePagination
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      </Box>

      <DeleteDialog
        open={deleteModal.open}
        text={deleteModal.text}
        onClose={handleClose}
        onDelete={() => onDelete(deleteModal.id)}
      />
    </Fragment>
  );
};

const options = [
  { name: 'Nama', value: 'name' },
  { name: 'Alamat', value: 'address' },
  { name: 'Jenis Sarana', value: 'type' }
];

export default Water;
