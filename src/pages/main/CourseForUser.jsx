/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaStar, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { getActiveCourses } from '../../api/courseApi';
import { getReviewsByCourseId } from '../../api/reviewApi';
import { getEnrollmentsByCourseId, getEnrollmentByUserId } from '../../api/enrollmentApi';
import { getLessonsByCourseId } from '../../api/lessonApi';
import { getUserId } from '../../api/authUtils';

const CourseForUser = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {

    try {
      const userId = getUserId();
      // Lấy danh sách đăng ký của người dùng
      const enrollmentResponse = await getEnrollmentByUserId(userId);
      const enrolledCourseIds = Array.isArray(enrollmentResponse.data)
        ? enrollmentResponse.data.map((enrollment) => enrollment.courseId)
        : [];

      if (enrolledCourseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      // Lấy tất cả khóa học
      const courseResponse = await getActiveCourses();
      if (!Array.isArray(courseResponse)) {
        throw new Error('Dữ liệu khóa học không hợp lệ');
      }

      // Lọc các khóa học mà người dùng đã đăng ký
      const enrolledCourses = courseResponse.filter((course) =>
        enrolledCourseIds.includes(course.id)
      );

      // Lấy thông tin bổ sung cho các khóa học đã đăng ký
      const enrichedCourses = await Promise.all(
        enrolledCourses.map(async (course) => {
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
          };
        })
      );

      setCourses(enrichedCourses);
    } catch (err) {
      console.error('Lỗi khi tải khóa học:', err);

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

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaCheckCircle className="text-green-600 text-xl" />
        Khóa học đã đăng ký
      </h2>

      {courses.length === 0 ? (
        <p className="text-gray-600 text-center font-bold">Bạn chưa đăng ký khóa học nào.</p>
      ) : (
        <div className="flex flex-wrap justify-start gap-10">
          {courses.map((course) => (
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