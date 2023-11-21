import { Box } from '@mui/material';
import API from 'api';
import StaticVar from 'config/StaticVar';
import { AuthContext } from 'contexts/AuthContext';
import { MasterDataContext } from 'contexts/MasterData';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import DeleteDialog from 'ui-component/components/deleteDialog';
import ColumnHelper from 'ui-component/master-data/documents/columnHelper';
import FormAdd from 'ui-component/master-data/documents/formAdd';
import AddSections from 'ui-component/sections/AddSections';
import CustomTable from 'ui-component/sections/customTable';
import { getNestedProperty } from 'utils/generator';

const Documents = () => {
  const navigate = useNavigate();

  // context
  const { documents, getDocuments } = useContext(MasterDataContext);
  const { dataUser } = useContext(AuthContext);

  // state
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
  const [filteredData, setFilteredData] = useState(documents);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getDocuments();
    };

    fetchData();
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
        const searchResult = documents.filter((item) => {
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
        setFilteredData(documents);
      }
    } else {
      setFilteredData(documents);
    }
  }, [documents, filterValue.search, filterValue.query, filterValue.isSearch]);

  // console.log('sanitaries', sanitaries);
  const handleClickAction = (type, row) => {
    switch (type) {
      case 'add':
        setOpenModal({ ...openModal, open: true });
        break;
      case 'edit':
        setDataRow(row);
        setOpenModal({ open: true, edit: true });
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
    await API.deleteDocument(id)
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
        exclude="document:add"
        values={filterValue}
        onClickSearch={handleClickSearch}
        handleChange={handleChangeSections}
      />
      <Box mt={2}>
        <CustomTable
          data={filteredData}
          columns={ColumnHelper({
            onAction: handleClickAction,
            userPermission: dataUser?.permissions
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
  { name: 'Jenis', value: 'type' }
];

export default Documents;
