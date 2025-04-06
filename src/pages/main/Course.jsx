import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';

import { getCourses } from '../../api/courseApi'; 
import { getReviewsByCourseId } from '../../api/reviewApi';
import { getEnrollmentsByCourseId } from '../../api/enrollmentApi';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const courseResponse = await getCourses();
      console.log('Course API Response:', courseResponse);

      if (!Array.isArray(courseResponse)) {
        throw new Error('Dữ liệu API không hợp lệ');
      }

      const enrichedCourses = await Promise.all(
        courseResponse.map(async (course) => {
          console.log('Processing course:', course.id);

          // Lấy số học viên (unique userId)
          let totalStudents = 0;
          try {
            const enrollmentResponse = await getEnrollmentsByCourseId(course.id);
            console.log(`Enrollments for ${course.id}:`, enrollmentResponse);
            
            // Tạo một Set chứa userId duy nhất
            const uniqueUsers = new Set(enrollmentResponse.map(e => e.userId));
            console.log("uniqueUsers", uniqueUsers);
            totalStudents = uniqueUsers.size;
          } catch (enrollmentError) {
            console.warn(`Không thể lấy đăng ký cho khóa học ${course.id}:`, enrollmentError);
          }

          // Lấy đánh giá
          let averageRating = 0;
          let totalReviews = 0;
          try {
            const reviewsResponse = await getReviewsByCourseId(course.id);
            console.log(`Reviews for ${course.id}:`, reviewsResponse);
            totalReviews = Array.isArray(reviewsResponse) ? reviewsResponse.length : 0;
            averageRating =
              totalReviews > 0
                ? reviewsResponse.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0;
          } catch (reviewError) {
            console.warn(`Không thể lấy đánh giá cho khóa học ${course.id}:`, reviewError);
          }
          console.log(totalStudents, averageRating, totalReviews);
          return {
            ...course,
            students: totalStudents, // Số học viên duy nhất
            averageRating: averageRating.toFixed(1),
            totalReviews,
          };
        })
      );

      setCourses(enrichedCourses);
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      setError('Không thể tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-50 z-50">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );

  if (error) return <div>{error}</div>;

  const handleCourseClick = (courseId) => {
    navigate(`/details/${courseId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-left mb-8">Khóa học</h1>
      <div className="flex flex-wrap justify-start gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r text-white w-full md:w-1/3 lg:w-[275px] transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className="flex-grow">
              <img
                src={`http://localhost:5221/${course.urlImage}`}
                className="w-full h-40 object-cover rounded-lg"
                alt={course.title}
              />
            </div>
            <div className="bg-gray-50 text-black p-4 min-w-[200px]">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <div className="mb-2">
                <p className="text-rose-500 text-lg font-semibold">
                  {course.price > 0 ? `${course.price.toLocaleString()} VND` : 'Miễn Phí'}
                </p>
              </div>
              <div className="flex justify-between text-sm font-semibold items-center">
  {/* Thay vì 3 cột, chúng ta có thể cho chúng nằm trong 1 hàng */}
  <div className="flex items-center gap-4">
    {/* Học viên */}
    <div className="flex items-center gap-1">
      <FaUser />
      <p className="text-center truncate">{course.students} học viên</p>
    </div>

    {/* Thời gian */}
    <div className="flex items-center gap-1">
      <FaClock />
      <p className="text-center truncate">{course.duration}</p>
    </div>

    {/* Đánh giá */}
    <div className="flex items-center gap-1">
      <FaStar className="text-yellow-500" />
      <p className="text-center truncate">
        {course.averageRating} ({course.totalReviews})
      </p>
    </div>
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
