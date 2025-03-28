import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = 'http://localhost:5221/';
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/Post/${id}`);

        if (!response.ok) {
          throw new Error('Bài viết không tồn tại!');
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Đang tải bài viết...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center text-red-500">Không tìm thấy bài viết.</p>;

  return (
    <div className="w-full lg:h-auto h-full flex flex-col  py-20 bg-gray-50 dark:bg-gray-900 p-10">
      {/* Tiêu đề bài viết */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* Thông tin tác giả */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={`http://localhost:5221/${post.user.urlImage}`}
          alt={post.user?.fullName || 'Tác giả'}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold">{post.user?.fullName || 'Tác giả ẩn danh'}</p>
          <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Hình ảnh chính của bài viết */}
      {post.urlImage && (
        <img
          src={url + `${post.urlImage}`}
          alt={post.title}
          className="w-full h-full object-cover rounded-lg mb-4"
        />
      )}

      {/* Nội dung bài viết */}
      <p className="text-gray-700 leading-relaxed mb-4">{post.content || 'Không có nội dung.'}</p>

      {/* Hiển thị thẻ (Tags) */}
      {post.tags && (
        <div className="mt-4">
          <strong>Tags:</strong>{' '}
          {post.tags.split(',').map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm mx-1"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
