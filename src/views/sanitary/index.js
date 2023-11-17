import { Box, Card } from '@mui/material';
import { SanitaryContext } from 'contexts/SanitaryContext';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from 'ui-component/components/deleteDialog';
import AddSections from 'ui-component/sections/AddSections';
import ColumnHelper from 'ui-component/sanitary/columnHelper';
import CustomTable from 'ui-component/sections/customTable';
import FormAdd from 'ui-component/sanitary/formAdd';
import API from 'api';
import { toast } from 'react-hot-toast';
import { getNestedProperty } from 'utils/generator';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { MasterDataContext } from 'contexts/MasterData';

const Sanitary = () => {
  const navigate = useNavigate();

  // context
  const { getSanitaries, sanitaries } = useContext(SanitaryContext);
  const { getPublicHealths } = useContext(MasterDataContext);

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
  const [filteredData, setFilteredData] = useState(sanitaries);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getSanitaries();
      await getPublicHealths();
    };

    fetchData();

    return () => {
      fetchData();
    };
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
        const searchResult = sanitaries.filter((item) => {
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
        setFilteredData(sanitaries);
      }
    } else {
      setFilteredData(sanitaries);
    }
  }, [sanitaries, filterValue.search, filterValue.query, filterValue.isSearch]);

  // console.log('sanitaries', sanitaries);
  const handleClickAction = (type, row) => {
    switch (type) {
      case 'preview':
        console.log('preview click', row);
        setDataRow((prev) => row);
        setOpenModal({ open: true, preview: true });
        break;
      case 'view':
        navigate(`/sanitary/view/${row._id}`);
        break;
      case 'add':
        setOpenModal({ ...openModal, open: true });
        break;
      case 'edit':
        setDataRow(row);
        setOpenModal({ open: true, edit: true });
        break;
      case 'offline':
        navigate(`/sanitary/assesment/offline/${row.type}/${row._id}`);
        break;
      case 'online':
        navigate(`/sanitary/assesment/online/${row._id}`);
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
    await API.deleteSanitary(id)
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
  { name: 'Alamat', value: 'address' },
  { name: 'Jenis Sarana', value: 'type' }
];

export default Sanitary;
