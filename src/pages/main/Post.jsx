import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPost } from '../../api/postApi';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';

const topics = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP'];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Topics */}
        <div className="md:hidden mb-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
            <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">Chủ đề nổi bật</h4>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((topic, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-green-600 mb-8">Bài viết nổi bật</h1>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <HashLoader color="#16a34a" size={50} />
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/detailspost/${post.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={post.user.profileImage || defaultAvatar}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => (e.target.src = defaultAvatar)}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {post.user?.fullName || 'Ẩn danh'}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-green-600 transition-colors line-clamp-2 h-[3.5rem]">
                            {post.title}
                          </h3>
                          {post.tags && post.tags.trim() !== '' && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags.split(',').map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-full text-sm font-medium"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <img
                          src={post.urlImage || defaultAvatar}
                          alt="Ảnh bài viết"
                          className="w-52 h-24 rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <p className="text-xl">Chưa có bài viết nào.</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                {/* Topics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                  <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
                    Chủ đề nổi bật
                  </h4>
                  <div className="space-y-2">
                    {topics.map((topic, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Promotion */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-6 text-white">
                  <h4 className="font-bold text-xl mb-4 text-center">Khóa học HTML CSS PRO</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <span className="text-green-200">✦</span>
                      <span>Thực hành 8 dự án thực tế</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-200">✦</span>
                      <span>Hơn 300 bài tập thử thách</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-200">✦</span>
                      <span>Tặng ứng dụng Flashcards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-200">✦</span>
                      <span>Tặng 3 Games luyện HTML CSS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-200">✦</span>
                      <span>Tặng 20+ thiết kế trên Figma</span>
                    </li>
                  </ul>
                  <button className="mt-6 w-full px-6 py-3 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition-colors">
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
