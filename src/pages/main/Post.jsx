import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaginatedPosts } from '../../api/postApi';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumberFromUrl = parseInt(searchParams.get("page") || 1, 10);
  const postsSectionRef = useRef(null);

  // Khởi tạo trang hiện tại từ URL
  useEffect(() => {
    const initialPage = pageNumberFromUrl >= 1 ? pageNumberFromUrl : 1;
    setCurrentPage(initialPage);
  }, [pageNumberFromUrl]);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getPaginatedPosts(page, pageSize);
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        setFilteredPosts(response.data.data);
        setTotalPages(response.data.totalPages || 1);

        // Trích xuất các thẻ duy nhất
        const tagsSet = new Set();
        response.data.data.forEach((post) => {
          if (post.tags && post.tags.trim() !== '') {
            post.tags.split(',').forEach((tag) => tagsSet.add(tag.trim()));
          }
        });
        setAvailableTags([...tagsSet]);
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
    fetchPosts(currentPage);
  }, [currentPage]);

  // Lọc 
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.tags &&
        post.tags
          .split(',')
          .some((tag) => selectedTags.includes(tag.trim()))
      );
      setFilteredPosts(filtered);
    }
  }, [selectedTags, posts]);

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ page: page });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchParams({ page: currentPage + 1 });
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );

    if (postsSectionRef.current) {
      postsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Tags Filter */}
        <div className="md:hidden mb-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
            <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">Lọc theo thẻ</h4>
            <div className="grid grid-cols-2 gap-3">
              {availableTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedTags.includes(tag)
                    ? 'bg-red-500 text-white'
                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800'
                    } transition-colors`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h1
          className="text-4xl font-bold text-green-600 mb-8"
          ref={postsSectionRef}
        >
          Bài viết nổi bật
        </h1>

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
              {filteredPosts.length > 0 ? (
                <>
                  {filteredPosts.map((post) => (
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
                  ))}
                  {/* Thanh phân trang */}
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg font-medium ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg font-medium ${currentPage === page
                          ? 'bg-red-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg font-medium ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                      Sau
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <p className="text-xl">Không tìm thấy bài viết nào phù hợp.</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                {/* Tags Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                  <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
                    Lọc theo thẻ
                  </h4>
                  <div className="space-y-2">
                    {availableTags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => toggleTag(tag)}
                        className={`w-full px-4 py-2 text-left rounded-lg text-sm font-medium ${selectedTags.includes(tag)
                          ? 'bg-red-500 text-white'
                          : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800'
                          } transition-colors`}
                      >
                        {tag}
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