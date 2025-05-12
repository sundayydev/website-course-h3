import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPost } from '../../api/postApi';

const Post = () => {
  const topics = ['Front-end / Mobile apps', 'Back-end / Devops', 'UI / UX / Design', 'Others'];
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Thêm state lỗi
  const navigate = useNavigate();

  // Hàm lấy bài viết từ API
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
  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  // Gọi hàm fetchPosts khi component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full lg:h-auto h-full flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-2 ">
        {/* Sidebar trên Mobile */}
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
          <p>Đang tải bài viết...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p> // Hiển thị lỗi nếu có
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Danh sách bài viết (Chiếm 2 cột) */}
            <div className="md:col-span-2 space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg shadow-sm flex flex-col gap-4"
                    onClick={() => navigate(`/detailspost/${post.id}`)}
                  >
                    {/* Hàng chứa ảnh tác giả + tên */}
                    <div className="flex items-center gap-3">
                      {/* Ảnh tác giả */}
                      <img
                        src={post.user?.profileImage || 'default-avatar.jpg'}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {/* Tên tác giả */}
                      <p className="font-semibold">{post.user?.fullName || 'Ẩn danh'}</p>
                    </div>

                    {/* Tiêu đề, nội dung & ảnh bài viết cùng hàng */}
                    <div className="flex gap-4 items-start">
                      {/* Nội dung bên trái */}
                      <div className="flex-1 flex flex-col gap-2">
                        <h3 className="font-bold text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      </div>

                      {/* Ảnh bài viết bên phải */}
                      <img
                        src={import.meta.env.VITE_API_URL+`/${post.urlImage}`}
                        alt="Ảnh bài viết"
                        className="w-[200px] h-[20px] md:w-40 md:h-28 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex justify-start items-center text-xs text-gray-500 gap-x-2">
                      {/* Tag của bài viết */}
                      {post.tags && post.tags.trim() !== '' && (
                        <span
                          className="border border-blue-600 text-blue-600 text-xs font-semibold px-3 rounded-full 
                             transition duration-300 hover:bg-blue-600 hover:text-white cursor-pointer flex-shrink-0"
                        >
                          {post.tags.trim()}
                        </span>
                      )}
                      {/* Ngày tạo bài viết */}
                      <p className="text-gray-500 text-sm">
                        {isValidDate(post.createdAt)
                            ? new Date(post.createdAt).toLocaleDateString()
                            : 'Không rõ thời gian'}
                      </p>

                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Không có bài viết nào.</p>
              )}
            </div>

            {/* Bên phải: Card Quảng cáo (Chiếm 1 cột) */}
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
