import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Plus, Minus, X } from 'lucide-react';
import { LuCheck } from 'react-icons/lu';
import {IoIosSpeedometer} from "react-icons/io";
import {MdLocalMovies, MdOutlineAccessTimeFilled} from "react-icons/md";
import {FaBatteryFull, FaPlayCircle, FaQuestionCircle} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Details = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseTitle = queryParams.get("title");
    
    const [expanded, setExpanded] = useState(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    
    const videoId = "s92ZomhqAsY";

    const learningOutcomes = [
        'Được học kiến thức miễn phí với nội dung chất lượng hơn mất phí',
        'Hiểu được cách tư duy nâng cao của các lập trình viên có kinh nghiệm',
        'Có nền tảng Javascript vững chắc để làm việc với mọi thư viện, framework viết bởi Javascript',
        'Các kiến thức nâng cao của Javascript giúp code trở nên tối ưu hơn',
        'Hiểu được các khái niệm khó như từ khóa this, phương thức bind, call, apply & xử lý bất đồng bộ',
        'Nâng cao cơ hội thành công khi phỏng vấn xin việc nhờ kiến thức chuyên môn vững chắc',
    ];
    const requestContent=[
         'Hoàn thành khóa học tán cơ bản tại h3 hoặc đã nắm chắc tán gái cơ bản',
         'Ý thức cao, trách nhiệm cao trong việc tự học. Thực hành lại sau mỗi bài học',
         'Bạn không cần biết gì hơn nữa, trong khóa học tôi sẽ chỉ cho bạn những gì bạn cần phải biết',
    ];

    const courseContent = [
        {
            title: 'Girl Best Friend',
            lessons: 10,
            subLessons: [
                { title: 'Giới thiệu', duration: '01:48', icon: FaPlayCircle },
                { title: 'Gái gú là gì?', duration: '23:57', icon: FaPlayCircle },
                { title: 'Ôn tập về gái chưa iu ai #1', duration: '00:35', icon: FaQuestionCircle },
                { title: 'Ôn tập về gái đã có người iu', duration: '01:09', icon: FaQuestionCircle },
            ]
        }
    ];

    const courseDetails = [
        { icon: IoIosSpeedometer, text: 'Trình độ trung bình' },
        { icon: MdLocalMovies, text: 'Tổng số 29 bài học' },
        { icon: MdOutlineAccessTimeFilled , text: 'Thời lượng 09 giờ 00 phút' },
        { icon: FaBatteryFull  ,text: 'Học mọi lúc, mọi nơi' },
    ];

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const openVideoModal = () => {
        setVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setVideoModalOpen(false);
    };
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 bg-gray-50 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold">Lập Trình JavaScript Nâng Cao</h1>
                <p className="text-gray-600 text-sm mt-2">
                    Hiểu sâu hơn về cách Javascript hoạt động, tìm hiểu về IIFE, closure, reference types, this keyword, bind, call, apply, prototype, ...
                </p>

                <h2 className="text-2xl  font-bold mt-8 ">Bạn sẽ học được gì?</h2>
                <div className="list-none text-sm space-y-3 mt-4">
                    {learningOutcomes.map((item, index) => (
                        <p key={index} className="flex items-center space-x-3">
                            <LuCheck className="text-pink-500" />
                            <span >{item}</span>
                        </p>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mt-8">Nội dung khóa học</h2>
                <ul className="list-none space-y-2 mt-4 w-full">
                    {courseContent.map(({ title, lessons, subLessons }, index) => (
                        <div key={index} className="overflow-hidden w-full">
                            <div
                                className={`bg-gray-100 p-2 cursor-pointer flex justify-between items-center w-full h-14 ${
                                    expanded === index ? 'rounded-t-2xl' : 'rounded-2xl'
                                }`}
                                onClick={() => toggleExpand(index)}
                            >
                                <div className="flex items-center space-x-2">
                                    {expanded === index ? <Minus className="text-pink-500" size={16} /> : <Plus className="text-pink-500" size={16} />}
                                    <span className="text-sm font-bold">{index + 1}. {title}</span>
                                </div>
                                <span className="text-gray-500 text-sm mr-4">{lessons} bài học</span>
                            </div>
                            {expanded === index && subLessons && (
                                <div className="bg-white p-3 border-x border-b rounded-b-2xl w-full">
                                    <ul className="space-y-1 pl-4">
                                        {subLessons.map((lesson, idx) => (
                                            <li key={idx} className="flex items-center justify-between text-gray-600 text-sm py-1">
                                                <div className="flex items-center gap-2">
                                                    {lesson.icon && (
                                                        <lesson.icon
                                                            className={`${
                                                                lesson.icon === FaPlayCircle ? "text-pink-500" : "text-pink-300"
                                                            }`}
                                                            size={14}
                                                        />
                                                    )}
                                                    <span>{idx + 1}. {lesson.title}</span>
                                                </div>
                                                <span className="text-gray-500 text-xs">{lesson.duration}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </ul>
                <h2 className="text-2xl  font-bold mt-8 ">Yêu Cầu</h2>
                <div className="list-none text-sm space-y-3 mt-4">
                    {requestContent.map((item, index) => (
                        <p key={index} className="flex items-center space-x-3">
                            <LuCheck className="text-pink-500" />
                            <span >{item}</span>
                        </p>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center">
                {/* Video thumbnail with play button */}
                <div
                    className="relative rounded-2xl w-full h-64 flex justify-center items-center text-white cursor-pointer overflow-hidden group"
                    onClick={openVideoModal}
                    style={{ backgroundImage: 'url(https://hinhneniphone.net/wp-content/uploads/2024/12/anh-gai-xinh-cute.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <PlayCircle size={48} className="z-10 transform group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute bottom-4 text-white font-medium">Xem video giới thiệu</span>
                </div>

                <h3 className="text-3xl text-pink-400 mt-4">Miễn phí</h3>
                <Button className="mt-5 w-64 bg-pink-600 text-white rounded-2xl shadow-lg hover:bg-gray-600" onClick={() => navigate('/detailsPageCourse')}>Đăng ký học</Button>


                <div className="flex flex-col items-center">
                    <ul className="mt-6 flex flex-col gap-4 text-gray-600">
                        {courseDetails.map((detail, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {detail.icon && <detail.icon className="w-5 h-5" />} {/* Đảm bảo icon có kích thước phù hợp */}
                                <span>{detail.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {videoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg w-full max-w-4xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold">Video Giới Thiệu Khóa Học Xem Gái</h3>
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
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Course Introduction Video"
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
