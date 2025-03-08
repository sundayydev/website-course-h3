import { useState } from 'react';
import {
    Play,
    ArrowRight,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    BookOpen,
    HelpCircle,
    ArrowLeft,
    Clock,
    Calendar,
    X, Bold, Italic, List, ListOrdered
} from 'lucide-react';

import {FaPlayCircle} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const DetailsPageCourse = () => {
    const [activeLesson, setActiveLesson] = useState(1);
    const [openSections, setOpenSections] = useState({ 0: true });
    const [progress, setProgress] = useState(8);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteTime, setNoteTime] = useState('00:00');
    const [noteContent, setNoteContent] = useState('');
    const [notes, setNotes] = useState([]);
    const saveNote = () => {
        const newNote = {
            id: Date.now(),
            time: noteTime,
            content: noteContent,
            lessonId: activeLesson
        };
        setNotes([...notes, newNote]);
        setShowNoteModal(false);
    };
    const [showNotesPage, setShowNotesPage] = useState(false);
    const [notesPageVisible, setNotesPageVisible] = useState(false);

    // Hàm mở modal thêm ghi chú
    const openNoteModal = () => {
        setNoteTime('00:00'); // Hoặc thời gian hiện tại của video
        setNoteContent('');
        setShowNoteModal(true);
    };


    const openNotesPage = () => {
        setShowNotesPage(true);
    
        setTimeout(() => {
            setNotesPageVisible(true);
        }, 60);
    };


    const closeNotesPage = () => {
        setNotesPageVisible(false);
        setTimeout(() => {
            setShowNotesPage(false);
        }, 800); 
    };

    const totalLessons = 12;
    const completedLessons = Math.round((progress * totalLessons) / 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleNextLesson = () => {
        const allLessons = sections.flatMap(section => section.lessons);
        const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson);

        if (currentIndex < allLessons.length - 1) {
            const nextLesson = allLessons[currentIndex + 1];
            if (!nextLesson.locked) {
                setActiveLesson(nextLesson.id);
                setProgress(prev => Math.min(prev + 8, 100));
            }
        }
    };

    const handlePreviousLesson = () => {
        const allLessons = sections.flatMap(section => section.lessons);
        const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson);

        if (currentIndex > 0) {
            const prevLesson = allLessons[currentIndex - 1];
            setActiveLesson(prevLesson.id);
        }
    };

    const togglePlayVideo = () => {
        setIsPlaying(!isPlaying);
    };
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Khái niệm kỹ thuật cần biết',
            lessons: [
                { id: 1, title: 'Mô hình Client - Server là gì?', duration: '11:35', youtubeId: 't09bVi0LvSg',
                    description: 'Buy tickets modal Javascript logic',
                    updateDate: 'Cập nhật tháng 9 năm 2022',
                    notes: 'Nếu các bạn thấy phần bài tập trong bài học này là Javascript thì là đúng của hệ thống nhé. Để xử lý trong thời gian tới, các bạn vui lòng quá qua bài tập này. Cảm ơn các bạn 🙂🙂' },
                { id: 2, title: 'Domain là gì? Tên miền là gì?', duration: '10:34', youtubeId: 'rd7HVevuIwU', locked:false,
                    description: 'Domain và các khái niệm liên quan',
                    updateDate: 'Cập nhật tháng 10 năm 2022',
                    notes: 'Kiến thức cơ bản về tên miền, cách hoạt động của tên miền.' },
                { id: 3, title: 'Mua áo F8 | Đăng ký học Offline', duration: '01:00', youtubeId: 'lcIIIh8lsZs', locked: false,
                    description: 'Thông tin đăng ký khóa học Offline',
                    updateDate: 'Cập nhật tháng 11 năm 2022',
                    notes: 'Thông tin về khóa học Offline và cách đăng ký tham gia.' },
            ],
        },
        {
            title: 'Môi trường, con người IT',
            lessons: [
                { id: 4, title: 'Giới thiệu môi trường IT', duration: '46:14', youtubeId: 'mPZkdNFkNps',
                    description: 'Tổng quan về môi trường làm việc IT',
                    updateDate: 'Cập nhật tháng 12 năm 2022',
                    notes: 'Bài học giới thiệu tổng quan về ngành IT, môi trường làm việc và các vị trí công việc phổ biến.' },
            ],
        },
    ];

    const currentLesson = sections
        .flatMap(section => section.lessons)
        .find(lesson => lesson.id === activeLesson);

    const allLessons = sections.flatMap(section => section.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allLessons.length - 1 && !allLessons[currentIndex + 1].locked;

    const previousLesson = hasPrevious ? allLessons[currentIndex - 1] : null;
    const nextLesson = hasNext ? allLessons[currentIndex + 1] : null;

    return (
        <div className="flex flex-col h-screen overflow-hidden ">
            {/* Header */}
            <div className="bg-gray-800 text-white flex items-center justify-between p-4 h-[50px]">
                <div className="flex items-center">
                    <ArrowLeft  size={24} className="mr-3 cursor-pointer" onClick={() => navigate('/details')} />
                    <div className="bg-pink-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">H3</div>
                    <span className="ml-3 font-semibold">Kiến Thức Nhập Môn IT</span>
                </div>
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="4" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke={progress > 0 ? "#fd03f2" : "#da03ce"}
                                    strokeWidth="4"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <span className="text-white text-sm font-semibold">{progress}%</span>
                        </div>
                        <span className="text-white font-semibold">{completedLessons}/{totalLessons}</span>
                        <span>bài học</span>
                    </div>
                    <div className="flex items-center space-x-1 cursor-pointer " onClick={openNotesPage}>
                        <BookOpen size={18} />
                        <span>Ghi chú</span>
                    </div>
                    <div className="flex items-center space-x-1 cursor-pointer">
                        <HelpCircle size={18} />
                        <span>Hướng dẫn</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left side: Video player and description */}
                <div className="flex-[3] overflow-y-auto">
                    {/* Video Player */}
                    <div className="bg-black flex items-center justify-center min-h-[500px] relative">
                        {isPlaying ? (
                            <div className="w-full" style={{ maxWidth: '1000px', height: '500px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?autoplay=1&rel=0`}
                                    title={currentLesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ overflow: 'hidden' }}
                                ></iframe>
                            </div>
                        ) : (
                            <div className="text-center" style={{ width: '1000px', height: '500px' }}>
                                <div
                                    className="w-full h-full flex flex-col items-center justify-center bg-cover bg-center relative"
                                    style={{
                                        backgroundImage: `url(https://img.youtube.com/vi/${currentLesson.youtubeId}/maxresdefault.jpg)`,
                                        backgroundSize: 'cover'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                                    <div className="relative z-10">
                                        <h1 className="text-3xl font-bold mb-6 text-white">{currentLesson.title}</h1>
                                        <button
                                            className="bg-orange-500 p-4 rounded-full hover:bg-orange-600 transition-colors"
                                            onClick={togglePlayVideo}
                                        >
                                            <Play size={32} color="white" />
                                        </button>
                                        <p className="text-gray-200 mt-4">Nhấn để xem video bài học</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Description */}
                    <div className="bg-white border-t border-gray-200 py-6 px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Tạo container flex để giữ tiêu đề và nút cùng hàng */}
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold">{currentLesson.description || currentLesson.title}</h2>

                                {/* Nút Thêm ghi chú đặt ở đây để nằm cùng hàng với tiêu đề */}
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none" onClick={openNoteModal}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Thêm ghi chú
                                </button>
                            </div>

                            <div className="flex items-center text-gray-500 mb-6">
                                <div className="flex items-center mr-6">
                                    <Calendar size={16} className="mr-2" />
                                    <span className="text-sm">{currentLesson.updateDate}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2" />
                                    <span className="text-sm">{currentLesson.duration}</span>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <p>{currentLesson.notes}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Course content sidebar */}
                <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
                    <h2 className="text-lg font-bold sticky top-0 bg-gray-100 z-10 pb-2">Nội dung khóa học</h2>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        {sections.map((section, index) => (
                            <div key={index} className="mb-3">
                                <div
                                    className="flex justify-between items-center p-3 bg-gray-200 rounded-lg cursor-pointer"
                                    onClick={() => toggleSection(index)}
                                >
                                    <span className="font-bold">{section.title}</span>
                                    {openSections[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {openSections[index] && (
                                    <ul className="mt-2">
                                        {section.lessons.map((lesson) => (
                                            <li
                                                key={lesson.id}
                                                className={`p-3 rounded-lg cursor-pointer ${activeLesson === lesson.id ? 'bg-red-100' : ''} ${lesson.locked ? 'text-gray-400' : 'text-black'}`}
                                                onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{lesson.title}</span>
                                                    <span className="text-xs text-gray-500 flex items-center">
                                                        <FaPlayCircle className="mr-2 text-xs " />{lesson.duration}</span>
                                                </div>

                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Sidebar */}
            <div className="bg-gray-200 border-t border-gray-300 px-6 py-3 h-[60px] flex items-center justify-between w-full">
                <div className="flex-1 flex justify-center space-x-4">
                    <button
                        className={`flex items-center space-x-2 text-gray-700 ${!hasPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'}`}
                        onClick={handlePreviousLesson}
                        disabled={!hasPrevious}>
                        <ArrowLeft size={20} />
                        <span>BÀI TRƯỚC</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full`}
                        onClick={handleNextLesson}
                        disabled={!hasNext}>
                        <span>BÀI TIẾP THEO</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div
                    className={`flex items-center space-x-2 text-black cursor-pointer hover:text-gray-700 ml-auto`}
                    onClick={handleNextLesson}
                    disabled={!hasNext}>
                    <span>{nextLesson ? nextLesson.title : 'Không có bài tiếp theo'}</span>
                    <ChevronRight size={16} />
                </div>
            </div>
            {/* Modal thêm ghi chú */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Thêm ghi chú tại {noteTime}</h3>
                            <button onClick={() => setShowNoteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="border rounded-md overflow-hidden">
                                <div className="flex items-center border-b p-2">
                                    <select className="bg-transparent border-none outline-none mr-2">
                                        <option>Normal</option>
                                    </select>
                                    <button className="p-1 mx-1"><Bold size={16} /></button>
                                    <button className="p-1 mx-1"><Italic size={16} /></button>
                                    <button className="p-1 mx-1"><List size={16} /></button>
                                    <button className="p-1 mx-1"><ListOrdered size={16} /></button>
                                </div>
                                <textarea
                                    className="w-full p-3 outline-none min-h-[100px]"
                                    placeholder="Nội dung ghi chú..."
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 border rounded-md"
                                onClick={() => setShowNoteModal(false)}
                            >
                                HỦY BỎ
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={saveNote}
                            >
                                TẠO GHI CHÚ
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Trang ghi chú */}
            {showNotesPage && (
                <div
                    className={`fixed inset-y-0 right-0 w-1/2 bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out ${
                        notesPageVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Ghi chú của bạn</h2>
                                <button onClick={closeNotesPage} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {notes.length === 0 ? (
                                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                                    <div className="text-gray-400 mb-4">
                                        <BookOpen size={48} className="mx-auto" />
                                    </div>
                                    <p className="text-gray-500">Bạn chưa có ghi chú nào</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notes.map(note => {
                                        const lesson = sections
                                            .flatMap(section => section.lessons)
                                            .find(lesson => lesson.id === note.lessonId);

                                        return (
                                            <div key={note.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium">{lesson ? lesson.title : 'Bài học không xác định'}</h3>
                                                    <span className="text-sm text-gray-500">{note.time}</span>
                                                </div>
                                                <p>{note.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default DetailsPageCourse;