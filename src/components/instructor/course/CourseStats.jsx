import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, DollarSign, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEnrollmentsByCourseId } from '@/api/enrollmentApi';
import { getReviewsByCourseId } from '@/api/reviewApi';
import { getOrdersByUserId } from '@/api/orderApi';

export default function CourseStats({ courseId }) {
  const [stats, setStats] = useState({
    enrollments: 0,
    revenue: 0,
    rating: 0,
    reviewCount: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch enrollments
        const enrollmentsResponse = await getEnrollmentsByCourseId(courseId);
        const enrollments = enrollmentsResponse?.length || 0;

        // Fetch reviews
        const reviewsResponse = await getReviewsByCourseId(courseId);
        const reviews = reviewsResponse || [];
        const rating = reviews.length > 0 
          ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
          : 0;

        // Calculate revenue from orders
        const ordersResponse = await getOrdersByUserId(courseId);
        const orders = ordersResponse || [];
        const revenue = orders.reduce((acc, order) => {
          if (order.status === 'Paid') {
            return acc + (order.amount || 0);
          }
          return acc;
        }, 0);

        // Calculate completion rate (assuming it's based on enrollments with completed status)
        const completedEnrollments = enrollmentsResponse?.filter(e => e.status === 'Completed')?.length || 0;
        const completionRate = enrollments > 0 ? Math.round((completedEnrollments / enrollments) * 100) : 0;

        setStats({
          enrollments,
          revenue,
          rating,
          reviewCount: reviews.length,
          completionRate
        });
      } catch (error) {
        console.error('Error fetching course stats:', error);
      }
    };

    if (courseId) {
      fetchStats();
    }
  }, [courseId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Học viên đăng ký
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.enrollments}</div>
          <p className="text-xs text-muted-foreground mt-1">Tổng số học viên</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Doanh thu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.revenue?.toLocaleString()} VNĐ</div>
          <p className="text-xs text-muted-foreground mt-1">Tổng doanh thu từ khóa học</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Đánh giá
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            {stats.rating}
            <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Dựa trên {stats.reviewCount} đánh giá</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Tỷ lệ hoàn thành
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Học viên hoàn thành khóa học</p>
        </CardContent>
      </Card>
    </div>
  );
}
