import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getCommentsByPostId, createComment, updateComment } from '../../api/commentApi'; 
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const CommentPost = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingComment, setExistingComment] = useState(null);

  useEffect(() => {
    console.log(postId);
    const fetchPostComments = async () => {
      try {
        const postComments = await getCommentsByPostId(postId); 
        console.log(postComments);
        setComments(postComments);

        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          const decodedToken = jwtDecode(authToken);
          const userComment = postComments.find(comment => comment.userId === decodedToken.id);
          if (userComment) {
            setExistingComment(userComment);
            setCommentText(userComment.content);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải bình luận của bài viết:', error);
        setComments([]);
      }
    };

    if (postId) {
      fetchPostComments();
    }
  }, [postId]);

  // Xử lý gửi bình luận
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast.error('Bạn cần nhập nội dung bình luận!');
      return;
    }

    setIsSubmitting(true);
    const authToken = localStorage.getItem('authToken');

    if (!authToken || authToken.split('.').length !== 3) {
      toast.error('Token không hợp lệ hoặc thiếu cấu trúc!');
      setIsSubmitting(false);
      return;
    }

    try {
      const commentData = {
        postId: postId,
        content: commentText,
      };

      let response;
      if (existingComment) {
        // Cập nhật bình luận hiện có
        response = await updateComment(existingComment.id, commentData);
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === existingComment.id ? response : comment
          )
        );
        toast.success('Bình luận đã được cập nhật thành công!');
      } else {
        // Tạo bình luận mới
        response = await createComment(commentData);
        setComments(prevComments => [...prevComments, response]);
        setExistingComment(response);
        toast.success('Bình luận đã được gửi thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
      toast.error('Có lỗi xảy ra khi gửi bình luận!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Bình luận bài viết</h3>

      {/* Form nhập bình luận */}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Viết bình luận của bạn..."
        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
      />

      {/* Nút gửi bình luận */}
      <button
        onClick={handleSubmitComment}
        className={`flex items-center ${existingComment ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-lg transition duration-200`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang gửi...' : existingComment ? 'Cập nhật bình luận' : 'Gửi bình luận'}
        <Send className="ml-2" size={18} />
      </button>

      {/* Hiển thị tất cả bình luận của bài viết */}
   {/* Hiển thị tất cả bình luận của bài viết */}
        {comments.length > 0 && (
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">Bình luận của người dùng</h4>
            <div className="space-y-6">
              {comments.map((comment, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={import.meta.env.VITE_API_URL + comment.userAvatar || 'https://avatar.iran.liara.run/public/30'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{comment.userName || 'Ẩn danh'}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentPost;