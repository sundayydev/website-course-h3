/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaStar, FaFire } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { getCourses } from '../../api/courseApi';
import { getReviewsByCourseId } from '../../api/reviewApi';
import { getEnrollmentsByCourseId, getEnrollmentByUserId } from '../../api/enrollmentApi';
import { getLessonsByCourseId } from '../../api/lessonApi';
import { getUserId, isAuthenticated } from '../../api/authUtils';
import { formatDate } from '../../utils/formatDate';
import { getAllProgress } from '../../api/progressApi';

// Hàm chuyển đổi status sang tiếng Việt
const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'in progress':
      return 'Đang học';
    case 'not started':
      return 'Chưa bắt đầu';
    default:
      return 'Chưa bắt đầu';
  }
};

// Hàm tính trạng thái tổng hợp của khóa học
const calculateCourseStatus = (lessonStatuses) => {
  if (lessonStatuses.length === 0) return 'not started';
  const allCompleted = lessonStatuses.every((status) => status === 'completed');
  if (allCompleted) return 'completed';
  const anyInProgressOrCompleted = lessonStatuses.some(
    (status) => status === 'in progress' || status === 'completed'
  );
  return anyInProgressOrCompleted ? 'in progress' : 'not started';
};

const CourseNew = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const courseResponse = await getCourses();
      if (!Array.isArray(courseResponse)) {
        throw new Error('Dữ liệu khóa học không hợp lệ');
      }

      // Lấy danh sách khóa học đã đăng ký và tiến độ của người dùng
      let enrollmentData = {};
      let progressData = {};
      if (isAuthenticated()) {
        try {
          const userId = getUserId();
          // Lấy danh sách đăng ký
          const enrollmentResponse = await getEnrollmentByUserId();
          console.log('Dữ liệu đăng ký từ getEnrollmentByUserId:', enrollmentResponse);
          if (Array.isArray(enrollmentResponse.data)) {
            enrollmentResponse.data.forEach((enrollment) => {
              enrollmentData[enrollment.courseId] = { isEnrolled: true };
            });
          }
          // Lấy tất cả tiến trình
          const progressResponse = await getAllProgress();
          console.log('Dữ liệu tiến trình từ getAllProgress:', progressResponse);
          if (Array.isArray(progressResponse)) {
            progressResponse.forEach((progress) => {
              progressData[progress.lessonId] = {
                status: progress.status || 'not started',
                completionPercentage: progress.completionPercentage || 0,
              };
            });
          }
        } catch (enrollmentError) {
          console.warn('Không thể lấy danh sách đăng ký hoặc tiến trình:', enrollmentError);
        }
      }

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const enrichedCourses = await Promise.all(
        courseResponse.map(async (course) => {
          // Xác định khóa học mới (trong 7 ngày)
          let isNew = false;
          if (course.createdAt) {
            const parsedCreatedAt = formatDate(course.createdAt, 'yyyy-MM-dd HH:mm:ss');
            const createdAtDate = new Date(parsedCreatedAt);
            isNew = !isNaN(createdAtDate.getTime()) && createdAtDate > sevenDaysAgo;
            console.log(`Kiểm tra khóa học ${course.id}: createdAt=${course.createdAt}, isNew=${isNew}`);
          }

          // Kiểm tra trạng thái đăng ký
          const { isEnrolled = false } = enrollmentData[course.id] || {};

          // Tính trạng thái khóa học dựa trên trạng thái bài học
          let courseStatus = 'not started';
          if (isEnrolled) {
            try {
              const lessons = await getLessonsByCourseId(course.id);
              console.log(`Danh sách bài học cho khóa học ${course.id}:`, lessons);
              if (Array.isArray(lessons) && lessons.length > 0) {
                const lessonStatuses = lessons.map(
                  (lesson) => progressData[lesson.id]?.status || 'not started'
                );
                console.log(`Trạng thái bài học cho khóa học ${course.id}:`, lessonStatuses);
                courseStatus = calculateCourseStatus(lessonStatuses);
              }
            } catch (lessonError) {
              console.warn(`Không thể lấy bài học cho khóa học ${course.id}:`, lessonError);
            }
          }

          // Lấy số học viên
          let totalStudents = 0;
          try {
            const enrollmentResponse = await getEnrollmentsByCourseId(course.id);
            const uniqueUsers = new Set(enrollmentResponse.map((e) => e.userId));
            totalStudents = uniqueUsers.size;
          } catch (enrollmentError) {
            console.warn(`Không thể lấy đăng ký cho khóa học ${course.id}:`, enrollmentError);
          }

          // Lấy đánh giá
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
            console.warn(`Không thể lấy đánh giá cho khóa học ${course.id}:`, reviewError);
          }

          // Lấy tổng số giờ
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
            console.warn(`Không thể lấy bài học cho khóa học ${course.id}:`, lessonError);
          }

          return {
            ...course,
            students: totalStudents,
            averageRating: averageRating.toFixed(1),
            totalReviews,
            totalHours,
            isNew,
            isEnrolled,
            courseStatus,
          };
        })
      );

      setCourses(enrichedCourses);
    } catch (err) {
      console.error('Lỗi khi tải khóa học:', err);
      setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  // Lọc khóa học mới để hiển thị riêng (tùy chọn)
  const newCourses = courses.filter((course) => course.isNew);

  return (
    <div className="p-4 mx-auto">
      {/* Phần Khóa học mới (nếu có) */}
      {newCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
            <FaFire className="text-red-600 text-xl" />
            Khóa học mới
          </h2>
          <div className="flex flex-wrap justify-start gap-10 mb-8">
            {newCourses.map((course) => (
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
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Mới
                  </span>
                  {course.isEnrolled && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {getStatusText(course.courseStatus)}
                    </span>
                  )}
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
        </div>
      )}
    </div>
  );
};

export default CourseNew;