import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function CourseBasicInfo({ course, category, courseId, totalLessons = 0 }) {

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khóa học</CardTitle>
        <CardDescription>Một số thông tin cơ bản của khóa học</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <CourseThumbnail image={course.urlImage} title={course.title} />
          <CourseDetails course={course} category={category} totalLessons={totalLessons} />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/instructor/course/${courseId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa khóa học
        </Button>
      </CardFooter>
    </Card>
  );
}

// eslint-disable-next-line react/prop-types
function CourseThumbnail({image, title}) {
  return (
    <div className="relative aspect-video w-full md:w-64 h-40 overflow-hidden rounded-lg flex-shrink-0">
      {image ? (
        <img src={image} alt={title} className="object-cover" />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Không có ảnh</p>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function CourseDetails({course, category, totalLessons}) {
  return (
    <div className="flex-grow">
      <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Danh mục</p>
          <p className="font-medium">{category?.name || 'Uncategorized'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Ngày tạo</p>
          <p className="font-medium">
            {course?.createdAt ? course.createdAt.split(" ")[0] : 'N/A'}
          </p>

        </div>
        <div>
          <p className="text-sm text-muted-foreground">Giá</p>
          <p className="font-medium">{course.price} VNĐ</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tổng số bài học</p>
          <p className="font-medium">{totalLessons}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Mô tả</p>
      <p className="line-clamp-3">{course.description}</p>
    </div>
  );
}
