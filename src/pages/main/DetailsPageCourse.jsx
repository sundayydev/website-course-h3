import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ChevronDown, ChevronUp, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { FaPlayCircle } from 'react-icons/fa';
import { getLessonsByCourseId, getLessonById } from '@/api/lessionApi';

const DetailsPageCourse = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [sections, setSections] = useState([]);
  const [openSections, setOpenSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedLessons, setCompletedLessons] = useState(0);
  const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);

  const [note, setNote] = useState(localStorage.getItem(`note_${lessonId}`) || '');
  const [videoProgress, setVideoProgress] = useState(
    parseFloat(localStorage.getItem(`progress_${lessonId}`)) || 0
  );

  // Lưu tiến độ và ghi chú
  const saveProgress = () => {
    if (videoRef.current) {
      console.log('VideoRef:', videoRef.current); 
      console.log('CurrentTime:', videoRef.current.currentTime); 

      if (!isNaN(videoRef.current.currentTime)) {
        const currentTime = Math.floor(videoRef.current.currentTime);
        const timestamp = `Thời gian: ${Math.floor(currentTime / 60)} phút ${currentTime % 60} giây`;

        const updatedNote = note ? `${note}\n\n${timestamp}` : timestamp;
        setNote(updatedNote);

        localStorage.setItem(`progress_${lessonId}`, currentTime);
        localStorage.setItem(`note_${lessonId}`, updatedNote);

        alert('Tiến độ và ghi chú đã được lưu!');
      } else {
        alert('Lỗi: Giá trị thời gian không hợp lệ!');
      }
    } else {
      alert('Lỗi: Video chưa sẵn sàng!');
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoProgress;
    }
  }, [videoProgress]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const response = await getLessonById(lessonId);
        if (!response) {
          throw new Error('Không có dữ liệu bài học');
        }

        setCurrentLesson(response);
        
        if (response.courseId) {
          const lessonsResponse = await getLessonsByCourseId(response.courseId);
          if (!lessonsResponse || !Array.isArray(lessonsResponse.data)) {
            throw new Error('Dữ liệu bài học không hợp lệ');
          }
          const lessons = lessonsResponse.data;
          setCompletedLessons(lessons.filter((lesson) => lesson.isCompleted).length);
          setSections([{ title: 'Danh sách bài học', lessons }]);
        }

      } catch (err) {
        console.error('Lỗi khi lấy bài học:', err);
        if (err.response?.status === 404) {
          setError('Không tìm thấy bài học này.');
        } else {
          setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const formatDate = (isoString) => {
    if (!isoString) return 'Không rõ ngày';
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
              Đã học: {completedLessons} / {sections[0]?.lessons.length || 0} bài
            </span>
          </div>
          <div className="flex items-center cursor-pointer hover:text-gray-300">
            <FaPlayCircle size={18} className="mr-2 text-gray-400" />
            <span className="text-sm">Hướng dẫn</span>
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-gray-300"
            onClick={() => setIsNotePopupOpen(true)}
          >
            <Clock size={18} className="mr-2 text-blue-400" />
            <span className="text-sm">Ghi chú</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden mt-1">
        <div className="flex-[3] overflow-y-auto">
          <div className="bg-black flex items-center justify-center min-h-[500px] relative">
            <iframe
              ref={videoRef}
              width="1000px"
              height="500px"
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="bg-white border-t border-gray-200 py-6 px-8">
            <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
            <div className="flex items-center text-gray-500 mb-6">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm mr-3">{formatDate(currentLesson.createdAt)}</span>
            </div>
            <p>{currentLesson.content || 'Không có mô tả.'}</p>
            <button
              onClick={saveProgress}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Lưu Tiến Độ
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
          <h2 className="text-lg font-bold sticky top-0 bg-gray-100 z-10 pb-2">
            Nội dung khóa học
          </h2>
          {sections.map((section, index) => (
            <div key={index} className="mb-3">
              <div
                className="flex justify-between items-center p-3 bg-gray-200 rounded-lg cursor-pointer"
                onClick={() => setOpenSections({ ...openSections, [index]: !openSections[index] })}
              >
                <span className="font-bold">{section.title}</span>
                {openSections[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {openSections[index] && (
                <ul className="mt-2">
                  {section.lessons.map((lesson) => (
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
            <h2 className="text-lg font-bold mb-2">Ghi chú</h2>
            <p className="text-sm whitespace-pre-wrap">{note}</p>
            <button
              onClick={() => setIsNotePopupOpen(false)}
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
