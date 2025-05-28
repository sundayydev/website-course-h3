/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Minus,
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
import PaymentModal from './Payment';
import { getAuthToken, isAuthenticated, removeAuthToken } from '@/api/authUtils';

const Details = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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
      try {
        getAuthToken(); // Kiểm tra token
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

  const handleEnrollClick = async () => {
    try {
      if (isAuthenticated()) {
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
      } else {
        removeAuthToken();
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý đăng ký:', error);
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
    <div className="w-full mx-auto p-4 bg-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
      {/* Nội dung khóa học */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold mt-5 ">{course.title}</h1>
        <p className="text-gray-600 mt-2 ">{course.description}</p>

        <div className="bg-white p-6 rounded-xl shadow-md mt-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bạn sẽ học được gì?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.contents?.map((content, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="text-orange-500 flex-shrink-0" size={20} />
                <span className="text-gray-700">{content}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Danh sách chương và bài học */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-5">Nội dung khóa học</h2>
          <div className="flex items-center space-x-6 text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-emerald-500" />
              <span className="text-sm font-medium">
                <strong>{chapters.length}</strong> chương, <strong>{lessons.length}</strong> bài học
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-blue-500" />
              <span className="text-sm font-medium">{calculateTotalHours()}</span>
            </div>
          </div>
          <ul className="space-y-3">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div
                  className="p-4 cursor-pointer flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => toggleChapterExpand(chapter.id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedChapter === chapter.id ? (
                      <Minus className="text-emerald-500" size={16} />
                    ) : (
                      <Plus className="text-emerald-500" size={16} />
                    )}
                    <span className="font-semibold text-gray-800">{chapter.title}</span>
                  </div>
                </div>
                {expandedChapter === chapter.id && (
                  <div className="p-4 bg-white transition-all duration-300">
                    <ul className="space-y-2">
                      {lessons
                        .filter((lesson) => lesson.chapterId === chapter.id)
                        .map((lesson) => (
                          <li key={lesson.id} className="bg-gray-50 rounded-lg overflow-hidden">
                            <div
                              className="p-3 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => toggleLessonExpand(lesson.id)}
                            >
                              <div className="flex items-center space-x-3">
                                {expandedLesson === lesson.id ? (
                                  <Minus className="text-emerald-500" size={16} />
                                ) : (
                                  <Plus className="text-emerald-500" size={16} />
                                )}
                                <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                              </div>
                            </div>
                            {expandedLesson === lesson.id && (
                              <div className="p-3 bg-white border-t border-gray-200">
                                <p className="text-gray-600 text-sm">{lesson.description}</p>
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Đánh giá khóa học */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-emerald-600">Đánh giá khóa học</h2>
          <Review
            courseId={courseId}
            reviews={reviews}
            isEnrolled={isEnrolled}
            onReviewSubmitted={() => getReviewsByCourseId(courseId).then(setReviews)}
          />
        </div>
      </div>

      {/* Thanh bên phải - Hình ảnh khóa học & Đăng ký */}
      <div className="flex flex-col items-center space-y-4 mt-5">
        {course.urlImage && (
          <div className="w-[300px] relative">
            <div className="relative pb-[56.25%] h-0">
              <img
                src={course.urlImage}
                className="absolute top-0 left-0 w-full h-full rounded-2xl object-cover"
                alt="Course Image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'path/to/default-image.jpg';
                }}
              />
            </div>
          </div>

        )}
        <div className="flex items-center text-lg font-bold text-rose-500">
          {course.price ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
        </div>
        <Button
          className={`w-64 text-white rounded-2xl shadow-lg ${isEnrolled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          onClick={handleEnrollClick}
        >
          {isEnrolled ? 'Vào học' : 'Đăng ký học'}
        </Button>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <BookOpen className="text-emerald-500 mr-2" size={15} />
            Tổng số <strong className="text-gray-600 mr-1 ml-1 font-semibold">{chapters.length}</strong>
            chương, <strong className="text-gray-600 mr-1 ml-1 font-semibold">{lessons.length}</strong>
            bài học
          </li>
          <li className="flex items-center">
            <Clock className="text-emerald-500 mr-2" size={15} />
            Thời lượng: <strong className="text-gray-600 mr-1 ml-1 font-semibold">{calculateTotalHours()}</strong>
          </li>
          <li className="flex items-center">
            <GraduationCap className="text-emerald-500 mr-2" size={15} />
            Trình độ cơ bản
          </li>
          <li className="flex items-center">
            <Globe className="text-emerald-500 mr-2" size={15} />
            Học mọi lúc, mọi nơi
          </li>
        </ul>
      </div>

      {
        isPaymentModalOpen && (
          <PaymentModal onClose={closePaymentModal} courseId={courseId} />
        )
      }
    </div >
  );
};

export default Details;