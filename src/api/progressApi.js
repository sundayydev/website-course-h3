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

// Hàm mới: Lấy tất cả tiến trình
export const getAllProgress = async () => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Thiếu token.');
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/Progress`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Lỗi khi lấy tất cả tiến trình: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Lỗi khi lấy tất cả tiến trình:', err.message);
        throw err;
    }
};

export const initializeProgress = async (lessonId, maxRetries = 5) => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();

    if (!userId || !token || !lessonId) {
        throw new Error('Thiếu userId, token hoặc lessonId.');
    }

    console.log('Dữ liệu gửi đi:', { userId, lessonId });

    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            console.log(`Kiểm tra tiến trình hiện có (lần ${attempt + 1}):`, { userId, lessonId });
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
                console.log(`Dữ liệu gửi đi để khởi tạo tiến độ (lần ${attempt + 1}):`, progressData);
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
                    console.error('Lỗi từ backend khi khởi tạo tiến độ:', errorData);
                    throw new Error(`Không thể tạo tiến độ: ${createResponse.statusText} - ${JSON.stringify(errorData)}`);
                }
                const newProgressResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!newProgressResponse.ok) {
                    const errorText = await newProgressResponse.text();
                    console.error(`Phản hồi lỗi từ GET (lần ${attempt + 1}):`, errorText);
                    throw new Error(`Không thể lấy tiến độ sau khi tạo (lần ${attempt + 1}): ${newProgressResponse.statusText} - ${errorText}`);
                }

                const newProgress = await newProgressResponse.json();
                console.log('Phản hồi từ GET sau khi tạo (nguyên bản):', newProgress);

                if (newProgress && (newProgress.Id || newProgress.id)) {
                    const progressId = newProgress.Id || newProgress.id;
                    if (typeof progressId === 'string' || typeof progressId === 'number') {
                        newProgress.Id = String(progressId);
                        console.log('Tiến trình sau khi tạo (đã chuẩn hóa):', newProgress);
                        return newProgress;
                    }
                }
                console.warn('Tiến trình trả về không chứa Id hợp lệ, thử lại:', newProgress);
                throw new Error('Tiến trình trả về không chứa Id hợp lệ hoặc định dạng không đúng.');
            } else {
                const existingProgress = await checkResponse.json();
                console.log('Tiến trình hiện có:', existingProgress);
                if (existingProgress && (existingProgress.Id || existingProgress.id)) {
                    const progressId = existingProgress.Id || existingProgress.id;
                    if (typeof progressId === 'string' || typeof progressId === 'number') {
                        existingProgress.Id = String(progressId);
                        return existingProgress;
                    }
                }
                console.warn('Tiến trình hiện có không chứa Id hợp lệ, thử lại:', existingProgress);
                throw new Error('Tiến trình hiện có không chứa Id hợp lệ.');
            }
        } catch (err) {
            console.error(`Lỗi khi khởi tạo tiến độ (lần ${attempt + 1}):`, err.message);
            attempt++;
            if (attempt === maxRetries) throw err;
        }
    }
};

export const updateProgress = async (progressId, updateData) => {
    const token = getAuthToken();

    if (!token || !progressId) {
        throw new Error('Thiếu token hoặc progressId.');
    }

    // Chuẩn hóa dữ liệu
    const normalizedData = {
        ...updateData,
        status: updateData.completionPercentage === 100
            ? 'completed'
            : updateData.completionPercentage > 0
                ? 'in progress'
                : 'not started',
        completionPercentage: Math.min(Math.max(updateData.completionPercentage, 0), 100), // Giới hạn 0-100
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
            console.error('Lỗi từ backend khi cập nhật tiến độ:', errorData);
            throw new Error(`Không thể cập nhật tiến độ: ${updateResponse.statusText} - ${JSON.stringify(errorData)}`);
        }

        return await updateResponse.json();
    } catch (err) {
        console.error('Lỗi khi cập nhật tiến độ:', err.message);
        throw err;
    }
};

export const getProgressByUserAndLesson = async (userId, lessonId) => {
    const token = getAuthToken();

    if (!token || !userId || !lessonId) {
        throw new Error('Thiếu token, userId hoặc lessonId.');
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Lỗi khi lấy tiến độ: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Lỗi khi lấy tiến độ:', err.message);
        throw err;
    }
};