import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ChevronDown, ChevronUp, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { FaPlayCircle } from 'react-icons/fa';
import { getLessonsByCourseId, getLessonById } from '@/api/lessonApi';
import { jwtDecode } from 'jwt-decode';
import YouTube from 'react-youtube';
import { toast } from "react-toastify";

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

// Hàm lấy token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const DetailsPageCourse = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [sections, setSections] = useState([]);
  const [openSections, setOpenSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedLessons, setCompletedLessons] = useState(0);
  const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);
  const [isViewNotesPopupOpen, setIsViewNotesPopupOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [savedNotes, setSavedNotes] = useState('');

  const userId = getUserIdFromToken();
  const token = getAuthToken();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  // Hàm định dạng thời gian
  const formatDuration = (isoDuration) => {
    if (!isoDuration) return '0:00';
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return `${hours > 0 ? hours + ':' : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Hàm định dạng thời gian video
  const formatVideoTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Hàm trích xuất ID video từ URL
  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return url?.match(regex)?.[1] || null;
  };

  // Hàm chuẩn bị video
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  // Hàm xử lý sự kiện trạng thái video
  const onPlayerStateChange = async (event) => {
    if (event.data === 0) {
      await handleLessonComplete();
      await navigateToNextLesson();
    }
  };

  // Mở popup ghi chú
  const handleOpenNotePopup = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      setCurrentVideoTime(currentTime);
    }
    setIsNotePopupOpen(true);
  };

  // Xem ghi chú
  const handleOpenViewNotesPopup = async () => {
    if (!userId || !token || !lessonId) {
      setError('Vui lòng đăng nhập để xem ghi chú.');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        setSavedNotes('Chưa có ghi chú.');
      } else if (!response.ok) {
        throw new Error('Không thể lấy ghi chú');
      } else {
        const progress = await response.json();
        setSavedNotes(progress.notes || 'Chưa có ghi chú.');
      }
      setIsViewNotesPopupOpen(true);
    } catch (err) {
      console.error('Lỗi khi lấy ghi chú:', err);
      setSavedNotes('Có lỗi xảy ra khi lấy ghi chú.');
      setIsViewNotesPopupOpen(true);
    }
  };

  // Khởi tạo tiến độ
  const initializeProgress = async () => {
    if (!userId || !token || !lessonId) return;

    try {
      const response = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        const progressData = { userId, lessonId, status: 'not started' };
        const createResponse = await fetch(`${apiBaseUrl}/api/Progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(progressData),
        });

        if (!createResponse.ok) throw new Error('Không thể tạo tiến độ');
      }
    } catch (err) {
      console.error('Lỗi khi khởi tạo tiến độ:', err);
      setError('Không thể khởi tạo tiến độ.');
    }
  };

  // Cập nhật tiến độ bài học
  const handleLessonComplete = async () => {
    if (!userId || !token || !lessonId) return;

    try {
      const progressResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!progressResponse.ok) throw new Error('Không tìm thấy tiến độ');
      const progress = await progressResponse.json();
      const progressId = progress.id;

      const updateData = {
        status: 'completed',
        completionPercentage: 100,
        notes: progress.notes || '',
      };

      // Cập nhật tiến độ
      const updateResponse = await fetch(`${apiBaseUrl}/api/Progress/${progressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) throw new Error('Không thể cập nhật tiến độ');

      const courseProgressResponse = await fetch(
          `${apiBaseUrl}/api/Progress/course/${currentLesson.courseId}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (courseProgressResponse.status === 404) {
        setCompletedLessons(0);
      } else if (!courseProgressResponse.ok) {
        throw new Error('Không thể lấy tiến độ khóa học');
      } else {
        const progresses = await courseProgressResponse.json();
        const completed = progresses.filter(p => p.status === 'completed' || p.completionPercentage === 100).length;
        setCompletedLessons(completed);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tiến độ:', err);
      setError('Không thể cập nhật tiến độ.');
    }
  };

  // Chuyển đến bài học tiếp theo
  const navigateToNextLesson = () => {
    const lessons = sections[0]?.lessons || [];
    const currentIndex = lessons.findIndex(lesson => lesson.id.toString() === lessonId);

    if (currentIndex === -1 || currentIndex === lessons.length - 1) {
      toast.info('Đây là bài học cuối cùng.');
      return;
    }

    const nextLesson = lessons[currentIndex + 1];
    navigate(`/detailsPageCourse/${nextLesson.id}`);
  };

  // Lưu ghi chú
  const handleSaveNote = async () => {
    if (!userId || !token || !lessonId || !noteContent) {
      toast.error('Thiếu thông tin để lưu ghi chú.');
      return;
    }

    try {
      const progressResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!progressResponse.ok) throw new Error('Không tìm thấy tiến độ');
      const progress = await progressResponse.json();
      const progressId = progress.id;

      const formattedNote = `${formatVideoTime(currentVideoTime)}: ${noteContent}`;
      const updatedNotes = progress.notes ? `${progress.notes}\n${formattedNote}` : formattedNote;

      const updateData = {
        status: progress.status || 'not started',
        completionPercentage: progress.completionPercentage || 0,
        notes: updatedNotes,
      };

      const updateResponse = await fetch(`${apiBaseUrl}/api/Progress/${progressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) throw new Error('Không thể lưu ghi chú');

      setSavedNotes(updatedNotes);
      setIsNotePopupOpen(false);
      setNoteContent('');
      toast.success('Ghi chú đã được lưu thành công.');
    } catch (err) {
      console.error('Lỗi khi lưu ghi chú:', err);
      toast.error('Không thể lưu ghi chú.');
    }
  };

  // Lấy bài học
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId || !userId || !token) {
        setError('Vui lòng đăng nhập và cung cấp lessonId.');
        setLoading(false);
        return;
      }

      try {
        const lessonResponse = await getLessonById(lessonId);
        if (!lessonResponse) throw new Error('Không có dữ liệu bài học');
        setCurrentLesson(lessonResponse);

        const videoId = extractVideoId(lessonResponse.videoUrl);
        if (videoId) {
          const youtubeResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
          );
          const youtubeData = await youtubeResponse.json();
          if (youtubeData.items?.length > 0) {
            const duration = youtubeData.items[0].contentDetails.duration;
            setCurrentLesson(prev => ({ ...prev, duration }));
          }
        }

        if (lessonResponse.courseId) {
          const lessonsResponse = await getLessonsByCourseId(lessonResponse.courseId);
          if (!Array.isArray(lessonsResponse)) throw new Error('Dữ liệu bài học không hợp lệ');
          setSections([{ title: 'Danh sách bài học', lessons: lessonsResponse }]);

          const progressResponse = await fetch(
              `${apiBaseUrl}/api/Progress/course/${lessonResponse.courseId}/user/${userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
          );

          if (progressResponse.status === 404) {
            setCompletedLessons(0);
          } else if (!progressResponse.ok) {
            throw new Error('Không thể lấy tiến độ khóa học');
          } else {
            const progresses = await progressResponse.json();
            const completed = progresses.filter(p => p.status === 'completed' || p.completionPercentage === 100).length;
            setCompletedLessons(completed);
          }
        }

        await initializeProgress();
      } catch (err) {
        console.error('Lỗi khi lấy bài học:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải bài học.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId, userId, token]);

  // Định dạng ngày
  const formatDate = (isoString) => {
    return isoString ? new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) : 'Không rõ ngày';
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const totalLessons = sections[0]?.lessons.length || 0;
  const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const videoId = extractVideoId(currentLesson?.videoUrl);

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
                  <p>Không có video để hiển thị.</p>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 py-6 px-8">
              <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
              <div className="flex items-center text-gray-500 mb-6">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm mr-3">{formatDate(currentLesson?.createdAt)}</span>
                {currentLesson?.duration && (
                    <span className="text-sm">Độ dài: {formatDuration(currentLesson.duration)}</span>
                )}
              </div>
              <p>{currentLesson?.content || 'Không có mô tả.'}</p>
              <button onClick={handleOpenNotePopup} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Lưu ghi chú
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 bg-gray-100 z-10 pb-2">Nội dung khóa học</h2>
            {sections.map((section, index) => (
                <div key={index} className="mb-3">
                  <div
                      className="flex justify-between items-center p-3 bg-gray-200 rounded-lg cursor-pointer"
                      onClick={() => setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))}
                  >
                    <span className="font-bold">{section.title}</span>
                    {openSections[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {openSections[index] && (
                      <ul className="mt-2">
                        {section.lessons.map(lesson => (
                            <li
                                key={lesson.id}
                                className={`p-3 rounded-lg cursor-pointer ${lessonId === lesson.id.toString() ? 'bg-red-100' : ''}`}
                                onClick={() => navigate(`/detailsPageCourse/${lesson.id}`)}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm">{lesson.title}</span>
                                <span className="text-xs text-gray-500 flex items-center">
                          <FaPlayCircle className="mr-2 text-xs" />
                          <span>{formatDate(lesson.createdAt)}</span>
                        </span>
                              </div>
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
            ))}
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
                    className="w-full p-2 border rounded-lg mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsNotePopupOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                    Hủy bỏ
                  </button>
                  <button onClick={handleSaveNote} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Tạo ghi chú
                  </button>
                </div>
              </div>
            </div>
        )}

        {isViewNotesPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-2">Ghi chú - {currentLesson?.title}</h2>
                <p className="text-sm whitespace-pre-wrap">{savedNotes}</p>
                <button
                    onClick={() => setIsViewNotesPopupOpen(false)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
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