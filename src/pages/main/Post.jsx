import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPost } from '../../api/postApi';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';
import { FaBookOpen, FaUser, FaClock, FaTag } from 'react-icons/fa';

const topics = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await getAllPost();
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
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="md:hidden mb-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl">
            <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FaBookOpen className="text-emerald-600" />
              XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((topic, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-emerald-100 dark:bg--900 text-emerald-700 dark:text-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-emerald-600 mb-12 text-center mt-10">Bài viết nổi bật</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <HashLoader color="#9333ea" size={50} />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform"
                    onClick={() => navigate(`/detailspost/${post.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={post.user.profileImage || defaultAvatar}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full object-cover "
                          onError={(e) => (e.target.src = defaultAvatar)}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{post.user?.fullName || 'Ẩn danh'}</p>
                          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex gap-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-white">{post.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{post.content}</p>

                          {post.tags && post.tags.trim() !== '' && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.split(',').map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
                                >
                                  <FaTag className="text-xs" />
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <img
                          src={post.urlImage || defaultAvatar}
                          alt="Ảnh bài viết"
                          className="w-48 h-32 rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-500 dark:text-gray-400">Không có bài viết nào.</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 rounded-xl shadow-xl">
                  <h4 className="font-bold text-xl text-center mb-6">Khóa học HTML CSS PRO</h4>
                  <ul className="space-y-3">
                    {[
                      'Thực hành 8 dự án',
                      'Hơn 300 bài tập thử thách',
                      'Tặng ứng dụng Flashcards',
                      'Tặng 3 Games luyện HTML CSS',
                      'Tặng 20+ thiết kế trên Figma'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-300">✔</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                    Tìm hiểu thêm →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;