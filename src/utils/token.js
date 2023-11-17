export const removeToken = () => {
  return localStorage.removeItem('token');
};

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};
