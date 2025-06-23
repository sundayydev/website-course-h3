import axios from 'axios';

const API_URL = '/search';

// Tìm kiếm kết hợp (courses và posts)
export const searchAll = (keyword, page = 1, pageSize = 10) => {
    return axios.get(`${API_URL}/all`, {
        params: { keyword, page, pageSize },
    });
};

// Tìm kiếm khóa học
export const searchCourses = (keyword, category = '', minPrice = null, maxPrice = null, page = 1, pageSize = 10) => {
    return axios.get(`${API_URL}/courses`, {
        params: { keyword, category, minPrice, maxPrice, page, pageSize },
    });
};

// Tìm kiếm bài viết
// Tìm kiếm theo bài viết
export const searchPosts = (keyword, author = '', startDate = null, endDate = null, page = 1, pageSize = 10) => {
    return axios.get(`${API_URL}/posts`, {
        params: { keyword, author, startDate, endDate, page, pageSize },
    });
};

