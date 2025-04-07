import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL + '/api/search';

// Tìm kiếm kết hợp (courses và posts)
export const searchAll = (keyword, page = 1, pageSize = 10) => {
    return axios.get(`${BASE_URL}/all`, {
        params: { keyword, page, pageSize },
    });
};

// Tìm kiếm khóa học
export const searchCourses = (keyword, category = '', minPrice = null, maxPrice = null, page = 1, pageSize = 10) => {
    return axios.get(`${BASE_URL}/courses`, {
        params: { keyword, category, minPrice, maxPrice, page, pageSize },
    });
};

// Tìm kiếm bài viết
export const searchPosts = (keyword, author = '', startDate = null, endDate = null, page = 1, pageSize = 10) => {
    return axios.get(`${BASE_URL}/posts`, {
        params: { keyword, author, startDate, endDate, page, pageSize },
    });
};