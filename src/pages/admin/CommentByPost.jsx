import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaEye } from 'react-icons/fa';
import { getCommentsByPostId } from '../../api/commentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { parse, isSameDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

function CommentByPost() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

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

  const isToday = (date) => {
    if (!date || typeof date !== 'string') {
      console.warn('Invalid date input:', date);
      return false;
    }
    try {
      const commentDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
      if (isNaN(commentDate.getTime())) {
        console.warn('Failed to parse date:', date);
        return false;
      }
      return isSameDay(commentDate, new Date());
    } catch (e) {
      console.warn('Date parsing error:', date, e);
      return false;
    }
  };

  const isThisWeek = (date) => {
    if (!date || typeof date !== 'string') {
      console.warn('Invalid date input:', date);
      return false;
    }
    try {
      const commentDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
      if (isNaN(commentDate.getTime())) {
        console.warn('Failed to parse date:', date);
        return false;
      }
      const today = new Date();
      return isWithinInterval(commentDate, {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      });
    } catch (e) {
      console.warn('Date parsing error:', date, e);
      return false;
    }
  };

  const isThisMonth = (date) => {
    if (!date || typeof date !== 'string') {
      console.warn('Invalid date input:', date);
      return false;
    }
    try {
      const commentDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
      if (isNaN(commentDate.getTime())) {
        console.warn('Failed to parse date:', date);
        return false;
      }
      const today = new Date();
      return isWithinInterval(commentDate, {
        start: startOfMonth(today),
        end: endOfMonth(today),
      });
    } catch (e) {
      console.warn('Date parsing error:', date, e);
      return false;
    }
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      (comment.content?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        comment.userFullName?.toLowerCase()?.includes(searchTerm.toLowerCase())) ??
      true;
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'parent' && !comment.parentCommentId) ||
      (typeFilter === 'child' && comment.parentCommentId);
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && isToday(comment.createdAt)) ||
      (dateFilter === 'week' && isThisWeek(comment.createdAt)) ||
      (dateFilter === 'month' && isThisMonth(comment.createdAt));
    return matchesSearch && matchesType && matchesDate;
  });

  const totalComments = comments.length;
  const parentComments = comments.filter((c) => !c.parentCommentId).length;
  const recentComments = comments.filter((c) => isThisWeek(c.createdAt)).length;

  const handleViewDetails = (comment) => {
    setSelectedComment(comment);
    setIsOpen(true);
  };

  const renderComment = (comment) => (
    <TableRow key={comment.id}>
      <TableCell>{comment.id}</TableCell>
      <TableCell>
        <div className=" whitespace-pre-line line-clamp-2">{comment.content}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {comment.userProfileImage && (
            <img
              src={comment.userProfileImage}
              alt={comment.userFullName || 'Ẩn danh'}
              className="h-8 w-8 rounded-full mr-2 object-cover"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          )}
          <span>{comment.userFullName || 'Ẩn danh'}</span>
        </div>
      </TableCell>
      <TableCell>{formatDate(comment.createdAt)}</TableCell>
      <TableCell>{comment.parentCommentId ? `Con của ID ${comment.parentCommentId}` : 'Cha'}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetails(comment)}
          title="Xem chi tiết"
        >
          <FaEye className="mr-2 h-4 w-4" /> Xem chi tiết
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-pink-500">
            Bình luận của bài viết ID: {postId}
          </h1>
        </div>
      </div>

      {/* Thẻ thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tổng số bình luận</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{totalComments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bình luận cha</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{parentComments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bình luận mới (tuần này)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{recentComments}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo nội dung hoặc tác giả"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo loại bình luận" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="parent">Bình luận cha</SelectItem>
                <SelectItem value="child">Bình luận con</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                  <TableHead className="w-[5%] text-pink-500 font-semibold ">
                    ID
                  </TableHead>
                  <TableHead className="w-[25%] text-pink-500 font-semibold ">
                    Nội dung
                  </TableHead>
                  <TableHead className="w-[15%] text-pink-500 font-semibold ">
                    Tác giả
                  </TableHead>
                  <TableHead className="w-[15%] text-pink-500 font-semibold ">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="w-[15%] text-pink-500 font-semibold ">
                    Loại bình luận
                  </TableHead>
                  <TableHead className="w-[15%] text-pink-700 font-semibold ">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.length > 0 ? (
                  filteredComments.map(comment => renderComment(comment))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không có bình luận nào phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Popup chi tiết bình luận */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chi tiết bình luận
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          {selectedComment && (
            <div className="grid grid-cols-2 gap-6 py-4">
              {/* Cột trái */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-medium text-red-500 block mb-2">
                    Nội dung:
                  </span>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedComment.content}
                  </p>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">Loại bình luận:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${selectedComment.parentCommentId
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {selectedComment.parentCommentId
                      ? `Con của ID ${selectedComment.parentCommentId}`
                      : 'Cha'}
                  </span>
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <span className="text-gray-700">{selectedComment.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                    <span className="text-gray-700">{formatDate(selectedComment.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500">Tác giả:</span>
                  {selectedComment.userProfileImage && (
                    <img
                      src={selectedComment.userProfileImage}
                      alt={selectedComment.userFullName || 'Ẩn danh'}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                      onError={(e) => (e.target.src = defaultAvatar)}
                    />
                  )}
                  <span className="font-medium text-gray-700">
                    {selectedComment.userFullName || 'Ẩn danh'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommentByPost;