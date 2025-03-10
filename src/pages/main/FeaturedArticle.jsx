import React from 'react';
import {FaRegComment, FaRegHeart} from "react-icons/fa";

const article = {
    title: "Tổng hợp các sản phẩm tán gái của học viên tại H3 👏👏",
    author: {
        name: "Duy hoàng",
        avatar: "https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2k4.jpg",
        time: "3 năm trước",
        readTime: "6 phút đọc",
        tagline: "Stop thinking, start doing!",
        likes: 1087,
        comments: 45
    },
    content: `Bài viết này nhằm tổng hợp lại các cách tán tỉnh mà học viên H3 đã hoàn thành và chia sẻ trên nhóm` ,
    linkText: "Học lập trình web H3",
    link: "https://www.facebook.com/hoanggcute.1402",
    moreProjects: "Xem thêm hàng trăm dự án khác do học viên tại H3 tán tỉnh.",
    project: {
        title: "MANCHESTER UNITED",
        image: "https://mega.com.vn/media/news/0206_hinh-nen-MU-may-tinh4.jpg"
    }
};

const FeaturedArticle = () => {
    return (
        <div className="max-w-6xl mx-auto py-8 grid grid-cols-4 gap-8 mt-16">
            {/* Left Section */}
            <div className="col-span-1 text-gray-700">
                <h3 className="font-bold text-lg">{article.author.name}</h3>
                <p className="text-sm mb-2">{article.author.tagline}</p>
                <hr className="mb-2" />
                <div className="flex items-center text-sm">
                    <span className="mr-4 flex items-center gap-1"><FaRegHeart  />{article.author.likes}</span>
                    <span className="flex items-center gap-1"><FaRegComment /> {article.author.comments}</span>
                </div>
            </div>

            {/* Right Section */}
            <div className="col-span-3">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <div className="flex items-center mb-4">
                    <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                        <span className="font-semibold">{article.author.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{article.author.time} · {article.author.readTime}</span>
                    </div>
                </div>
                <p className="text-gray-700 mb-4">
                    {article.content}
                    <a href={article.link} className="text-red-500"> {article.linkText}</a>. Các dự án dưới đây được mình ngẫu nhiên lựa chọn để đăng chứ không mang tính xếp hạng các bạn nhé.
                </p>
                <a href={article.link} className="text-red-500 font-semibold underline">
                    {article.moreProjects}
                </a>
                <div className="mt-8">
                    <hr className="mb-4" />
                    <h2 className="text-2xl font-bold">{article.project.title}</h2>
                    <img
                        src={article.project.image}
                        alt={article.project.title}
                        className="w-full rounded-lg mt-4"
                    />
                </div>
            </div>
        </div>
    );
};

export default FeaturedArticle;
