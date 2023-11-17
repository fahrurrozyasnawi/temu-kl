import { Box, Card } from '@mui/material';
import { TFUContext } from 'contexts/TFUContext';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from 'ui-component/components/deleteDialog';
import AddSections from 'ui-component/sections/AddSections';
import ColumnHelper from 'ui-component/tfu/columnHelper';
import CustomTable from 'ui-component/sections/customTable';
import FormAdd from 'ui-component/tfu/formAdd';
import AssesmentOffline from './AssesmentOffline';
import API from 'api';
import { toast } from 'react-hot-toast';
import { getNestedProperty } from 'utils/generator';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

const TFU = () => {
  const navigate = useNavigate();

  // context
  const { getTFUs, tfus } = useContext(TFUContext);

  const [openModal, setOpenModal] = useState({
    open: false,
    edit: false,
    preview: false
  });
  const [updateState, setUpdateState] = useState(false);
  const [dataRow, setDataRow] = useState(null);
  const [filterValue, setFilterValue] = useState({
    search: '',
    query: 'name',
    isSearch: false
  });
  const [filteredData, setFilteredData] = useState(tfus);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getTFUs();
    };

    fetchData();

    return () => {};
  }, [updateState]);

  const handleClose = async () => {
    setDeleteModal({ open: false, text: '', id: '' });
    setOpenModal({ open: false, edit: false, preview: false });
    setDataRow(null);
  };

  const handleChangeSections = (type, value) => {
    if (type === 'text') {
      setFilterValue((prev) => ({ ...prev, search: value }));
    }

    if (type === 'query') {
      setFilterValue((prev) => ({ ...prev, query: value }));
    }
  };

  const handleClickSearch = () => {
    setFilterValue((prev) => ({ ...prev, isSearch: !prev.isSearch }));
  };

  useEffect(() => {
    if (filterValue.isSearch) {
      if (filterValue.search.length > 0) {
        const searchResult = tfus.filter((item) => {
          const value = getNestedProperty(item, filterValue.query);
          return (
            value &&
            value
              .toString()
              .toLocaleLowerCase()
              .match(filterValue.search.toString().toLowerCase())
          );
        });
        setFilteredData(searchResult);
      } else {
        setFilteredData(tfus);
      }
    } else {
      setFilteredData(tfus);
    }
  }, [tfus, filterValue.search, filterValue.query, filterValue.isSearch]);

  // console.log('tfus', tfus);
  const handleClickAction = (type, row) => {
    switch (type) {
      case 'view':
        navigate(`/tfu/view/${row._id}`);
        break;
      case 'add':
        setOpenModal({ ...openModal, open: true });
        break;
      case 'edit':
        setDataRow(row);
        setOpenModal({ open: true, edit: true });
        break;
      case 'offline':
        navigate(`/tfu/assesment/offline/${row.type}/${row._id}`);
        break;
      case 'online':
        navigate(`/tfu/assesment/online/${row.type}/${row._id}`);
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
    await API.deleteTFU(id)
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
        values={filterValue}
        onClickSearch={handleClickSearch}
        handleChange={handleChangeSections}
      />
      <Box mt={2}>
        <CustomTable
          data={filteredData}
          columns={ColumnHelper({
            onAction: handleClickAction
          })}
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
  { name: 'Provinsi', value: 'province.nama' },
  { name: 'Kabupaten', value: 'region.nama' },
  { name: 'Kecamatan', value: 'district.nama' },
  { name: 'Area/Puskesmas', value: 'area' },
  { name: 'Alamat', value: 'address' },
  { name: 'Jenis TFU', value: 'type' }
];

export default TFU;
