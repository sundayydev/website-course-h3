import axios from 'axios';

const API_URL = '/order';

export const getOrder = () => {
  return api.get(`${API_URL}`);
};

export const getOrdersByUserId = (userId) => {
  return axiosInstance.get(`${API_URL}/user/${userId}`);
};
export const getOrderDetailsById = (orderId) => {
  return axiosInstance.get(`${API_URL}/${orderId}/details`);
};
