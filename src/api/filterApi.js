import api from './axios';

const API_URL = '/filter';

export const filterCourses = async (filterParams = {}) => {
    try {
        const { category, minPrice, maxPrice, minRating, page = 1, limit = 10 } = filterParams;

        // Định dạng lại params để gửi đúng định dạng
        const formattedParams = {
            category: category || undefined, // Loại bỏ chuỗi rỗng
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            minRating: minRating ? Number(minRating) : undefined,
            page,
            limit,
        };

        console.log('Filter params:', formattedParams);
        const response = await api.get(`${API_URL}/courses`, {
            params: formattedParams,
        });

        console.log('Full API Response:', JSON.stringify(response.data, null, 2));

        // Kiểm tra và truy cập đúng vào data.Courses
        if (!response.data || !response.data.data || !Array.isArray(response.data.data.courses)) {
            console.error('API response does not contain courses array:', response.data);
            return [];
        }
        return response.data.data.courses;
    } catch (error) {
        console.error('Lỗi khi gọi API filterCourses:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw new Error(error.response?.data?.message || 'Lỗi khi lọc khóa học');
    }
};