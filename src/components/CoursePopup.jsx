import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getCourses } from '../api/courseApi';
import { getEnrollmentByUserId } from '../api/enrollmentApi';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getCourseById } from '../api/courseApi'; // Import hàm lấy thông tin khóa học theo ID

const CoursePopup = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  // Lấy userId từ token đã lưu trong localStorage
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.id;
    } catch (error) {
      console.error('Lỗi khi giải mã token:', error);
      return null;
    }
  };

  // Lấy danh sách khóa học từ API
  useEffect(() => {
    const fetchCourses = async () => {
      if (isOpen) {
        const userId = getUserIdFromToken();
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng!');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const enrollmentResponse = await getEnrollmentByUserId(userId);

          // Kiểm tra nếu có dữ liệu đăng ký
          if (!enrollmentResponse?.data || enrollmentResponse.data.length === 0) {
            console.log('Không có khóa học nào được đăng ký.');
            setCourses([]); // Set courses to empty array
            return;
          }

          // Lặp qua các khóa học đã đăng ký và lấy thông tin chi tiết từ API
          const coursesPromises = enrollmentResponse.data.map(async (enrollment) => {
            console.log('enrollment', enrollment);
            const coursesResponse = await getCourseById(enrollment.courseId);
            console.log('coursesResponse', coursesResponse);
            return coursesResponse; // Trả về thông tin khóa học
          });

          // Chờ tất cả các API gọi trả về kết quả
          const enrolledCourses = await Promise.all(coursesPromises);
          console.log('Danh sách khóa học đã đăng ký:', enrolledCourses); // Fix logging enrolled courses instead of promises

          // Filter out any null values from failed requests
          const validCourses = enrolledCourses.filter((course) => course != null);
          setCourses(validCourses);
        } catch (err) {
          setError('Không thể tải danh sách khóa học!');
          console.error(err);
          setCourses([]); // Set courses to empty array on error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [isOpen]); // Chạy lại khi `isOpen` thay đổi

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
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-hidden relative animate-in fade-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Khóa học của tôi</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Bạn chưa đăng ký khóa học nào!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course.id)}
                  className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={
                        course.urlImage
                          ? `${import.meta.env.VITE_API_URL}${course.urlImage}`
                          : import.meta.env.VITE_API_URL + '/placeholder.jpg'
                      }
                      className="h-16 w-16 rounded-md object-cover"
                      alt={course.title}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{course.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePopup;
