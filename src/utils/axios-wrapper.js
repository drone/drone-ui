import axios from 'axios';

import { token, instance } from '_constants';

const axiosInstance = axios.create({
  baseURL: instance,
  headers: token ? {
    Authorization: `Bearer ${token}`,
  } : {},
  withCredentials: true,
});

const axiosWrapper = async (url, options) => {
  try {
    const res = await axiosInstance(url, options);
    return res.data;
  } catch (error) {
    const customError = new Error();
    if (error.response) {
      customError.message = error.response.data.message;
    } else if (error.request) {
      customError.message = error.request.response;
    } else {
      customError.message = error.message;
    }
    throw customError;
  }
};

export default axiosWrapper;
