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
import { getChaptersByCourseId } from '@/api/chapterApi';
import { getLessonsByChapterId } from '@/api/lessonApi';
import { getEnrollmentByUserId, createEnrollment } from '@/api/enrollmentApi';
import { getReviewsByCourseId } from '@/api/reviewApi';
import Review from './Review';
import { jwtDecode } from 'jwt-decode';
import PaymentModal from './Payment';

const Details = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) {
      setError('Không tìm thấy ID khóa học');
      return;
    }

    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        if (data) {
          setCourse(data);
        } else {
          setError('Không có dữ liệu khóa học');
        }
      } catch (error) {
        setError('Lỗi khi lấy thông tin khóa học');
        console.error('Lỗi khi lấy thông tin khóa học:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getChaptersByCourseId(courseId);
        setChapters(data);
        const lessonsByChapter = await Promise.all(
            data.map(async (chapter) => {
              const chapterLessons = await getLessonsByChapterId(chapter.id);
              return chapterLessons.map((lesson) => ({ ...lesson, chapterId: chapter.id }));
            })
        );
        const allLessons = lessonsByChapter.flat();
        setLessons(allLessons);
      } catch (error) {
        setError('Không thể lấy danh sách chương của khóa học');
        console.error('Error in fetchChapters:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await getReviewsByCourseId(courseId);
        setReviews(data);
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
      }
    };

    const checkUserEnrollment = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsEnrolled(false);
        return;
      }

      try {
        const response = await getEnrollmentByUserId();
        const enrolledCourses = response.data;
        const isAlreadyEnrolled = enrolledCourses.some(
            (enrollment) => enrollment.courseId === courseId && enrollment.status === 'Enrolled'
        );
        setIsEnrolled(isAlreadyEnrolled);
      } catch (error) {
        console.error('Lỗi khi kiểm tra đăng ký:', error);
        setIsEnrolled(false);
      }
    };

    fetchCourse();
    fetchChapters();
    fetchReviews();
    checkUserEnrollment();
  }, [courseId]);

  const toggleChapterExpand = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const toggleLessonExpand = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo('');
  };

  const handleEnrollClick = async () => {
    const token = localStorage.getItem('authToken');

    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          if (isEnrolled) {
            if (lessons.length > 0) {
              navigate(`/detailsPageCourse/${lessons[0].id}`);
            }
          } else {
            if (!course.price) {
              try {
                await createEnrollment(courseId);
                setIsEnrolled(true);
                if (lessons.length > 0) {
                  navigate(`/detailsPageCourse/${lessons[0].id}`);
                }
              } catch (error) {
                console.error('Lỗi khi đăng ký khóa học:', error);
                alert('Có lỗi xảy ra khi đăng ký khóa học. Vui lòng thử lại!');
              }
            } else {
              setIsPaymentModalOpen(true);
            }
          }
          return;
        }
      }
      localStorage.removeItem('authToken');
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi xử lý token:', error);
      alert('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
      navigate('/login');
    }
  };

  const calculateTotalHours = () => {
    if (!lessons || !Array.isArray(lessons)) return '0 phút';
    const totalMinutes = lessons.reduce((sum, lesson) => {
      return sum + (Number(lesson.duration) || 0);
    }, 0);
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h${minutes}p`;
    } else {
      return `${totalMinutes} phút`;
    }
  };

  const getEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  if (error) {
    return <p className="text-center text-red-500 pt-10">{error}</p>;
  }

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
              {course.contents &&
                  course.contents.map((content, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="text-orange-500" size={20} />
                        <span className="text-gray-700">{content}</span>
                      </div>
                  ))}
            </div>
          </div>

          {/* Danh sách chương và bài học */}
          <h2 className="text-xl font-bold mt-8 text-gray-800">Nội dung khóa học</h2>
          <div className="mt-4 text-gray-600 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-pink-500" />
              <span className="text-sm font-medium">
              Tổng số <strong className="text-black">{chapters.length}</strong> chương,{' '}
                <strong className="text-black">{lessons.length}</strong> bài học
            </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-blue-500" />
              <span className="text-sm font-medium">{calculateTotalHours()}</span>
            </div>
          </div>
          <ul className="list-none space-y-2 mt-4 w-full">
            {chapters.map((chapter) => (
                <div key={chapter.id} className="overflow-hidden w-full">
                  <div
                      className={`bg-gray-200 p-3 cursor-pointer flex justify-between items-center w-full h-16 ${
                          expandedChapter === chapter.id ? 'rounded-t-2xl' : 'rounded-2xl'
                      }`}
                      onClick={() => toggleChapterExpand(chapter.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {expandedChapter === chapter.id ? (
                          <Minus className="text-pink-500" size={16} />
                      ) : (
                          <Plus className="text-pink-500" size={16} />
                      )}
                      <span className="text-base font-bold">{chapter.title}</span>
                    </div>
                  </div>
                  {expandedChapter === chapter.id && (
                      <div className="bg-white p-3 border-x border-b rounded-b-2xl w-full">
                        <ul className="list-none space-y-2">
                          {lessons
                              .filter((lesson) => lesson.chapterId === chapter.id)
                              .map((lesson) => (
                                  <div key={lesson.id} className="overflow-hidden w-full">
                                    <div
                                        className={`bg-gray-100 p-2 cursor-pointer flex justify-between items-center w-full h-14 ${
                                            expandedLesson === lesson.id ? 'rounded-t-xl' : 'rounded-xl'
                                        }`}
                                        onClick={() => toggleLessonExpand(lesson.id)}
                                    >
                                      <div className="flex items-center space-x-2">
                                        {expandedLesson === lesson.id ? (
                                            <Minus className="text-pink-500" size={16} />
                                        ) : (
                                            <Plus className="text-pink-500" size={16} />
                                        )}
                                        <span className="text-sm font-medium">{lesson.title}</span>
                                      </div>
                                    </div>
                                    {expandedLesson === lesson.id && (
                                        <div className="bg-white p-3 border-x border-b rounded-b-xl w-full">
                                          <p className="text-gray-600 text-sm">{lesson.description}</p>
                                          {lesson.videoUrl && (
                                              <button
                                                  disabled={!isEnrolled}
                                                  className="mt-2 flex items-center space-x-2 text-blue-500 disabled:text-gray-400"
                                                  onClick={() => openVideoModal(lesson.videoUrl)}
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
                      </div>
                  )}
                </div>
            ))}
          </ul>

          {/* Đánh giá khóa học */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Đánh giá khóa học</h2>
            <Review
                courseId={courseId}
                reviews={reviews}
                isEnrolled={isEnrolled}
                onReviewSubmitted={() => getReviewsByCourseId(courseId).then(setReviews)}
            />
          </div>
        </div>

        {/* Thanh bên phải - Video bài học đầu tiên & Đăng ký */}
        <div className="flex flex-col items-center space-y-4 p-4">
          {lessons.length > 0 && lessons[0].videoUrl && (
              <div className="w-full max-w-md relative">
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                      src={getEmbedUrl(lessons[0].videoUrl)}
                      className="absolute top-0 left-0 w-full h-full rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Bài học đầu tiên"
                  ></iframe>
                </div>
              </div>
          )}
          <div className="flex items-center text-lg font-bold text-rose-500">
            {course.price ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
          </div>
          <Button
              className={`w-64 text-white rounded-2xl shadow-lg ${
                  isEnrolled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'
              }`}
              onClick={handleEnrollClick}
          >
            {isEnrolled ? 'Vào học' : 'Đăng ký học'}
          </Button>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center">
              <BookOpen className="text-pink-500 mr-2" size={15} />
              Tổng số{' '}
              <strong className="text-gray-600 mr-1 ml-1 font-semibold">{chapters.length}</strong>
              chương,{' '}
              <strong className="text-gray-600 mr-1 ml-1 font-semibold">{lessons.length}</strong>
              bài học
            </li>
            <li className="flex items-center">
              <Clock className="text-pink-500 mr-2" size={15} />
              Thời lượng:{' '}
              <strong className="text-gray-600 mr-1 ml-1 font-semibold">{calculateTotalHours()}</strong>
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
                        src={getEmbedUrl(selectedVideo)}
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
        {isPaymentModalOpen && (
            <PaymentModal onClose={closePaymentModal} courseId={courseId} /> // Truyền courseId như prop
        )}
      </div>
  );
};

export default Details;