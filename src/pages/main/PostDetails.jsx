/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../api/postApi';
import CommentPost from './Comment';
import { formatDate } from '../../utils/formatDate';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import MarkdownContent from '@/components/MarkdownContent';
import { Link } from 'react-router-dom';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await getPostById(id);
        setPost(response.data);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải bài viết.');
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
    <div className="w-full max-w-3xl mx-auto flex flex-col py-6 px-4 bg-white dark:bg-gray-900 mt-20">
      {/* Tiêu đề bài viết */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 mb-5">
        {post.title}
      </h1>
      {/* Thông tin người dùng và thời gian */}
      <div className="flex items-center justify-between mb-4 mt-5">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.userId}`}>
            <img
              src={post.user?.profileImage || defaultAvatar}
              alt={post.user?.fullName || 'Tác giả'}
              className="w-10 h-10 rounded-full"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          </Link>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {post.user?.fullName || 'Tác giả ẩn danh'}
            </p>
            <p className="text-gray-500 text-sm">
              {formatDate(post.createdAt)} • {Math.floor(Math.random() * 10) + 1} phút đọc
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>



      {/* Lượt thích và bình luận */}


      {/* Hình ảnh bài viết */}
      {post.urlImage && (
        <img
          src={post.urlImage}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-6"
        />
      )}

      {/* Nội dung bài viết */}
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        <MarkdownContent content={post.content} />
      </div>

      {/* Tags */}
      {post.tags && (
        <div className="mb-6">
          <strong className="text-gray-900 dark:text-gray-100">Tags:</strong>{' '}
          {post.tags.split(',').map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mx-1"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Phần bình luận */}
      <CommentPost postId={id} />
    </div>
  );
};

export default PostDetails;