import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getCommentsByPostId } from '../../../api/commentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-toastify';
import { formatDate } from '../../../utils/formatDate';

function CommentByPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsData = await getCommentsByPostId(postId);
      commentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(commentsData);
    } catch (err) {
      setError('Không thể tải danh sách bình luận');
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const renderComment = (comment) => (
    <TableRow key={comment.id}>
      <TableCell>{comment.id}</TableCell>
      <TableCell>
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
      <TableCell>{comment.parentCommentId ? `Con của ID ${comment.parentCommentId}` : 'Cha'}</TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => navigate('/instructor/post-management')}
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Bình luận cha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.length > 0 ? (
                  comments.map(comment => renderComment(comment))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
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
