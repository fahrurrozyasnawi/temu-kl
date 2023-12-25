import API from 'api';
import { createContext, useCallback, useState } from 'react';

export const WaterContext = createContext({});

const WaterProvider = (props) => {
  const [totalPages, setTotalPages] = useState(0);
  const [dataWater, setDataWater] = useState({});
  const [dataWaterAssesment, setDataWaterAssesment] = useState({});
  const [waters, setWaters] = useState([]);
  const [waterAssesments, setWaterAssesments] = useState([]);

  const getDataWaterAssesment = useCallback(async (id, params) => {
    await API.getOneWaterAssement(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataWaterAssesment(data);
      })
      .catch((err) => console.log('err data water', err));
  }, []);

  const getDataWater = useCallback(async (id, params) => {
    await API.getOneWater(id, params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setDataWater(data);
      })
      .catch((err) => console.log('err data water', err));
  }, []);

  const getWaterAssements = useCallback(async (params) => {
    await API.getWaterAssements(params)
      .then((res) => {
        const { data, totalPages } = res.data;

        // console.log('data', data);
        setTotalPages(totalPages);
        setWaterAssesments(data);
      })
      .catch((err) => console.log('err data water', err));
  }, []);

  const getWaters = useCallback(async (params) => {
    await API.getWaters(params)
      .then((res) => {
        const { data, totalPages } = res.data;

        // console.log('data', data);
        setTotalPages(totalPages);
        setWaters(data);
      })
      .catch((err) => console.log('err data water', err));
  }, []);

  return (
    <WaterContext.Provider
      value={{
        dataWater,
        waters,
        waterAssesments,
        dataWaterAssesment,
        totalPages,

        getDataWaterAssesment,
        setDataWater,
        getDataWater,
        getWaters,
        getWaterAssements
      }}
      {...props}
    />
  );
};

export default WaterProvider;
