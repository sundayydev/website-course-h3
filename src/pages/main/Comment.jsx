/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getCommentsByPostId, createComment, updateComment, deleteComment } from '../../api/commentApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const CommentPost = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);

  // Xóa state existingComment vì không cần giới hạn một bình luận mỗi người dùng
  // Xóa state replyText vì sẽ được quản lý trong RenderComment

  const authToken = localStorage.getItem('authToken');
  const currentUserId = authToken ? jwtDecode(authToken).id : null;

  useEffect(() => {
    const fetchPostComments = async () => {
      if (!postId) {
        toast.error('Không có ID bài viết!');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const postComments = await getCommentsByPostId(postId);

        if (!Array.isArray(postComments)) {
          setComments([]);
          return;
        }

        const mainComments = postComments.filter(comment => !comment.parentCommentId);
        const commentsWithReplies = mainComments.map(comment => {
          const replies = postComments.filter(reply => reply.parentCommentId === comment.id);
          return { ...comment, replies };
        });

        setComments(commentsWithReplies);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Không thể tải bình luận. Vui lòng thử lại!');
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostComments();
  }, [postId, authToken]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast.error('Bạn cần nhập nội dung bình luận!');
      return;
    }

    setIsSubmitting(true);
    if (!authToken || authToken.split('.').length !== 3) {
      toast.error('Vui lòng đăng nhập để bình luận!');
      setIsSubmitting(false);
      return;
    }

    try {
      const commentData = {
        postId: postId,
        content: commentText,
      };

      // Luôn tạo bình luận mới, không kiểm tra existingComment
      const response = await createComment(commentData);
      setComments(prevComments => [...prevComments, { ...response, replies: [] }]);
      toast.success('Bình luận đã được gửi thành công!');
      setCommentText('');
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi gửi bình luận!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!commentText.trim()) {
      toast.error('Bạn cần nhập nội dung để chỉnh sửa!');
      return;
    }

    setIsSubmitting(true);
    if (!authToken || authToken.split('.').length !== 3) {
      toast.error('Vui lòng đăng nhập để chỉnh sửa!');
      setIsSubmitting(false);
      return;
    }

    try {
      const commentData = {
        postId: postId,
        content: commentText,
      };
      const response = await updateComment(editCommentId, commentData);
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === editCommentId) {
            return { ...response, replies: comment.replies };
          }
          const updatedReplies = (comment.replies || []).map(reply =>
            reply.id === editCommentId ? response : reply
          );
          return { ...comment, replies: updatedReplies };
        })
      );
      toast.success('Bình luận đã được chỉnh sửa thành công!');
      setEditCommentId(null);
      setCommentText('');
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa bình luận:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi chỉnh sửa bình luận!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAllReplyIds = (comment) => {
    const replyIds = [];
    const replies = comment.replies || [];

    for (const reply of replies) {
      replyIds.push(reply.id);
      const nestedReplies = getAllReplyIds(reply);
      replyIds.push(...nestedReplies);
    }

    return replyIds;
  };

  const handleDeleteComment = async (commentId) => {
    setIsSubmitting(true);
    if (!authToken || authToken.split('.').length !== 3) {
      toast.error('Vui lòng đăng nhập để xóa bình luận!');
      setIsSubmitting(false);
      return;
    }

    try {
      let targetComment = comments.find(c => c.id === commentId);
      if (!targetComment) {
        comments.forEach(comment => {
          const reply = (comment.replies || []).find(r => r.id === commentId);
          if (reply) targetComment = reply;
        });
      }

      if (!targetComment) {
        throw new Error('Không tìm thấy bình luận!');
      }

      const replyIds = getAllReplyIds(targetComment);
      for (const replyId of replyIds) {
        await deleteComment(replyId);
      }

      await deleteComment(commentId);

      setComments(prevComments => {
        const updatedComments = prevComments
          .filter(comment => comment.id !== commentId)
          .map(comment => ({
            ...comment,
            replies: (comment.replies || []).filter(reply => reply.id !== commentId),
          }));
        return updatedComments;
      });

      toast.success('Bình luận và các phản hồi đã được xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa bình luận!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RenderComment = ({ comment, level = 0 }) => {
    const isOwner = currentUserId === comment.userId;
    const [showReplies, setShowReplies] = useState(false);
    const [localReplyText, setLocalReplyText] = useState('');
  
    const handleSubmitReply = async () => {
      if (!localReplyText.trim()) {
        toast.error('Bạn cần nhập nội dung trả lời!');
        return;
      }
  
      setIsSubmitting(true);
      if (!authToken || authToken.split('.').length !== 3) {
        toast.error('Vui lòng đăng nhập để trả lời!');
        setIsSubmitting(false);
        return;
      }
  
      try {
        const replyData = {
          postId: postId,
          content: localReplyText,
          parentCommentId: comment.id,
        };
        const response = await createComment(replyData);
        setComments(prevComments =>
          prevComments.map(c =>
            c.id === comment.id
              ? { ...c, replies: [...(c.replies || []), response] }
              : c
          )
        );
        toast.success('Trả lời đã được gửi thành công!');
        setLocalReplyText('');
        setReplyTo(null);
      } catch (error) {
        console.error('Lỗi khi gửi trả lời:', error);
        toast.error(error.message || 'Có lỗi xảy ra khi gửi trả lời!');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className={`ml-${level * 12} pb-4`}>
        <div className="flex items-start space-x-3 mt-2">
          <img
            src={comment.userProfileImage ? `${import.meta.env.VITE_API_URL}${comment.userProfileImage}` : 'https://i.pravatar.cc/150'}
            alt={comment.userFullName || 'Ẩn danh'}
            className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
            onError={(e) => (e.target.src = 'https://i.pravatar.cc/150')}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-gray-800">{comment.userFullName || 'Ẩn danh'}</p>
              {isOwner && !editCommentId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setCommentText(comment.content);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa bình luận này? Tất cả phản hồi cũng sẽ bị xóa.')) {
                        handleDeleteComment(comment.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-line mt-1">{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleString('vi-VN')}
            </p>
            {/* Xóa điều kiện isOwner để mọi người dùng đã đăng nhập có thể trả lời */}
            <button
              onClick={() => setReplyTo(comment.id)}
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
            >
              Trả lời
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="mt-2 ml-4 text-blue-500 hover:text-blue-700 text-sm"
              >
                {showReplies ? `Ẩn câu trả lời` : `Xem ${comment.replies.length} câu trả lời`}
              </button>
            )}
          </div>
        </div>
  
        {replyTo === comment.id && (
          <div className="ml-12 mt-2">
            <textarea
              value={localReplyText}
              onChange={(e) => setLocalReplyText(e.target.value)}
              placeholder="Viết trả lời của bạn..."
              className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              rows="2"
            />
            <button
              onClick={handleSubmitReply}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}
              <Send className="ml-1" size={16} />
            </button>
            <button
              onClick={() => setReplyTo(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              Hủy
            </button>
          </div>
        )}
  
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => (
              <RenderComment key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-pink-500 mb-4">Bình luận bài viết</h3>

      {isLoading ? (
        <p className="text-center text-gray-500">Đang tải bình luận...</p>
      ) : (
        <>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            rows="4"
          />
          <button
            onClick={editCommentId ? handleEditComment : handleSubmitComment}
            className={`flex items-center ${
              editCommentId ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-lg transition duration-200`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : editCommentId ? 'Lưu chỉnh sửa' : 'Gửi bình luận'}
            <Send className="ml-2" size={18} />
          </button>

          {comments.length > 0 ? (
            <div className="mt-6">
              <h4 className="font-semibold text-lg text-gray-700 mb-4">Bình luận của người dùng:</h4>
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <React.Fragment key={comment.id}>
                    {index > 0 && <hr className="border-gray-200" />}
                    <RenderComment comment={comment} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">Chưa có bình luận nào.</p>
          )}
        </>
      )}
    </div>
  );
};

export default CommentPost;