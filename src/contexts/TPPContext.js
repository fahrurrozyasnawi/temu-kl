import API from 'api';
import { createContext, useCallback, useState } from 'react';

export const TPPContext = createContext({});

const TPPProvider = (props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [dataTPP, setDataTPP] = useState({});
  const [dataTPPAssesment, setDataTPPAssesment] = useState({});
  const [tpps, setTpps] = useState([]);
  const [tppAssesments, setTppAssesments] = useState([]);
  const [reports, setReports] = useState([]);

  const getReports = useCallback(async (params) => {
    await API.getReports(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setReports(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getDataTPPAssesment = useCallback(async (id, params) => {
    await API.getOneTPPAssement(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataTPPAssesment(data);
      })
      .catch((err) => console.log('err data tfu', err));
  }, []);

  const getDataTPP = useCallback(async (id, params) => {
    await API.getOneTPP(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataTPP(data);
      })
      .catch((err) => console.log('err data tpp', err));
  }, []);

  const getTPPAssements = useCallback(async (params) => {
    await API.getTPPAssements(params)
      .then((res) => {
        const { data, totalPages } = res.data;

        // console.log('data', data);
        setTotalPages(totalPages);
        setTppAssesments(data);
      })
      .catch((err) => console.log('err data tpp', err));
  }, []);

  const getTPPs = useCallback(async (params) => {
    await API.getTPPs(params)
      .then((res) => {
        const { data, totalPages } = res.data;

        // console.log('data', data);
        setTotalPages(totalPages);
        setTpps(data);
      })
      .catch((err) => console.log('err data tpp', err));
  }, []);

  return (
    <TPPContext.Provider
      value={{
        dataTPP,
        tpps,
        tppAssesments,
        dataTPPAssesment,
        reports,
        totalPages,

        getReports,
        getDataTPPAssesment,
        getDataTPP,
        getTPPs,
        getTPPAssements
      }}
      {...props}
    />
  );
};

export default TPPProvider;
