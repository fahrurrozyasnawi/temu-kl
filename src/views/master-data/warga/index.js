import { Box, Card } from '@mui/material';
import API from 'api';
import { MasterDataContext } from 'contexts/MasterData';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DeleteDialog from 'ui-component/components/deleteDialog';
import ColumnHelperUsers from 'ui-component/master-data/warga/columnHelper';
import FormAdd from 'ui-component/master-data/warga/formAdd';
import AddSections from 'ui-component/sections/AddSections';
import CustomTable from 'ui-component/sections/customTable';
import { getNestedProperty } from 'utils/generator';

const Residents = () => {
  // context
  const { residents, getResidents } = useContext(MasterDataContext);

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
  const [filteredData, setFilteredData] = useState(residents);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    text: '',
    id: ''
  });

  // use effect
  useEffect(() => {
    const fetchData = async () => {
      await getResidents();
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
    setFilterValue((prev) => ({ ...prev, [type]: value }));
  };

  const handleClickSearch = () => {
    setFilterValue((prev) => ({ ...prev, isSearch: !prev.isSearch }));
  };

  useEffect(() => {
    if (filterValue.isSearch) {
      if (filterValue.search.length > 0) {
        const searchResult = residents.filter((item) => {
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
        setFilteredData(residents);
      }
    } else {
      setFilteredData(residents);
    }
  }, [residents, filterValue.search, filterValue.query, filterValue.isSearch]);

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
    await API.deleteResident(id)
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
        <Card sx={{ p: 2 }}>
          <CustomTable
            data={filteredData}
            columns={ColumnHelperUsers({
              onAction: handleClickAction,
              setUpdateState: setUpdateState
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
  { name: 'Desa', value: 'village' },
  { name: 'Umur', value: 'age.ageValue' },
  { name: 'Provinsi', value: 'address.province.nama' },
  { name: 'Kabupaten', value: 'address.region.nama' },
  { name: 'Kecamatan', value: 'address.district.nama' },
  { name: 'Desa Kelurahan', value: 'address.ward.nama' },
  { name: 'RT', value: 'address.nbAssociate' },
  { name: 'RW', value: 'address.ctAssociate' }
];

export default Residents;
