import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import { getReviewsByCourseId } from '../../api/reviewApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { isSameDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

function ReviewByCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchReview = async () => {
    setLoading(true);
    try {
      const reviewData = await getReviewsByCourseId(courseId);
      reviewData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(reviewData);
    } catch (err) {
      setError('Không thể tải danh sách bình luận');
      toast.error('Không thể tải dữ liệu');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [courseId]);

  const isToday = (date) => {
    if (!date || typeof date !== 'string') {
      console.warn('Invalid date input:', date);
      return false;
    }
    try {
      const reviewDate = new Date(date);
      if (isNaN(reviewDate.getTime())) {
        console.warn('Failed to parse date:', date);
        return false;
      }
      return isSameDay(reviewDate, new Date());
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
      const reviewDate = new Date(date);
      if (isNaN(reviewDate.getTime())) {
        console.warn('Failed to parse date:', date);
        return false;
      }
      const today = new Date();
      return isWithinInterval(reviewDate, {
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
      const reviewDate = new Date(date);
      if (isNaN(reviewDate.getTime())) {
        console.warn('Failed to parse date:', date);
        return false;
      }
      const today = new Date();
      return isWithinInterval(reviewDate, {
        start: startOfMonth(today),
        end: endOfMonth(today),
      });
    } catch (e) {
      console.warn('Date parsing error:', date, e);
      return false;
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      (review.comment?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        review.userFullName?.toLowerCase()?.includes(searchTerm.toLowerCase())) ??
      true;
    const matchesRating = ratingFilter === 'all' || review.rating?.toString() === ratingFilter;
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && isToday(review.createdAt)) ||
      (dateFilter === 'week' && isThisWeek(review.createdAt)) ||
      (dateFilter === 'month' && isThisMonth(review.createdAt));
    return matchesSearch && matchesRating && matchesDate;
  });

  const totalReviews = reviews.length;
  const highRatedReviews = reviews.filter((r) => r.rating >= 4).length;
  const recentReviews = reviews.filter((r) => isThisWeek(r.createdAt)).length;

  const renderComment = (review) => (
    <TableRow key={review.id}>
      <TableCell>{review.id}</TableCell>
      <TableCell>
        <div className="text-gray-900 whitespace-pre-line">{review.comment}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`h-5 w-5 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 font-medium text-gray-700">({review.rating}/5)</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {review.userProfileImage && (
            <img
              src={review.userProfileImage}
              alt={review.userFullName || 'Ẩn danh'}
              className="h-8 w-8 rounded-full mr-2 object-cover"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          )}
          <span className="font-medium">{review.userFullName || 'Ẩn danh'}</span>
        </div>
      </TableCell>
      <TableCell>{formatDate(review.createdAt)}</TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => navigate('/admin/courses')}
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-pink-500">
            Bình luận của bài viết ID: {courseId}
          </h1>
        </div>
      </div>

      {/* Thẻ thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tổng số đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{totalReviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Đánh giá cao (4-5 sao)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{highRatedReviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Đánh giá mới (tuần này)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{recentReviews}</p>
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
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo điểm đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả điểm</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map(review => renderComment(review))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Không có đánh giá nào phù hợp
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

export default ReviewByCourse;