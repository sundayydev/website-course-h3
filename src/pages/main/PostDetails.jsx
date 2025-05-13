/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../api/postApi';
import CommentPost from './Comment';

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
    <div className="w-full lg:h-auto h-full flex flex-col py-20 bg-gray-50 dark:bg-gray-900 p-10">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={import.meta.env.VITE_API_URL + post.user?.profileImage || ' '}
          alt={post.user?.fullName || 'Tác giả'}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold">{post.user?.fullName || 'Tác giả ẩn danh'}</p>
          <p className="text-gray-500 text-sm">
            {post.createdAt ? new Date(post.createdAt).toLocaleString('vi-VN') : 'Không rõ thời gian'}
          </p>
        </div>
      </div>
      {post.urlImage && (
        <img
          src={import.meta.env.VITE_API_URL + `${post.urlImage}`}
          alt={post.title}
          className="w-full h-full object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-gray-700 leading-relaxed mb-4">{post.content || 'Không có nội dung.'}</p>
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
      <CommentPost postId={id} />
    </div>
  );
};

export default PostDetails;