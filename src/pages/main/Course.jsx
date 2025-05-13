import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';

import { getCourses } from '../../api/courseApi';
import { getReviewsByCourseId } from '../../api/reviewApi';
import { getEnrollmentsByCourseId } from '../../api/enrollmentApi'; // New API
import { getLessonsByCourseId } from '../../api/lessonApi';

const CourseList = () => {
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

      const enrichedCourses = await Promise.all(
        courseResponse.map(async (course) => {
          // Lấy số học viên (unique userId)
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
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handleCourseClick = (courseId) => {
    navigate(`/details/${courseId}`);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-left mb-8">Khóa học</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl shadow-lg overflow-hidden bg-white transform transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className="relative">
              <img
                src={
                  course.urlImage
                    ? `${import.meta.env.VITE_API_URL}${course.urlImage}`
                    : ' '
                }
                className="w-full h-40 object-cover"
                alt={course.title}
                onError={(e) => (e.target.src = '')}
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
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
  );
};

export default CourseList;