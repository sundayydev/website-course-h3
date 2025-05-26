import api from './axios';
import { getAuthToken } from './authUtils';

const API_URL = '/api/Coupon';

// Get all coupons
export const getAllCoupons = async () => {
    try {
        return await api.get(API_URL);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách mã giảm giá');
    }
};

// Get coupon by ID
export const getCouponById = async (id) => {
    try {
        return await api.get(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin mã giảm giá');
    }
};

// Get coupon by code
export const getCouponByCode = async (code) => {
    try {
        return await api.get(`${API_URL}/code/${code}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy mã giảm giá theo mã');
    }
};

// Create a new coupon
export const createCoupon = async (couponData) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Không tìm thấy token');
    }
    try {
        const response = await api.post(API_URL, couponData);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi tạo mã giảm giá');
    }
};

// Update a coupon
export const updateCoupon = async (id, couponData) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Không tìm thấy token');
    }
    try {
        const response = await api.put(`${API_URL}/${id}`, couponData);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật mã giảm giá');
    }
};

// Delete a coupon
export const deleteCoupon = async (id) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Không tìm thấy token');
    }
    try {
        return await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi khi xóa mã giảm giá');
    }
};