import React, { useEffect, useState } from 'react';
import { FaClock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';

import { getCourses } from '../../api/courseApi'; // Import API

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await getCourses();

      console.log('API Response:', response); // Log response để kiểm tra
      if (response?.data && Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        throw new Error('Dữ liệu API không hợp lệ');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      setError('Không thể tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(); // Gọi hàm fetchCourses khi component được render
  }, []); // Gọi 1 lần khi component mount

  // Hiển thị loading khi đang tải dữ liệu
  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-50 z-50">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );

  // Hiển thị lỗi nếu có
  if (error) return <div>{error}</div>;

  const handleCourseClick = (courseId) => {
    navigate(`/details/${courseId}`); // Chuyển hướng đến trang chi tiết khóa học
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-left mb-8">Khóa học</h1>
      <div className="flex flex-wrap justify-start gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r text-white w-full md:w-1/3 lg:w-[275px] transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
            onClick={() => handleCourseClick(course.id)} // Xử lý click vào khóa học
          >
            <div className="flex-grow">
              <img
                src={`http://localhost:5221/${course.urlImage}`}
                className="w-full h-40 object-cover rounded-lg"
                alt={course.title} // Alt cho hình ảnh
              />
            </div>
            <div className="bg-gray-50 text-black p-4">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <div className="mb-2">
                <p className="text-rose-500 text-lg font-semibold">
                  {course.price > 0 ? `${course.price.toLocaleString()} VND` : 'Miễn Phí'}
                </p>
              </div>
              <div className="flex space-x-6 text-sm font-semibold">
                <div className="flex flex-col items-center gap-2">
                  <FaUser />
                  <p>{course.students}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <FaClock />
                  <p>{course.duration}</p>
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
