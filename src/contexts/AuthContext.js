import { createContext, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import StaticVar from 'config/StaticVar';
import { removeToken } from 'utils/token';
import { decodeToken, isExpired } from 'react-jwt';
import API from 'api';
// import https from 'https';

export const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [accessToken, setAccessToken] = useState(null);
  const [dataUser, setDataUser] = useState({});

  const getDataUser = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const _isExpired = isExpired(token);
      const _decodedToken = decodeToken(token);

      if (!_isExpired) {
        const { username } = _decodedToken;

        await API.getUsers({ username })
          .then((res) => {
            const { data } = res.data;
            // console.log('data', data);
            setDataUser(data[0]);
          })
          .catch((err) => console.log('err get user', err));
      }
    }
  }, []);

  const saveTokensToLocalStorage = (token) => {
    localStorage.setItem('token', token);
    setAccessToken(token);
  };

  const login = async (data) => {
    // console.log("data", data);
    await axios({
      url: '/auth/login',
      // httpsAgent: new https.Agent({
      //   rejectUnauthorized: false
      // }),
      withCredentials: false,
      baseURL: StaticVar.URL_API,
      method: 'post',
      data: data
    })
      .then((res) => {
        const token = res.data.token;
        // console.log('token result', token);

        saveTokensToLocalStorage(token);
        getDataUser();
        setIsAuth(true);

        // navigate("/");
      })
      .catch((err) => {
        const { status, msg } = err.response.data;

        if (status === 'error') {
          throw Error(msg);
        }
      });
  };

  const logout = () => {
    removeToken();

    setAccessToken(null);
    setIsAuth(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDataUser();
    };

    fetchData();
  }, [isAuth]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        accessToken,
        dataUser,
        login,
        logout,
        getDataUser
      }}
      {...props}
    />
  );
};

export default AuthProvider;
