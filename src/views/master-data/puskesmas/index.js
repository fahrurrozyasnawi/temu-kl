import { Box, Card } from '@mui/material';
import API from 'api';
import { AuthContext } from 'contexts/AuthContext';
import { MasterDataContext } from 'contexts/MasterData';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DeleteDialog from 'ui-component/components/deleteDialog';
import ColumnHelperUsers from 'ui-component/master-data/puskesmas/columnHelper';
import FormAdd from 'ui-component/master-data/puskesmas/formAdd';
import AddSections from 'ui-component/sections/AddSections';
import CustomTable from 'ui-component/sections/customTable';
import { getNestedProperty } from 'utils/generator';

const Puskesmas = () => {
  // context
  const { publicHealths, getPublicHealths } = useContext(MasterDataContext);
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
  const [filteredData, setFilteredData] = useState(publicHealths);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getPublicHealths();
    };

    fetchData();
    return () => {
      fetchData();
    };
  }, [updateState]);

  console.log('data user', dataUser);

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
        const searchResult = publicHealths.filter((item) => {
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
        setFilteredData(publicHealths);
      }
    } else {
      setFilteredData(publicHealths);
    }
  }, [
    publicHealths,
    filterValue.search,
    filterValue.query,
    filterValue.isSearch
  ]);

  const handleClickAction = (type, row) => {
    switch (type) {
      case 'preview':
        console.log('preview click');
        setDataRow(row);
        setOpenModal({ open: true, preview: true });
        break;
      case 'edit':
        console.log('edit click');
        setDataRow(row);
        setOpenModal({ open: true, edit: true });
        break;
      case 'add':
        setOpenModal({ ...openModal, open: true });
        break;
      case 'delete':
        console.log('Delete', row);
        setDeleteModal({ open: true, text: row.name, id: row._id });
        break;
      default:
        return;
    }
  };

  const onDelete = async (id) => {
    await API.deletePublicHealth(id)
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
        exclude="puskesmas:add"
        onClickSearch={handleClickSearch}
        handleChange={handleChangeSections}
      />
      <Box mt={2}>
        <Card sx={{ p: 2 }}>
          <CustomTable
            data={filteredData}
            columns={ColumnHelperUsers({
              onAction: handleClickAction,
              setUpdateState: setUpdateState,
              userPermission: dataUser?.permissions
            })}
          />
        </Card>
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
  { name: 'Desa Kelurahan', value: 'ward.nama' },
  { name: 'Kode Puskesmas', value: 'code' }
];

export default Puskesmas;
