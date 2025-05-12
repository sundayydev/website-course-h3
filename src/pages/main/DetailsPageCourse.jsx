import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ChevronDown, ChevronUp, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { FaPlayCircle } from 'react-icons/fa';
import { getLessonsByChapterId, getLessonById } from '@/api/lessonApi';
import { getChaptersByCourseId } from '@/api/chapterApi';
import { jwtDecode } from 'jwt-decode';
import YouTube from 'react-youtube';
import { toast } from "react-toastify";
import { initializeProgress, updateProgress, getProgressByUserAndLesson } from '@/api/progressApi';

// Hàm lấy userId từ token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    return null;
  }
};

const DetailsPageCourse = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const userId = getUserIdFromToken();

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

  const parseISODurationToSeconds = (isoDuration) => {
    const match = isoDuration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    const hours = match[1] ? parseInt(match[1]) * 3600 : 0;
    const minutes = match[2] ? parseInt(match[2]) * 60 : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return hours + minutes + seconds;
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

  const extractVideoId = (url) => {
    const urlString = Array.isArray(url) ? url[0] : typeof url === 'string' ? url : '';
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return urlString.match(regex)?.[1] || null;
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    console.log('YouTube player đã sẵn sàng');
  };

  const onPlayerStateChange = async (event) => {
    console.log('Trạng thái video thay đổi:', event.data);
    if (event.data === 0 && lessonId) {
      console.log('Video đã kết thúc, xử lý hoàn thành bài học:', lessonId);
      await handleLessonComplete(lessonId);
      await navigateToNextLesson();
    }
  };

  const handleOpenNotePopup = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime() ?? 0;
      setCurrentVideoTime(currentTime);
    } else {
      setCurrentVideoTime(0);
    }
    setIsNotePopupOpen(true);
  };

  const handleOpenViewNotesPopup = () => {
    if (!savedNotes) {
      setSavedNotes('Chưa có ghi chú nào.');
    }
    setIsViewNotesPopupOpen(true);
  };

  const handleInitializeProgress = async (lessonId) => {
    try {
      const newProgress = await initializeProgress(lessonId);
      console.log('Tiến trình sau khi khởi tạo từ handleInitializeProgress:', newProgress);
      if (!newProgress || !newProgress.Id) {
        console.warn('Không thể khởi tạo tiến độ, trả về giá trị mặc định.');
        return { Id: null, completionPercentage: 0, status: 'not started' };
      }
      return newProgress;
    } catch (err) {
      console.error('Lỗi khi khởi tạo tiến độ:', err.message);
      setError('Không thể khởi tạo tiến độ.');
      return { Id: null, completionPercentage: 0, status: 'not started' };
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

    console.log('Bắt đầu handleLessonComplete với:', { userId, lessonId });
    try {
      let progress = await getProgressByUserAndLesson(userId, lessonId);
      console.log('Progress ban đầu:', progress);

      if (!progress || !progress.Id) {
        console.log('Tiến trình chưa tồn tại hoặc thiếu Id, khởi tạo mới...');
        progress = await handleInitializeProgress(lessonId);
        console.log('Progress sau khi khởi tạo:', progress);
        if (!progress || !progress.Id) {
          console.warn('Không thể khởi tạo hoặc lấy tiến độ hợp lệ.');
          return;
        }
      }

      const updateData = {
        status: 'completed',
        completionPercentage: 100,
        notes: progress.Notes || '',
      };
      console.log('Dữ liệu cập nhật tiến độ:', updateData);
      const updatedProgress = await updateProgress(progress.Id, updateData);
      console.log('Progress sau khi cập nhật:', updatedProgress);
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
    console.log('Danh sách tất cả bài học:', allLessons);
    console.log('lessonId hiện tại:', lessonId);

    const currentIndex = allLessons.findIndex(lesson => String(lesson.id) === String(lessonId));

    if (currentIndex === -1) {
      console.error('Không tìm thấy bài học hiện tại trong danh sách:', lessonId);
      toast.error('Không tìm thấy bài học hiện tại trong danh sách.');
      return;
    }

    if (currentIndex === allLessons.length - 1) {
      console.log('Đây là bài học cuối cùng');
      toast.info('Đây là bài học cuối cùng.');
      return;
    }

    const nextLesson = allLessons[currentIndex + 1];
    console.log('Chuyển sang bài học tiếp theo:', nextLesson.id);
    navigate(`/DetailsPageCourse/${nextLesson.id}`);
  };

  const handleSaveNote = () => {
    if (!noteContent) {
      toast.error('Vui lòng nhập nội dung ghi chú.');
      return;
    }

    const formattedNote = `${formatVideoTime(currentVideoTime)}: ${noteContent}`;
    const updatedNotes = savedNotes && savedNotes !== 'Chưa có ghi chú nào.' ? `${savedNotes}\n${formattedNote}` : formattedNote;
    setSavedNotes(updatedNotes);
    setIsNotePopupOpen(false);
    setNoteContent('');
    toast.success('Ghi chú đã được lưu thành công.');
  };

  const allLessons = Object.values(lessonsByChapter).flat();

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setError('Vui lòng cung cấp lessonId hợp lệ.');
        setLoading(false);
        return;
      }

      let lessonsMap = {};

      try {
        console.log('Fetching lesson with lessonId:', lessonId);
        const lessonResponse = await getLessonById(lessonId);
        console.log('Lesson response:', lessonResponse);
        if (!lessonResponse) {
          setError('Không tìm thấy bài học.');
          setLoading(false);
          return;
        }
        setCurrentLesson(lessonResponse);

        const videoId = extractVideoId(lessonResponse.videoUrls);
        console.log('Extracted videoId:', videoId);
        if (videoId) {
          setCurrentLesson(prev => prev ? { ...prev, duration: 0 } : { ...lessonResponse, duration: 0 });
        } else {
          console.warn('Không tìm thấy video URL hợp lệ trong bài học:', lessonResponse);
          setCurrentLesson(prev => prev ? { ...prev, duration: 0 } : { ...lessonResponse, duration: 0 });
        }

        if (lessonResponse.courseId) {
          try {
            const chaptersResponse = await getChaptersByCourseId(lessonResponse.courseId);
            if (!chaptersResponse || chaptersResponse.length === 0) {
              console.warn('Không tìm thấy chương nào cho courseId:', lessonResponse.courseId);
              setChapters([]);
            } else {
              setChapters(chaptersResponse);
            }

            for (const chapter of chaptersResponse || []) {
              try {
                const lessons = await getLessonsByChapterId(chapter.id);
                lessonsMap[chapter.id] = lessons || [];
              } catch (err) {
                console.error(`Lỗi khi lấy bài học cho chapterId ${chapter.id}:`, err);
                lessonsMap[chapter.id] = [];
              }
            }
            console.log('Lessons by chapter:', lessonsMap);
            setLessonsByChapter(lessonsMap);

            await handleInitializeProgress(lessonId);
            await fetchCompletedLessons();
          } catch (err) {
            console.error('Lỗi khi lấy danh sách chương:', err);
            setChapters([]);
            setLessonsByChapter({});
          }
        } else {
          console.warn('Bài học không có courseId:', lessonResponse);
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
  }, [lessonId, navigate]);

  const formatDate = (isoString) => {
    return isoString ? new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) : 'Không rõ ngày';
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const totalLessons = allLessons.length || 1;
  const completedLessons = completedLessonIds.length;
  const completionPercentage = Math.min((completedLessons / totalLessons) * 100, 100);
  const videoId = extractVideoId(currentLesson?.videoUrls || '');

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
            <div className="flex items-center cursor-pointer hover:text-gray-300">
              <FaPlayCircle size={18} className="mr-2 text-gray-400" />
              <span className="text-sm">Hướng dẫn</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-gray-300" onClick={handleOpenViewNotesPopup}>
              <Clock size={18} className="mr-2 text-blue-400" />
              <span className="text-sm">Ghi chú</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden mt-1">
          <div className="flex-[3] overflow-y-auto">
            <div className="bg-black flex items-center justify-center min-h-[500px] relative">
              {videoId ? (
                  <YouTube
                      videoId={videoId}
                      opts={{ width: '1000', height: '500', playerVars: { autoplay: 0 } }}
                      onReady={onPlayerReady}
                      onStateChange={onPlayerStateChange}
                  />
              ) : (
                  <p className="text-white text-center">Không có video để hiển thị.</p>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 py-6 px-8">
              <h2 className="text-2xl font-bold">{currentLesson?.title || 'Không có tiêu đề'}</h2>
              <div className="flex items-center text-gray-500 mb-6">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm mr-3">{formatDate(currentLesson?.createdAt || '')}</span>
                {currentLesson?.duration !== undefined && currentLesson.duration > 0 && (
                    <span className="text-sm">Độ dài: {formatDuration(currentLesson.duration)}</span>
                )}
              </div>
              <p>{currentLesson?.content || 'Không có mô tả.'}</p>
              <button onClick={handleOpenNotePopup} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Lưu ghi chú
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 bg-gray-100 z-10 pb-2">Nội dung khóa học</h2>
            {chapters.length > 0 ? (
                chapters.map((chapter, index) => (
                    <div key={chapter.id} className="mb-3">
                      <div
                          className="flex justify-between items-center p-3 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                          onClick={() => setOpenChapters(prev => ({ ...prev, [index]: !prev[index] }))}
                      >
                        <span className="font-bold">{chapter.title || 'Không có tiêu đề'}</span>
                        {openChapters[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      {openChapters[index] && (
                          <ul className="mt-2">
                            {lessonsByChapter[chapter.id]?.length > 0 ? (
                                lessonsByChapter[chapter.id].map(lesson => (
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-2">
                  Thêm ghi chú tại <span className="text-orange-500">{formatVideoTime(currentVideoTime)}</span>
                </h2>
                <textarea
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="Nội dung ghi chú..."
                    className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsNotePopupOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Hủy bỏ
                  </button>
                  <button onClick={handleSaveNote} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Tạo ghi chú
                  </button>
                </div>
              </div>
            </div>
        )}

        {isViewNotesPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-2">Ghi chú - {currentLesson?.title || 'Không có tiêu đề'}</h2>
                <p className="text-sm whitespace-pre-wrap">{savedNotes}</p>
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