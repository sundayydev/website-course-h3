import api from './axios';

const API_URL = '/lesson';

// Lấy tất cả bài học
export const getLessons = async () => {
  try {
    const response = await api.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy danh sách bài học');
  }
};

// Lấy bài học theo ID
export const getLessonById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy bài học');
    }
    throw new Error('Lỗi khi lấy thông tin bài học');
  }
};

// Lấy bài học theo khóa học
export const getLessonsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu bài học không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching lessons:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách bài học của khóa học');
  }
};

// Lấy bài học theo chương
export const getLessonsByChapterId = async (chapterId) => {
  try {
    const response = await api.get(`${API_URL}/chapter/${chapterId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu bài học không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching lessons by chapter:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách bài học của chương');
  }
};

// Tạo bài học mới
export const createLesson = async (lessonData) => {
  try {
    const response = await api.post(API_URL, lessonData);
    return response.data;
  } catch (error) {
    throw new Error('Không thể tạo bài học mới');
  }
};

// Cập nhật bài học
export const updateLesson = async (id, lessonData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, lessonData);
    return response.data;
  } catch (error) {
    throw new Error('Không thể cập nhật bài học');
  }
};

// Xóa bài học
export const deleteLesson = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể xóa bài học');
  }
};

// Upload video
export const uploadVideoLesson = async (videoData, onProgress) => {
  const formData = new FormData();
  formData.append('file', videoData);
  try {
    const response = await api.post(`${API_URL}/upload-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress && onProgress(percentCompleted);
      },
    });
    console.log('Upload video response:', response.data); // Debug để kiểm tra dữ liệu
    return response.data;
  } catch (error) {
    console.error('Upload video error:', error);
    throw new Error('Không thể tải lên video');
  }
};

// Get video preview URL
export const getVideoPreviewUrl = (videoFile) => {
  return new Promise((resolve, reject) => {
    if (!videoFile) {
      reject(new Error('No video file provided'));
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        url: URL.createObjectURL(videoFile),
        duration: video.duration,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Error loading video metadata'));
    };
    video.src = URL.createObjectURL(videoFile);
  });
};

// Lấy video lesson
export const getVideoLesson = async (nameVideo) => {
  try {
    const response = await api.get(`${API_URL}/stream/${nameVideo}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy video lesson');
  }
};
