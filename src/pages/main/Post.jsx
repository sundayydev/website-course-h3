import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Post = () => {
  const topics = ['Front-end / Mobile apps', 'Back-end / Devops', 'UI / UX / Design', 'Others'];
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/Post');
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

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
                        src={
                          post.user?.profileImage ||
                          'data:image/jpeg;base64,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'
                        }
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
                        src={`http://localhost:5221/${post.urlImage}`}
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
                      <p className="text-xs flex-shrink-0">
                        {new Date(post.createdAt).toLocaleDateString()}
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
