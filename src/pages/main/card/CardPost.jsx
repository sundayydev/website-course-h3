/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPost } from '@/api/postApi';
import defaultAvatar from '@/assets/imgs/default-avatar.jpg';
import { formatDate } from '@/utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';
import { FaBookOpen } from 'react-icons/fa';

const CardPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost();
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Sắp xếp bài viết theo ngày tạo giảm dần và lấy 5 bài mới nhất
          const sortedPosts = response.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setPosts(sortedPosts);
        }
      } catch (error) {
        toast.error('Lỗi khi lấy bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaBookOpen className="text-gray-600 text-xl" />
          Bài viết
        </h2>
        <button
          onClick={() => navigate('/post')}
          className="flex items-center gap-1 text-green-600 hover:text-red-600 hover:underline font-medium text-base transition-colors"
        >
          Xem tất cả <span>&gt;</span>
        </button>
      </div>
      <div className="flex flex-wrap justify-start gap-5">
        {posts.map((post, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg overflow-hidden bg-white w-full md:w-1/3 lg:w-[335px] 
              transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
            onClick={() => navigate(`/detailspost/${post.id}`)}
          >
            <div className="flex-grow">
              <img
                src={`${post.urlImage}`}
                className="w-full h-32 object-cover rounded-t-2xl"
              />
            </div>
            <div className="bg-gray-50 text-black p-4">
              <h3 className="text-lg font-semibold mb-2 min-h-[3rem] line-clamp-2 overflow-hidden text-ellipsis">
                {post.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <img
                    src={`${post.user.profileImage}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => (e.target.src = defaultAvatar)}
                  />
                  <p className="font-semibold text-sm">{post.user?.fullName || 'Ẩn danh'}</p>
                </div>
                <p>{formatDate(post.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPost;