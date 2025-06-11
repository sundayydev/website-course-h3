/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaStar, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HashLoader from 'react-spinners/HashLoader';
import { getActiveCourses } from '../../api/courseApi';
import { getReviewsByCourseId } from '../../api/reviewApi';
import { getEnrollmentsByCourseId, getEnrollmentByUserId } from '../../api/enrollmentApi';
import { getLessonsByCourseId } from '../../api/lessonApi';
import { getUserId, isAuthenticated } from '../../api/authUtils';
import { toast } from 'react-toastify';

const CourseForUser = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoggedIn, user, refreshHome } = useSelector((state) => state.auth); // Lấy isLoggedIn từ Redux
  const coursesPerPage = 4;
  const navigate = useNavigate();

  // Hàm lấy danh sách khóa học
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const enrollmentResponse = await getEnrollmentByUserId();
      const enrolledCourseIds = Array.isArray(enrollmentResponse.data)
        ? enrollmentResponse.data
          .filter((enrollment) => enrollment.status === 'Enrolled')
          .map((enrollment) => enrollment.courseId)
        : [];

      if (enrolledCourseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const courseResponse = await getActiveCourses();
      if (!Array.isArray(courseResponse)) {
        throw new Error('Dữ liệu khóa học không hợp lệ');
      }

      const enrolledCourses = courseResponse.filter((course) =>
        enrolledCourseIds.includes(course.id)
      );

      const enrichedCourses = await Promise.all(
        enrolledCourses.map(async (course) => {
          let totalStudents = 0;
          try {
            const enrollmentResponse = await getEnrollmentsByCourseId(course.id);
            const uniqueUsers = new Set(enrollmentResponse.map((e) => e.userId));
            totalStudents = uniqueUsers.size;
          } catch (enrollmentError) {
            console.log(`Không thể lấy đăng ký cho khóa học ${course.id}:`, enrollmentError);
          }

          let averageRating = 0;
          let totalReviews = 0;
          try {
            const reviewsResponse = await getReviewsByCourseId(course.id);
            totalReviews = Array.isArray(reviewsResponse) ? reviewsResponse.length : 0;
            averageRating =
              totalReviews > 0
                ? reviewsResponse.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0;
          } catch (reviewError) {
            console.log(`Không thể lấy đánh giá cho khóa học ${course.id}:`, reviewError);
          }

          let totalHours = '0 phút';
          try {
            const lessons = await getLessonsByCourseId(course.id);
            if (Array.isArray(lessons)) {
              const totalMinutes = lessons.reduce((sum, lesson) => {
                return sum + (Number(lesson.duration) || 0);
              }, 0);
              if (totalMinutes >= 60) {
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                totalHours = `${hours}h${minutes > 0 ? `${minutes}p` : ''}`;
              } else if (totalMinutes > 0) {
                totalHours = `${totalMinutes} phút`;
              }
            }
          } catch (lessonError) {
            console.log(`Không thể lấy bài học cho khóa học ${course.id}:`, lessonError);
          }

          return {
            ...course,
            students: totalStudents,
            averageRating: averageRating.toFixed(1),
            totalReviews,
            totalHours,
          };
        })
      );

      setCourses(enrichedCourses);
    } catch (err) {
      console.error('Lỗi khi tải khóa học:', err);
      setError('Lỗi khi tải khóa học. Vui lòng thử lại sau.');
      toast.error('Lỗi khi tải khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchCourses khi isLoggedIn hoặc refreshHome thay đổi
  useEffect(() => {
    if (isLoggedIn) {
      fetchCourses();
    } else {
      setLoading(false);
      setCourses([]);
    }
  }, [isLoggedIn, refreshHome]);

  // Lắng nghe sự kiện authTokenChanged để cập nhật ngay lập tức
  useEffect(() => {
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        fetchCourses();
      }
    };

    window.addEventListener('authTokenChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authTokenChanged', handleAuthChange);
    };
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Hàm chuyển trang
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCheckCircle className="text-green-600 text-xl" />
          Khóa học đã đăng ký
        </h2>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-1 rounded-lg font-semibold text-white 
              ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              Trước
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-1 rounded-lg font-semibold text-white 
              ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
      {error ? (
        <p className="text-red-600 text-center font-bold">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-600 text-center font-bold">Bạn chưa đăng ký khóa học nào.</p>
      ) : (
        <div className="flex flex-wrap justify-start gap-5">
          {currentCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl shadow-lg overflow-hidden bg-white w-full md:w-1/3 lg:w-[325px] 
                transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
              onClick={() => navigate(`/details/${course.id}`)}
            >
              <div className="relative">
                <img
                  src={course.urlImage ? `${course.urlImage}` : ' '}
                  className="w-full h-40 object-cover"
                  alt={course.title}
                  onError={(e) => (e.target.src = '')}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3rem]">{course.title}</h3>
                <p className="text-rose-500 text-lg font-semibold mb-2">
                  {course.price > 0 ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-gray-500" />
                    <span>{course.students} học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-gray-500" />
                    <span>{course.totalHours}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span>
                      {course.averageRating} ({course.totalReviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseForUser;