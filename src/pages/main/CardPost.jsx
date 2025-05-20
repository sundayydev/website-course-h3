/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPost } from '../../api/postApi';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';

const CardPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost();
        if (Array.isArray(response.data) && response.data.length > 0) {
          setPosts(response.data);
        }
      } catch (error) {
        toast.error('Lỗi khi lấy bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Đang tải bài viết...</p>;

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-3xl font-bold text-left mb-8">Bài viết nổi bật</h1>
      <div className="flex flex-wrap justify-start gap-10">
        {posts.map((post, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg overflow-hidden bg-white w-full md:w-1/3 lg:w-[325px] 
              transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
            onClick={() => navigate(`/detailspost/${post.id}`)}
          >
            <div className="flex-grow">
              <img
                src={`${post.urlImage}`}
                className="w-full h-40 object-cover rounded-t-2xl"
              />
            </div>
            <div className="bg-gray-50 text-black p-4">
              <h3 className="text-lg font-semibold mb-2 min-h-[3rem]">{post.title}</h3>
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
