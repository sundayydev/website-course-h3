// progressApi.js
import { jwtDecode } from 'jwt-decode';

const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.id;
    } catch (error) {
        console.error('Lỗi khi giải mã token:', error);
        return null;
    }
};

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5221';

// Lấy tất cả tiến trình
export const getAllProgress = async () => {
    const token = getAuthToken();
    if (!token) throw new Error('Thiếu token.');
    try {
        const response = await fetch(`${apiBaseUrl}/api/Progress`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Lỗi khi lấy tất cả tiến trình: ${response.statusText}`);
        return await response.json();
    } catch (err) {
        console.error('Lỗi khi lấy tất cả tiến trình:', err.message);
        throw err;
    }
};

// Khởi tạo tiến trình
export const initializeProgress = async (lessonId, maxRetries = 5) => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token || !lessonId) throw new Error('Thiếu userId, token hoặc lessonId.');

    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const checkResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (checkResponse.status === 404) {
                const progressData = {
                    userId,
                    lessonId,
                    status: 'not started',
                    completionPercentage: 0,
                    notes: '',
                };
                const createResponse = await fetch(`${apiBaseUrl}/api/Progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(progressData),
                });

                if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    throw new Error(`Không thể tạo tiến độ: ${createResponse.statusText} - ${JSON.stringify(errorData)}`);
                }

                const newProgressResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!newProgressResponse.ok) {
                    const errorText = await newProgressResponse.text();
                    throw new Error(`Không thể lấy tiến độ sau khi tạo: ${newProgressResponse.statusText} - ${errorText}`);
                }

                const newProgress = await newProgressResponse.json();
                if (newProgress && (newProgress.id || newProgress.Id)) {
                    newProgress.id = String(newProgress.id || newProgress.Id);
                    return newProgress;
                }
                throw new Error('Tiến trình trả về không chứa id hợp lệ.');
            } else if (checkResponse.ok) {
                const existingProgress = await checkResponse.json();
                if (existingProgress && (existingProgress.id || existingProgress.Id)) {
                    existingProgress.id = String(existingProgress.id || existingProgress.Id);
                    return existingProgress;
                }
                throw new Error('Tiến trình hiện có không chứa id hợp lệ.');
            } else {
                throw new Error(`Lỗi khi kiểm tra tiến trình: ${checkResponse.statusText}`);
            }
        } catch (err) {
            console.error(`Lỗi khi khởi tạo tiến độ (lần ${attempt + 1}):`, err.message);
            attempt++;
            if (attempt === maxRetries) throw err;
        }
    }
};

// Cập nhật tiến trình
export const updateProgress = async (progressId, updateData) => {
    const token = getAuthToken();
    if (!token || !progressId) throw new Error('Thiếu token hoặc progressId.');

    const normalizedData = {
        ...updateData,
        status: updateData.completionPercentage === 100 ? 'completed' : updateData.completionPercentage > 0 ? 'in progress' : 'not started',
        completionPercentage: Math.min(Math.max(updateData.completionPercentage, 0), 100),
        notes: updateData.notes || '',
    };

    try {
        const updateResponse = await fetch(`${apiBaseUrl}/api/Progress/${progressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(normalizedData),
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Không thể cập nhật tiến độ: ${updateResponse.statusText} - ${JSON.stringify(errorData)}`);
        }

        const updatedProgress = await updateResponse.json();
        if (!updatedProgress || !updatedProgress.id) {
            throw new Error('Phản hồi cập nhật tiến độ không hợp lệ.');
        }
        return updatedProgress;
    } catch (err) {
        console.error('Lỗi khi cập nhật tiến độ:', err.message);
        throw err;
    }
};

// Lấy tiến trình theo user và lesson
export const getProgressByUserAndLesson = async (userId, lessonId) => {
    const token = getAuthToken();
    if (!token || !userId || !lessonId) throw new Error('Thiếu token, userId hoặc lessonId.');

    try {
        const response = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 404) return null; // Không tìm thấy tiến trình
            throw new Error(`Lỗi khi lấy tiến độ: ${response.statusText}`);
        }

        const progress = await response.json();
        if (progress && (progress.id || progress.Id)) {
            progress.id = String(progress.id || progress.Id);
            progress.notes = progress.notes || progress.Notes || ''; // Chuẩn hóa notes
            return progress;
        }
        throw new Error('Tiến trình trả về không chứa id hợp lệ.');
    } catch (err) {
        console.error('Lỗi khi lấy tiến độ:', err.message);
        throw err;
    }
};