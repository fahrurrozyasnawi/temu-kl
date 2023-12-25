import { Box, Card } from '@mui/material';
import { HealthyHouseContext } from 'contexts/HealthyHouseContext';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from 'ui-component/components/deleteDialog';
import AddSections from 'ui-component/sections/AddSections';
import ColumnHelper from 'ui-component/healthyHouse/columnHelper';
import CustomTable from 'ui-component/sections/customTable';
import FormAdd from 'ui-component/healthyHouse/formAdd';
import AssesmentOffline from './AssesmentOffline';
import API from 'api';
import { toast } from 'react-hot-toast';
import { getNestedProperty } from 'utils/generator';
import usePagination from 'hooks/usePagination';
import useSearch from 'hooks/useSearch';

const HealthyHouse = () => {
  const navigate = useNavigate();

  // context
  const { getHealthyHouses, healthyHouses, totalPages } =
    useContext(HealthyHouseContext);

  const [openModal, setOpenModal] = useState({
    open: false,
    edit: false,
    preview: false
  });
  const [updateState, setUpdateState] = useState(false);
  const [dataRow, setDataRow] = useState(null);
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
      await getHealthyHouses(params);
    };

    fetchData({ pageIndex, pageSize, search, query });

    // return () => {
    //   fetchData();
    // };
  }, [updateState, pageIndex, pageSize, isSearch]);

  const handleClose = async () => {
    setDeleteModal({ open: false, text: '', id: '' });
    setOpenModal({ open: false, edit: false, preview: false });
    setDataRow(null);
  };

  const handleClickAction = (type, row) => {
    switch (type) {
      case 'preview':
        console.log('preview click', row);
        setDataRow((prev) => row);
        setOpenModal({ open: true, preview: true });
        break;
      case 'view':
        navigate(`/healthy-house/view/${row._id}`);
        break;
      case 'add':
        setOpenModal({ ...openModal, open: true });
        break;
      case 'edit':
        setDataRow((prev) => row);
        setOpenModal({ open: true, edit: true });
        break;
      case 'offline':
        navigate(`/healthy-house/assesment/offline/${row.type}/${row._id}`);
        break;
      case 'online':
        navigate(`/healthy-house/assesment/online/${row.type}/${row._id}`);
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
    await API.deleteHealthyHouse(id)
      .then((res) => {
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
          data={healthyHouses}
          columns={ColumnHelper({
            onAction: handleClickAction
          })}
          useServerSidePagination
          pageCount={totalPages}
          onPaginationChange={onPaginationChange}
          pagination={pagination}
        />
      </Box>

      {/* Dialog */}
      <FormAdd
        updateState={setUpdateState}
        open={openModal.open}
        data={dataRow}
        edit={openModal.edit}
        preview={openModal.preview}
        onClose={handleClose}
      />
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
  { name: 'Jenis Sanitasi', value: 'type' }
];

export default HealthyHouse;
