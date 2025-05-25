import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Clock,
  Calendar,
} from 'lucide-react';
import { FaPlayCircle } from 'react-icons/fa';
import { getLessonsByChapterId, getLessonById } from '@/api/lessonApi';
import { getChaptersByCourseId } from '@/api/chapterApi';
import { toast } from 'react-toastify';
import { initializeProgress, updateProgress, getProgressByUserAndLesson } from '@/api/progressApi';
import LessonQuiz from '../../components/LessonQuiz';
import { getUserId } from '@/api/authUtils';
import MarkdownContent from '@/components/MarkdownContent';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/button';

const DetailsPageCourse = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const userId = getUserId();

  const [currentLesson, setCurrentLesson] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [openChapters, setOpenChapters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);
  const [isViewNotesPopupOpen, setIsViewNotesPopupOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [savedNotes, setSavedNotes] = useState('');

  const getVideoUrl = (videoName) => {
    if (!videoName) {
      console.warn('No videoName provided');
      return '';
    }
    if (videoName.includes('s3.amazonaws.com')) {
      return videoName;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('VITE_API_URL is not defined');
      return '';
    }
    return `${apiUrl}/api/lesson/stream/${videoName}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatVideoTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOpenNotePopup = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime ?? 0;
      setCurrentVideoTime(currentTime);
    } else {
      setCurrentVideoTime(0);
    }
    setIsNotePopupOpen(true);
  };

  const handleOpenViewNotesPopup = () => {
    setIsViewNotesPopupOpen(true);
  };

  const handleInitializeProgress = async (lessonId) => {
    try {
      const newProgress = await initializeProgress(lessonId);
      if (!newProgress || !newProgress.id) {
        console.warn('Không thể khởi tạo tiến độ, trả về giá trị mặc định.');
        return { id: null, completionPercentage: 0, status: 'not started', notes: '' };
      }
      return newProgress;
    } catch (err) {
      console.error('Lỗi khi khởi tạo tiến độ:', err.message);
      setError('Không thể khởi tạo tiến độ.');
      return { id: null, completionPercentage: 0, status: 'not started', notes: '' };
    }
  };

  const fetchCompletedLessons = async () => {
    if (!userId) return;
    try {
      const allLessons = Object.values(lessonsByChapter).flat();
      const completedIds = [];
      for (const lesson of allLessons) {
        const progress = await getProgressByUserAndLesson(userId, lesson.id);
        if (progress && progress.completionPercentage === 100) {
          completedIds.push(lesson.id);
        }
      }
      setCompletedLessonIds(completedIds);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bài học đã hoàn thành:', err);
      setCompletedLessonIds([]);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để cập nhật tiến độ.');
      return;
    }

    try {
      let progress = await getProgressByUserAndLesson(userId, lessonId);
      if (!progress || !progress.id) {
        progress = await handleInitializeProgress(lessonId);
        if (!progress || !progress.id) {
          console.warn('Không thể khởi tạo hoặc lấy tiến độ hợp lệ.');
          return;
        }
      }

      const updateData = {
        status: 'completed',
        completionPercentage: 100,
        notes: progress.notes || '',
      };
      const updatedProgress = await updateProgress(progress.id, updateData);
      if (updatedProgress && updatedProgress.completionPercentage === 100) {
        await fetchCompletedLessons();
        toast.success('Hoàn thành bài học!');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tiến độ:', err);
      toast.error(`Không thể cập nhật tiến độ: ${err.message}`);
    }
  };

  const navigateToNextLesson = () => {
    const allLessons = Object.values(lessonsByChapter).flat();
    const currentIndex = allLessons.findIndex((lesson) => String(lesson.id) === String(lessonId));

    if (currentIndex === -1) {
      toast.error('Không tìm thấy bài học hiện tại trong danh sách.');
      return;
    }

    if (currentIndex === allLessons.length - 1) {
      toast.info('Đây là bài học cuối cùng.');
      return;
    }

    const nextLesson = allLessons[currentIndex + 1];
    navigate(`/DetailsPageCourse/${nextLesson.id}`);
  };

  const handleSaveNote = async () => {
    if (!noteContent) {
      toast.error('Vui lòng nhập nội dung ghi chú.');
      return;
    }

    if (!userId) {
      toast.error('Vui lòng đăng nhập để lưu ghi chú.');
      return;
    }

    try {
      let progress = await getProgressByUserAndLesson(userId, lessonId);
      if (!progress || !progress.id) {
        progress = await initializeProgress(lessonId);
        if (!progress || !progress.id) {
          toast.error('Không thể khởi tạo tiến độ.');
          return;
        }
      }

      const formattedNote = `${formatVideoTime(currentVideoTime)}: ${noteContent}`;
      const existingNotes = progress.notes || '';
      const updatedNotes = existingNotes ? `${existingNotes}\n${formattedNote}` : formattedNote;

      const updateData = {
        status: progress.status || 'not started',
        completionPercentage: progress.completionPercentage || 0,
        notes: updatedNotes,
      };

      const updatedProgress = await updateProgress(progress.id, updateData);
      if (updatedProgress) {
        setSavedNotes(updatedNotes);
        setIsNotePopupOpen(false);
        setNoteContent('');
        toast.success('Ghi chú đã được lưu thành công.');

        const refreshedProgress = await getProgressByUserAndLesson(userId, lessonId);
        setSavedNotes(refreshedProgress.notes || 'Chưa có ghi chú nào.');
      }
    } catch (err) {
      console.error('Lỗi khi lưu ghi chú:', err.message, err.response?.data);
      toast.error(`Không thể lưu ghi chú: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setError('Vui lòng cung cấp lessonId hợp lệ.');
        setLoading(false);
        return;
      }

      try {
        const lessonResponse = await getLessonById(lessonId);
        console.log('Lesson Response:', lessonResponse);
        if (!lessonResponse) {
          setError('Không tìm thấy bài học.');
          setLoading(false);
          return;
        }
        const videoUrl = getVideoUrl(lessonResponse.videoName);
        console.log('Video URL:', videoUrl);
        setCurrentLesson({ ...lessonResponse, videoUrls: videoUrl });

        if (lessonResponse.courseId) {
          const chaptersResponse = await getChaptersByCourseId(lessonResponse.courseId);
          setChapters(chaptersResponse || []);

          let lessonsMap = {};
          for (const chapter of chaptersResponse || []) {
            const lessons = await getLessonsByChapterId(chapter.id);
            lessonsMap[chapter.id] = lessons || [];
          }
          setLessonsByChapter(lessonsMap);

          let progress;
          try {
            progress = await getProgressByUserAndLesson(userId, lessonId);
            if (!progress || !progress.id) {
              progress = await initializeProgress(lessonId);
            }
          } catch (err) {
            progress = await initializeProgress(lessonId);
          }

          setSavedNotes(progress.notes || 'Chưa có ghi chú nào.');
          await fetchCompletedLessons();
        } else {
          setChapters([]);
          setLessonsByChapter({});
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài học:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải bài học.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, navigate, userId]);

  // Tạm dừng video khi chuyển tab hoặc ứng dụng
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        console.log('Tab hidden, pausing video');
        videoRef.current.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const allLessons = Object.values(lessonsByChapter).flat();
  const totalLessons = allLessons.length || 1;
  const completedLessons = completedLessonIds.length;
  const completionPercentage = Math.min((completedLessons / totalLessons) * 100, 100);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="bg-gray-800 text-white flex items-center justify-between p-4 h-[50px] mt-16">
        <div className="flex items-center">
          <ArrowLeft size={24} className="mr-3 cursor-pointer" onClick={() => navigate(-1)} />
          <span className="ml-3 font-semibold">Khóa học</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Play size={18} className="mr-2 text-gray-400" />
            <span className="text-sm">
              Đã học: {completedLessons} / {totalLessons} bài ({completionPercentage.toFixed(2)}%)
            </span>
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-gray-300"
            onClick={handleOpenViewNotesPopup}
          >
            <Clock size={18} className="mr-2 text-blue-400" />
            <span className="text-sm">Ghi chú</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden mt-1">
        <div className="flex-[3] overflow-y-auto">
          <div className="bg-black flex items-center justify-center min-h-[500px] relative">
            {currentLesson?.videoUrls ? (
              <video
                ref={videoRef}
                src={currentLesson.videoUrls}
                controls
                controlsList="nodownload"
                className="w-full h-full max-w-[1000px] max-h-[500px] rounded-lg"
                onContextMenu={(e) => e.preventDefault()}
                onEnded={() => {
                  console.log('Video đã kết thúc, xử lý hoàn thành bài học:', lessonId);
                  handleLessonComplete(lessonId).then(() => navigateToNextLesson());
                }}
                onError={() => {
                  toast.error('Không thể tải video. Vui lòng thử lại.');
                }}
              >
                <source src={currentLesson.videoUrls} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            ) : (
              <p className="text-white text-center">Không có video để hiển thị.</p>
            )}
          </div>

          <div className="bg-white border-t border-gray-200 py-6 px-8">
            <h2 className="text-3xl font-bold">{currentLesson?.title || 'Không có tiêu đề'}</h2>
            <div className="flex items-center text-gray-500 mb-6">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm mr-3">{formatDate(currentLesson?.createdAt || '')}</span>

            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold mb-4 text-gray-800">Nội dung bài học</h3>
              {currentLesson?.content ? (
                <MarkdownContent content={currentLesson.content} />
              ) : (
                <p className="text-gray-300">Không có nội dung bài học.</p>
              )}
            </div>
            <LessonQuiz lessonId={lessonId} />
            <button
              onClick={handleOpenNotePopup}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Lưu ghi chú
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
          <h2 className="text-lg font-bold sticky top-0 bg-gray-100 z-10 pb-2">
            Nội dung khóa học
          </h2>
          {chapters.length > 0 ? (
            chapters.map((chapter, index) => (
              <div key={chapter.id} className="mb-3">
                <div
                  className="flex justify-between items-center p-3 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                  onClick={() => setOpenChapters((prev) => ({ ...prev, [index]: !prev[index] }))}
                >
                  <span className="font-bold">{chapter.title || 'Không có tiêu đề'}</span>
                  {openChapters[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openChapters[index] && (
                  <ul className="mt-2">
                    {lessonsByChapter[chapter.id]?.length > 0 ? (
                      lessonsByChapter[chapter.id].map((lesson) => (
                        <li
                          key={lesson.id}
                          className={`p-3 rounded-lg cursor-pointer ${lessonId === String(lesson.id) ? 'bg-red-100' : 'hover:bg-gray-200'}`}
                          onClick={() => navigate(`/DetailsPageCourse/${lesson.id}`)}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm">{lesson.title || 'Không có tiêu đề'}</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <FaPlayCircle className="mr-2 text-xs" />
                              <span>{formatDate(lesson.createdAt)}</span>
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-gray-500">Chưa có bài học</li>
                    )}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500">Chưa có chương nào.</p>
          )}
        </div>
      </div>

      {isNotePopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsNotePopupOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">
              Thêm ghi chú tại{' '}
              <span className="text-orange-500">{formatVideoTime(currentVideoTime)}</span>
            </h2>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Nội dung ghi chú..."
              className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsNotePopupOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tạo ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewNotesPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsViewNotesPopupOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">
              Ghi chú - {currentLesson?.title || 'Không có tiêu đề'}
            </h2>
            <p className="text-sm whitespace-pre-wrap">{savedNotes || 'Chưa có ghi chú nào.'}</p>
            <button
              onClick={() => setIsViewNotesPopupOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPageCourse;
