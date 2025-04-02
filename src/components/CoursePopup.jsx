import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getCourses } from '../api/courseApi';
import { getEnrollment } from '../api/enrollmentApi';
import * as jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CoursePopup = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  // Lấy userId từ token đã lưu trong localStorage
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      return decoded.userId;
    }
    return null;
  };

  // Lấy danh sách khóa học từ API
  useEffect(() => {
    if (isOpen) {
      const fetchCourses = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng!');
          return;
        }

        setLoading(true);
        setError(null);
        try {
          const coursesResponse = await getCourses();
          const enrollmentResponse = await getEnrollment();

          const enrolledCourses = enrollmentResponse.data.filter(
            (enrollment) => enrollment.userId === userId
          );

          const enrolledCourseIds = enrolledCourses.map((enrollment) => enrollment.courseId);
          const filteredCourses = coursesResponse.data.filter((course) =>
            enrolledCourseIds.includes(course.id)
          );

          setCourses(filteredCourses);
        } catch (err) {
          setError('Không thể tải danh sách khóa học!');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [isOpen]);

  // Đóng popup khi click vào ngoài popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCourseClick = (courseId) => {
    onClose(); // Đóng popup
    navigate(`/details/${courseId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 right-14 mr-56 z-50" ref={popupRef}>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80 relative">
        {/* Nút đóng */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Tiêu đề và nút Xem tất cả */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-700">Khóa học của tôi</h3>
        </div>

        {/* Danh sách khóa học */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500">Bạn chưa đăng ký khóa học nào!</p>
        ) : (
          <ul className="space-y-3">
            {courses.map((course) => (
              <li
                key={course.id}
                className="flex items-center p-3 rounded-lg border hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCourseClick(course.id)} // Thêm sự kiện click
              >
                <div>
                  <img
                    src={`http://localhost:5221/${course.urlImage}`}
                    className="w-12 h-12 rounded-lg mr-3 object-cover"
                    alt={course.title} // Alt cho hình ảnh
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{course.title}</p>
                  <p className="text-sm text-blue-500 hover:underline">{course.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CoursePopup;
