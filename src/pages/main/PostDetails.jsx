/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, getAllPost } from '../../api/postApi';
import CommentPost from './Comment';
import { formatDate } from '../../utils/formatDate';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import MarkdownContent from '@/components/MarkdownContent';
import HashLoader from 'react-spinners/HashLoader';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await getPostById(id);
        setPost(response.data);

        // Fetch related posts
        const allPosts = await getAllPost();
        const filtered = allPosts.data
          .filter(
            (p) =>
              p.id !== id &&
              p.tags &&
              post?.tags &&
              p.tags.split(',').some((tag) => post.tags.split(',').includes(tag))
          )
          .slice(0, 3);
        setRelatedPosts(filtered);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <HashLoader color="#16a34a" size={50} />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <p className="text-yellow-700">Không tìm thấy bài viết.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="border-b dark:border-gray-700 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
            <div className="flex items-center space-x-4">
              <img
                src={post.user?.profileImage || ' '}
                alt={post.user?.fullName || 'Tác giả'}
                className="w-14 h-14 rounded-full border-2 border-green-200"
                onError={(e) => (e.target.src = defaultAvatar)}
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.user?.fullName || 'Tác giả ẩn danh'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.urlImage && (
            <div className="mb-8">
              <img
                src={`${post.urlImage}`}
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-green max-w-none dark:prose-invert mb-8">
            <MarkdownContent content={post.content} />
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-8">
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

          {/* Comments Section */}
          <div className="border-t dark:border-gray-700 pt-8">
            <CommentPost postId={id} />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t dark:border-gray-700 mt-8 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/detailspost/${relatedPost.id}`)}
                  >
                    {relatedPost.urlImage && (
                      <img
                        src={relatedPost.urlImage}
                        alt={relatedPost.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(relatedPost.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
