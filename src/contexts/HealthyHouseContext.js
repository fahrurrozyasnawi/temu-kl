import API from 'api';
import { createContext, useCallback, useState } from 'react';

export const HealthyHouseContext = createContext({});

const HealthyHouseProvider = (props) => {
  const [dataHealthyHouse, setDataHealthyHouse] = useState({});
  const [healthyHouses, setHealthyHouses] = useState([]);
  const [healthyHouseAssesments, setHealthyHouseAssesments] = useState([]);

  const getDataHealthyHouse = useCallback(async (id, params) => {
    await API.getOneHealthyHouse(id, params)
      .then((res) => {
        const { data } = res.data;

        console.log('data', res.data);
        setDataHealthyHouse(data);
      })
      .catch((err) => console.log('err data healhtyHouse', err));
  }, []);

  const getHealthyHouseAssements = useCallback(async (params) => {
    await API.getHealthyHouseAssements(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setHealthyHouseAssesments(data);
      })
      .catch((err) => console.log('err data healhtyHouse', err));
  }, []);

  const getHealthyHouses = useCallback(async (params) => {
    await API.getHealthyHouses(params)
      .then((res) => {
        const { data } = res.data;

        // console.log('data', data);
        setHealthyHouses(data);
      })
      .catch((err) => console.log('err data healhtyHouse', err));
  }, []);

  return (
    <HealthyHouseContext.Provider
      value={{
        dataHealthyHouse,
        healthyHouses,
        healthyHouseAssesments,
        getDataHealthyHouse,
        getHealthyHouses,
        getHealthyHouseAssements
      }}
      {...props}
    />
  );
};

export default HealthyHouseProvider;
