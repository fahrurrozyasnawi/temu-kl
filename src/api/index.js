import axios from 'axios';
import StaticVar from 'config/StaticVar';
import { toast } from 'react-hot-toast';
import { removeToken } from 'utils/token';
// import https from 'https';

const api = axios.create({
  // httpsAgent: new https.Agent({
  //   rejectUnauthorized: false
  // }),
  withCredentials: false,
  baseURL: StaticVar.URL_API,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log('error request api');
    return new Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('res', response);
    return response;
  },
  (error) => {
    console.log('error resp', error);
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login?expired';
      return;
    }

    if (error.code === 'ERR_NETWORK') {
      toast.error(error.code);
      removeToken();
      window.location.href = '/login?expired';
    }

    return Promise.reject(error);
  }
);

// API
const getUsers = (params) => api.get(`/users`, { params });
const getOneUser = (id, params) => api.get(`/users/${id}`, { params });
const postUser = (data) => api.post('/users', data);
const putUser = (id, data) => api.put(`/users/${id}`, data);
const deleteUser = (id) => api.delete(`/users/${id}`);

// puskesmas
const getPublicHealths = (params) => api.get(`/puskesmas`, { params });
const getOnePublicHealth = (id, params) =>
  api.get(`/puskesmas/${id}`, { params });
const postPublicHealth = (data) => api.post('/puskesmas', data);
const putPublicHealth = (id, data) => api.put(`/puskesmas/${id}`, data);
const deletePublicHealth = (id) => api.delete(`/puskesmas/${id}`);

// warga/pernduduk
const getResidents = (params) => api.get(`/resident`, { params });
const getOneResident = (id, params) => api.get(`/resident/${id}`, { params });
const postResident = (data) => api.post('/resident', data);
const putResident = (id, data) => api.put(`/resident/${id}`, data);
const deleteResident = (id) => api.delete(`/resident/${id}`);

// Bidang
// Penyehatan Air
const getWaters = (params) => api.get(`/water`, { params });
const getOneWater = (id, params) => api.get(`/water/${id}`, { params });
const postWater = (data) => api.post('/water', data);
const putWater = (id, data) => api.put(`/water/${id}`, data);
const deleteWater = (id) => api.delete(`/water/${id}`);

// Sanitasi
const getSanitaries = (params) => api.get(`/sanitary`, { params });
const getOneSanitary = (id, params) => api.get(`/sanitary/${id}`, { params });
const postSanitary = (data) => api.post('/sanitary', data);
const putSanitary = (id, data) => api.put(`/sanitary/${id}`, data);
const deleteSanitary = (id) => api.delete(`/sanitary/${id}`);

// Rumah Sehat
const getHealthyHouses = (params) => api.get(`/healthy-house`, { params });
const getOneHealthyHouse = (id, params) =>
  api.get(`/healthy-house/${id}`, { params });
const postHealthyHouse = (data) => api.post('/healthy-house', data);
const putHealthyHouse = (id, data) => api.put(`/healthy-house/${id}`, data);
const deleteHealthyHouse = (id) => api.delete(`/healthy-house/${id}`);

// TFU
const getTFUs = (params) => api.get(`/tfu`, { params });
const getOneTFU = (id, params) => api.get(`/tfu/${id}`, { params });
const postTFU = (data) => api.post('/tfu', data);
const putTFU = (id, data) => api.put(`/tfu/${id}`, data);
const deleteTFU = (id) => api.delete(`/tfu/${id}`);

// TPP
const getTPPs = (params) => api.get(`/tpp`, { params });
const getOneTPP = (id, params) => api.get(`/tpp/${id}`, { params });
const postTPP = (data) => api.post('/tpp', data);
const putTPP = (id, data) => api.put(`/tpp/${id}`, data);
const deleteTPP = (id) => api.delete(`/tpp/${id}`);

// Assesments/penilaian
const getWaterAssements = (params) => api.get(`/water/assesment`, { params });
const getOneWaterAssement = (id, params) =>
  api.get(`/water/assesment/${id}`, { params });
const postWaterAssement = (data, params) =>
  api.post('/water/assesment', data, { params });
const putWaterAssement = (id, data) => api.put(`/water/assesment/${id}`, data);
const deleteWaterAssement = (id) => api.delete(`/water/assesment/${id}`);

const getSanitaryAssements = (params) =>
  api.get(`/sanitary/assesment`, { params });
const getOneSanitaryAssement = (id, params) =>
  api.get(`/sanitary/assesment/${id}`, { params });
const postSanitaryAssement = (data, params) =>
  api.post('/sanitary/assesment', data, { params });
const putSanitaryAssement = (id, data) =>
  api.put(`/sanitary/assesment/${id}`, data);
const deleteSanitaryAssement = (id) => api.delete(`/sanitary/assesment/${id}`);

const getTPPAssements = (params) => api.get(`/tpp/assesment`, { params });
const getOneTPPAssement = (id, params) =>
  api.get(`/tpp/assesment/${id}`, { params });
const postTPPAssement = (data, params) =>
  api.post('/tpp/assesment', data, { params });
const putTPPAssement = (id, data) => api.put(`/tpp/assesment/${id}`, data);
const deleteTPPAssement = (id) => api.delete(`/tpp/assesment/${id}`);

const getTFUAssements = (params) => api.get(`/tfu/assesment`, { params });
const getOneTFUAssement = (id, params) =>
  api.get(`/tfu/assesment/${id}`, { params });
const postTFUAssement = (data, params) =>
  api.post('/tfu/assesment', data, { params });
const putTFUAssement = (id, data) => api.put(`/tfu/assesment/${id}`, data);
const deleteTFUAssement = (id) => api.delete(`/tfu/assesment/${id}`);

const getHealthyHouseAssements = (params) =>
  api.get(`/healthy-house/assesment`, { params });
const getOneHealthyHouseAssement = (id, params) =>
  api.get(`/healthy-house/assesment/${id}`, { params });
const postHealthyHouseAssement = (data, params) =>
  api.post('/healthy-house/assesment', data, { params });
const putHealthyHouseAssement = (id, data) =>
  api.put(`/healthy-house/assesment/${id}`, data);
const deleteHealthyHouseAssement = (id) =>
  api.delete(`/healthy-house/assesment/${id}`);

// documents api
const getDocuments = (params) => api.get(`/document`, { params });
const getOneDocument = (id, params) => api.get(`/document/${id}`, { params });
const postDocument = (data, params) => api.post('/document', data, { params });
const putDocument = (id, data) => api.put(`/document/${id}`, data);
const uploadDocument = (data) =>
  api.post(`/document/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
const deleteDocument = (id) => api.delete(`/document/${id}`);

// data area
const getDataArea = (params) => api.get('/area', { params });

// dashboard
const getDashboard = (params) => api.get('/dashboard', { params });

// reports
const getReports = (params) => api.get(`/report`, { params });
const getOneReport = (id, params) => api.get(`/report/${id}`, { params });
const postReport = (data, params) => api.post('/report', data, { params });
const putReport = (id, data) => api.put(`/report/${id}`, data);
const deleteReport = (id) => api.delete(`/report/${id}`);

const API = {
  getDataArea,
  getDashboard,

  getUsers,
  getOneUser,
  postUser,
  putUser,
  deleteUser,

  getPublicHealths,
  getOnePublicHealth,
  postPublicHealth,
  putPublicHealth,
  deletePublicHealth,

  getResidents,
  getOneResident,
  postResident,
  putResident,
  deleteResident,

  getWaters,
  getOneWater,
  postWater,
  putWater,
  deleteWater,

  getSanitaries,
  getOneSanitary,
  postSanitary,
  putSanitary,
  deleteSanitary,

  getHealthyHouses,
  getOneHealthyHouse,
  postHealthyHouse,
  putHealthyHouse,
  deleteHealthyHouse,

  getTFUs,
  getOneTFU,
  postTFU,
  putTFU,
  deleteTFU,

  getTPPs,
  getOneTPP,
  postTPP,
  putTPP,
  deleteTPP,

  getWaterAssements,
  getOneWaterAssement,
  postWaterAssement,
  putWaterAssement,
  deleteWaterAssement,

  getSanitaryAssements,
  getOneSanitaryAssement,
  postSanitaryAssement,
  putSanitaryAssement,
  deleteSanitaryAssement,

  getTPPAssements,
  getOneTPPAssement,
  postTPPAssement,
  putTPPAssement,
  deleteTPPAssement,

  getTFUAssements,
  getOneTFUAssement,
  postTFUAssement,
  putTFUAssement,
  deleteTFUAssement,

  getHealthyHouseAssements,
  getOneHealthyHouseAssement,
  postHealthyHouseAssement,
  putHealthyHouseAssement,
  deleteHealthyHouseAssement,

  getDocuments,
  getOneDocument,
  postDocument,
  putDocument,
  deleteDocument,
  uploadDocument,

  getReports,
  getOneReport,
  postReport,
  putReport,
  deleteReport
};

export default API;
