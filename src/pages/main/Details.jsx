import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  Plus,
  Minus,
  X,
  BookOpen,
  Clock,
  CheckCircle,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCourseById } from '@/api/courseApi';
import { getLessionsByCourseId } from '@/api/lessionApi';
import { getEnrollmentByUserId } from '@/api/enrollmentApi';
import Review from './Review';
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
const Details = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  const userId = getUserIdFromToken();
  console.log(userId); // Kiểm tra giá trị của userId
  console.log('isEnrolled:', isEnrolled);
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        if (data) {
          setCourse(data);
        } else {
          console.error('Không có dữ liệu khóa học');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
      }
    };

    const fetchLessons = async () => {
      try {
        const response = await getLessionsByCourseId(courseId);
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Dữ liệu bài học không hợp lệ');
        }
        setLessons(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài học:', error);
      }
    };

    const checkUserEnrollment = async () => {
      if (!userId) return;

      try {
        const response = await getEnrollmentByUserId(userId);
        const enrolledCourses = response.data;

        console.log('Danh sách khóa học đã đăng ký:', enrolledCourses); // Kiểm tra danh sách các khóa học đã đăng ký
        console.log('courseId đang kiểm tra:', courseId); // Kiểm tra khóa học đang kiểm tra

        // So sánh đúng với trường courseId trong enrolledCourses
        const isAlreadyEnrolled = enrolledCourses.some((course) => course.courseId === courseId);
        console.log('isAlreadyEnrolled:', isAlreadyEnrolled); // Kiểm tra trạng thái đăng ký

        setIsEnrolled(isAlreadyEnrolled);
      } catch (error) {
        console.error('Lỗi khi kiểm tra tình trạng đăng ký:', error);
      }
    };

    fetchCourse();
    fetchLessons();
    checkUserEnrollment();
  }, [courseId, userId]);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo('');
  };

  if (!course) {
    return <p className="text-center">Đang tải thông tin khóa học...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
      {/* Nội dung khóa học */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Bạn sẽ học được gì?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {/* Cột 1 */}
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-orange-500" size={20} />
              <span className="text-gray-700">Các kiến thức cơ bản, nền tảng về ngành IT</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-orange-500" size={20} />
              <span className="text-gray-700">Các thuật ngữ quan trọng trong lập trình</span>
            </div>

            {/* Cột 2 */}
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-orange-500" size={20} />
              <span className="text-gray-700">Hiểu cách Internet và máy tính hoạt động</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-orange-500" size={20} />
              <span className="text-gray-700">Kiến trúc ứng dụng và mô hình phát triển</span>
            </div>
          </div>
        </div>

        {/* Danh sách bài học */}
        <h2 className="text-xl font-bold mt-8 text-gray-800">Nội dung khóa học</h2>
        {/* Thông tin tổng quan */}
        <div className="mt-4 text-gray-600 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <BookOpen size={18} className="text-pink-500" />
            <span className="text-sm font-medium">
              Tổng số <strong className="text-black">{lessons.length}</strong> bài học
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={18} className="text-blue-500" />
            <span className="text-sm font-medium">
              {Math.floor((lessons.length * 15) / 60)} giờ {(lessons.length * 15) % 60} phút
            </span>
          </div>
        </div>
        <ul className="list-none space-y-2 mt-4 w-full">
          {lessons.map(({ id, title, content, videoUrl }, index) => (
            <div key={id} className="overflow-hidden w-full">
              <div
                className={`bg-gray-100 p-2 cursor-pointer flex justify-between items-center w-full h-14 ${expanded === index ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center space-x-2">
                  {expanded === index ? (
                    <Minus className="text-pink-500" size={16} />
                  ) : (
                    <Plus className="text-pink-500" size={16} />
                  )}
                  <span className="text-sm font-bold">{title}</span>
                </div>
              </div>
              {expanded === index && (
                <div className="bg-white p-3 border-x border-b rounded-b-2xl w-full">
                  <p className="text-gray-600 text-sm">{content}</p>
                  {videoUrl && (
                    <button
                      className="mt-2 flex items-center space-x-2 text-blue-500"
                      onClick={() => openVideoModal(videoUrl)}
                    >
                      <PlayCircle size={16} />
                      <span>Xem video</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </ul>
        <div className="mt-6">
          <Review courseId={courseId} />
        </div>
      </div>

      {/* Thanh bên phải - Video bài học đầu tiên & Đăng ký */}
      <div className="flex flex-col items-center space-y-4 p-4">
        {/* Video bài học đầu tiên */}
        {lessons.length > 0 && lessons[0].videoUrl && (
          <div className="w-full max-w-md relative">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={lessons[0].videoUrl}
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Bài học đầu tiên"
              ></iframe>
            </div>
          </div>
        )}

        {/* Hiển thị giá khóa học */}
        <div className="flex items-center text-lg font-bold text-rose-500">
          {course.price ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
        </div>

        {/* Nút đăng ký học */}
        <Button
          className={`w-64 text-white rounded-2xl shadow-lg ${isEnrolled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'}`}
          onClick={() => {
            if (isEnrolled) {
              if (lessons.length > 0) {
                navigate(`/detailsPageCourse/${lessons[0].id}`);
              }
            } else {
              navigate(`/payment/${courseId}`);
            }
          }}
        >
          {isEnrolled ? 'Đã đăng ký' : 'Đăng ký học'}
        </Button>

        {/* Thông tin khóa học */}
        <ul className="mt-4 space-y-2 text-gray-600">
          <li className="flex items-center">
            <BookOpen className="text-pink-500 mr-2" size={15} />
            Tổng số{' '}
            <strong className="text-gray-600 mr-1 ml-1 font-semibold">{lessons.length}</strong>bài
            học
          </li>
          <li className="flex items-center">
            <Clock className="text-pink-500 mr-2" size={15} />
            Thời lượng:{' '}
            <strong className="text-gray-600 mr-1 ml-1 font-semibold">
              {Math.floor((lessons.length * 15) / 60)} giờ {(lessons.length * 15) % 60} phút
            </strong>
          </li>
          <li className="flex items-center">
            <GraduationCap className="text-pink-500 mr-2" size={15} />
            Trình độ cơ bản
          </li>
          <li className="flex items-center">
            <Globe className="text-pink-500 mr-2" size={15} />
            Học mọi lúc, mọi nơi
          </li>
        </ul>
      </div>

      {/* Modal hiển thị video bài học */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl w-full max-w-4xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Video bài học</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={selectedVideo}
                  className="absolute top-0 left-0 w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Lesson Video"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
