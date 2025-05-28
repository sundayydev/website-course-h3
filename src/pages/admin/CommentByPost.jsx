
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { getCommentsByPostId } from '../../api/commentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';

function CommentByPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm duyệt đệ quy để tạo cây bình luận
  const buildCommentTree = (commentsData) => {
    const commentMap = new Map();
    commentsData.forEach(comment => commentMap.set(comment.id, { ...comment, children: [] }));

    commentsData.forEach(comment => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) parent.children.push(commentMap.get(comment.id));
      }
    });

    return Array.from(commentMap.values()).filter(comment => !comment.parentCommentId);
  };

  // Lấy danh sách bình luận
  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsData = await getCommentsByPostId(postId);
      console.log('Comments data:', JSON.stringify(commentsData, null, 2));

      const rootComments = buildCommentTree(commentsData);
      rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      console.log('Root comments:', JSON.stringify(rootComments, null, 2));
      setComments(rootComments);
    } catch (err) {
      setError('Không thể tải danh sách bình luận');
      toast.error('Không thể tải dữ liệu');
      console.error('Lỗi khi lấy dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const toggleChildren = (commentId) => {
    setExpandedComments(prev => {
      const newState = { ...prev, [commentId]: !prev[commentId] };
      // Log bình luận con khi toggle
      const comment = comments.find(c => c.id === commentId) || findCommentById(comments, commentId);
      if (newState[commentId] && comment && Array.isArray(comment.children) && comment.children.length > 0) {
        console.log(`Bình luận con của ID ${commentId}:`, JSON.stringify(comment.children, null, 2));
      } else if (newState[commentId]) {
        console.log(`Không có bình luận con cho ID ${commentId}`);
      }
      console.log('Expanded comments:', newState);
      return newState;
    });
  };

  // Hàm tìm comment theo ID trong cây đệ quy
  const findCommentById = (comments, commentId) => {
    for (let comment of comments) {
      if (comment.id === commentId) return comment;
      if (comment.children.length > 0) {
        const found = findCommentById(comment.children, commentId);
        if (found) return found;
      }
    }
    return null;
  };

  const renderComment = (comment, isChild = false, level = 0) => (
    <TableRow key={comment.id} className={isChild ? 'bg-gray-50' : ''}>
      <TableCell className={isChild ? `pl-${level * 8}` : ''}>
        <div className="text-gray-900 whitespace-pre-line">{comment.content}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {comment.userProfileImage && (
            <img
              src={comment.userProfileImage}
              alt={comment.userFullName || 'Ẩn danh'}
              className="h-8 w-8 rounded-full mr-2 object-cover"
              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            />
          )}
          <span>{comment.userFullName || 'Ẩn danh'}</span>
        </div>
      </TableCell>
      <TableCell>{formatDate(comment.createdAt)}</TableCell>
      <TableCell>
        {isChild ? (
          `Con của ID ${comment.parentCommentId}`
        ) : Array.isArray(comment.children) && comment.children.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleChildren(comment.id)}
            className="flex items-center"
          >
            {expandedComments[comment.id] ? (
              <FaChevronDown className="mr-1" />
            ) : (
              <FaChevronRight className="mr-1" />
            )}
            ({comment.children.length})
          </Button>
        ) : (
          'Cha'
        )}
      </TableCell>
    </TableRow>
  );

  const renderCommentTree = (comment, level = 0) => (
    <React.Fragment key={comment.id}>
      {renderComment(comment, level > 0, level)}
      {expandedComments[comment.id] && comment.children.length > 0 && (
        comment.children.map(child => renderCommentTree(child, level + 1))
      )}
    </React.Fragment>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => navigate('/admin/post-management')}
        >
          <FaArrowLeft className="mr-2" /> Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-pink-500">
          Bình luận của bài viết ID: {postId}
        </h1>
      </div>
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {!loading && error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bình luận</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Bình luận con</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.length > 0 ? (
                  comments.map(comment => renderCommentTree(comment))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Không có bình luận nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CommentByPost;
