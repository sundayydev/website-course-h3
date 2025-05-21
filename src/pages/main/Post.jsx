import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPost } from '../../api/postApi';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';
// Định nghĩa topics
const topics = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await getAllPost();
      console.log('Posts Data:', response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPosts(response.data);
      } else {
        setError('Không có bài viết nào.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
      setError(`Có lỗi xảy ra khi tải bài viết: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full lg:h-auto h-full flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-2">
        <div className="md:hidden mb-4">
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h4 className="font-semibold mb-4">XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h4>
            <div className="space-y-2">
              {topics.map((topic, index) => (
                <button
                  key={index}
                  className="block px-4 py-2 bg-gray-200 rounded-full text-sm w-full text-left"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="font-bold text-3xl text-red-600 mb-10">Bài viết nổi bật</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <HashLoader color="#a858a7" size={45} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2 space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg shadow-sm flex flex-col gap-4 cursor-pointer"
                    onClick={() => navigate(`/detailspost/${post.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={post.user.profileImage ? `${post.user.profileImage}` : defaultAvatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => (e.target.src = defaultAvatar)}
                      />
                      <p className="font-semibold">{post.user?.fullName || 'Ẩn danh'}</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 flex flex-col gap-2">
                        <h3 className="font-bold text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      </div>
                      <img
                        src={post.urlImage ? `${post.urlImage}` : defaultAvatar}
                        alt="Ảnh bài viết"
                        className="w-[200px] h-[120px] md:w-40 md:h-28 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                      {post.tags && post.tags.trim() !== '' && (
                        <>
                          {post.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                          <span className="text-gray-500">•</span>
                        </>
                      )}
                      <p>{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Không có bài viết nào.</p>
              )}
            </div>

            <div className="hidden md:block ml-16">
              <div className="sticky top-20 w-72 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                <h4 className="font-bold text-lg text-center">Khóa học HTML CSS PRO</h4>
                <ul className="text-sm text-left space-y-2 mt-2">
                  <li>✔ Thực hành 8 dự án</li>
                  <li>✔ Hơn 300 bài tập thử thách</li>
                  <li>✔ Tặng ứng dụng Flashcards</li>
                  <li>✔ Tặng 3 Games luyện HTML CSS</li>
                  <li>✔ Tặng 20+ thiết kế trên Figma</li>
                </ul>
                <button className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-full font-semibold">
                  Tìm hiểu thêm →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;