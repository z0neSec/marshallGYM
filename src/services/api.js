import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const axiosInst = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) axiosInst.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axiosInst.defaults.headers.common['Authorization'];
};

export default axiosInst;