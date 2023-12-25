import API from 'api';
import React, { createContext, useCallback, useState } from 'react';

export const TFUContext = createContext({});

const TFUProvider = (props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [dataTFU, setDataTFU] = useState({});
  const [dataTFUAssesment, setDataTFUAssesment] = useState({});
  const [tfus, setTfus] = useState([]);
  const [tfuAssesments, setTfuAssesments] = useState([]);
  const [reports, setReports] = useState([]);

  const getDataTFUAssesment = useCallback(async (id, params) => {
    await API.getOneTFUAssement(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataTFUAssesment(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getDataTFU = useCallback(async (id, params) => {
    await API.getOneTFU(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataTFU(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getTFUAssements = useCallback(async (params) => {
    await API.getTFUAssements(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setTfuAssesments(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getTFUs = useCallback(async (params) => {
    await API.getTFUs(params)
      .then((res) => {
        const { data, totalPages } = res.data;

        // console.log('data', data);
        setTotalPages(totalPages);
        setTfus(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getReports = useCallback(async (params) => {
    await API.getReports(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setReports(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  return (
    <TFUContext.Provider
      value={{
        dataTFU,
        tfus,
        tfuAssesments,
        dataTFUAssesment,
        reports,
        totalPages,

        getReports,
        getDataTFUAssesment,
        getDataTFU,
        getTFUs,
        getTFUAssements
      }}
      {...props}
    />
  );
};

export default TFUProvider;
