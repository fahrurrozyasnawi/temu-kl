import API from 'api';
import { createContext, useCallback, useState } from 'react';

export const TPPContext = createContext({});

const TPPProvider = (props) => {
  const [dataTPP, setDataTPP] = useState({});
  const [dataTPPAssesment, setDataTPPAssesment] = useState({});
  const [tpps, setTpps] = useState([]);
  const [tppAssesments, setTppAssesments] = useState([]);

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
        const { data } = res.data;

        // console.log('data', data);
        setTppAssesments(data);
      })
      .catch((err) => console.log('err data tpp', err));
  }, []);

  const getTPPs = useCallback(async (params) => {
    await API.getTPPs(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
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
