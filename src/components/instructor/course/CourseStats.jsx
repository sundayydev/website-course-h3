import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function CourseStats({ enrollments = 0, revenue = 0, rating = 0, reviewCount = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Học viên đăng ký
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrollments}</div>
          <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${revenue?.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            {rating}
            <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Based on {reviewCount} reviews</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tỷ lệ hoàn thành
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">68%</div>
          <p className="text-xs text-muted-foreground mt-1">+3% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
