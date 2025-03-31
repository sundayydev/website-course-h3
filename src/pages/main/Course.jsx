import React, { useEffect, useState } from 'react';
import { FaClock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch dữ liệu từ API
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/Course');

        // Kiểm tra nếu response trả về là JSON
        if (response.ok) {
          const data = await response.json();

          // Kiểm tra nếu data là mảng
          if (Array.isArray(data)) {
            setCourses(data); // Lưu danh sách khóa học vào state
          } else {
            throw new Error('Dữ liệu trả về không phải là mảng');
          }
        } else {
          throw new Error('Không thể lấy dữ liệu từ API');
        }
      } catch (err) {
        setError('Không thể tải khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCourseClick = (courseId) => {
    navigate(`/details/${courseId}`); // Redirect to details page
  };
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-left mb-8">Khóa học</h1>
      <div className="flex flex-wrap justify-start gap-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r text-white w-full md:w-1/3 lg:w-[275px]
             transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className=" flex-grow">
              <img
                src={`http://localhost:5221/${course.urlImage}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div className="bg-gray-50 text-black p-4">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <div className="mb-2">
                <p className=" text-rose-500 text-lg font-semibold">
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
