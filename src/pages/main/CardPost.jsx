import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CardPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/Post');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Đang tải bài viết...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-left mb-8">Bài viết nổi bật</h1>
      <div className="flex flex-wrap justify-start gap-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg overflow-hidden bg-white w-full md:w-1/3 lg:w-[275px] 
              transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer"
            onClick={() => navigate(`/detailspost/${post.id}`)}
          >
            <div className="flex-grow">
              <img
                src={`http://localhost:5221/${post.urlImage}`}
                className="w-full h-40 object-cover rounded-t-2xl"
              />
            </div>
            <div className="bg-gray-50 text-black p-4">
              {/* Tiêu đề bài viết */}
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>

              {/* Thời gian đăng & Tên tác giả */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <img
                    src={post.user?.profileImage || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="font-semibold text-sm">{post.user?.fullName || 'Ẩn danh'}</p>
                </div>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPost;
