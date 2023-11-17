import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useContext, useEffect } from 'react';
import { AuthContext } from 'contexts/AuthContext';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const { isAuth } = useContext(AuthContext);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await getDataUser();
  //   };
  //   if (isAuth) {
  //     fetchData();
  //   }

  //   return () => {
  //     if (isAuth) {
  //       fetchData();
  //     }
  //   };
  // }, []);

  // console.log('isAuth', isAuth);
  return useRoutes([MainRoutes(isAuth), AuthenticationRoutes(isAuth)]);
}
