import API from 'api';
import React, { createContext, useCallback, useState } from 'react';

export const MasterDataContext = createContext({});

const MasterDataProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [publicHealths, setPublicHealths] = useState([]); // puskesmas
  const [residents, setResidents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dataDocument, setDataDocument] = useState({});

  const getDocuments = useCallback(async (params) => {
    await API.getDocuments(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDocuments(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getDataDocument = useCallback(async (id, params) => {
    await API.getOneDocument(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataDocument(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getUsers = useCallback(async (params) => {
    await API.getUsers(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setUsers(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getPublicHealths = useCallback(async (params) => {
    await API.getPublicHealths(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setPublicHealths(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getResidents = useCallback(async (params) => {
    await API.getResidents(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setResidents(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  return (
    <MasterDataContext.Provider
      value={{
        users,
        publicHealths,
        residents,
        documents,
        dataDocument,

        getDocuments,
        getDataDocument,
        getPublicHealths,
        getResidents,
        getUsers
      }}
      {...props}
    />
  );
};

export default MasterDataProvider;
