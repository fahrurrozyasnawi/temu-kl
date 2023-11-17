import API from 'api';
import { createContext, useCallback, useState } from 'react';

export const SanitaryContext = createContext({});

const SanitaryProvider = (props) => {
  const [dataSanitary, setDataSanitary] = useState({});
  const [dataSanitaryAssesment, setDataSanitaryAssesment] = useState({});
  const [sanitaries, setSanitaries] = useState([]);
  const [sanitaryAssesments, setSanitaryAssesments] = useState([]);

  const getDataSanitary = useCallback(async (id, params) => {
    await API.getOneSanitary(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataSanitary(data);
      })
      .catch((err) => console.log('err data sanitary', err));
  }, []);

  const getSanitaryAssements = useCallback(async (params) => {
    await API.getSanitaryAssements(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setSanitaryAssesments(data);
      })
      .catch((err) => console.log('err data sanitary', err));
  }, []);

  const getDataSanitaryAssement = useCallback(async (id, params) => {
    await API.getOneSanitaryAssement(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataSanitaryAssesment(data);
      })
      .catch((err) => console.log('err data sanitary', err));
  }, []);

  const getSanitaries = useCallback(async (params) => {
    await API.getSanitaries(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setSanitaries(data);
      })
      .catch((err) => console.log('err data sanitary', err));
  }, []);

  return (
    <SanitaryContext.Provider
      value={{
        dataSanitary,
        sanitaries,
        sanitaryAssesments,
        dataSanitaryAssesment,
        getDataSanitaryAssement,
        getDataSanitary,
        getSanitaries,
        getSanitaryAssements
      }}
      {...props}
    />
  );
};

export default SanitaryProvider;
