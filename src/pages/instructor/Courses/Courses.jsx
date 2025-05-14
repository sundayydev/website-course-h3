import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, DollarSign, Calendar, ArrowRight, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories } from '@/api/categoryApi';
import { getUserId } from '@/api/authUtils';
import { getCourseByInstructorId } from '@/api/courseApi';
import { useNavigate } from 'react-router-dom';

// Tạo một component với tên CoursesPage
export default function CoursesPage() {
  // Khai báo các biến trạng thái
  const navigate = useNavigate();

  // State cho dữ liệu và bộ lọc
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [priceSort, setPriceSort] = useState('');

  // Danh sách các danh mục duy nhất từ dữ liệu
  const categories = async () => {
    const data = await getCategories(); // Gọi API
    setCategoryOptions(data);
    return data;
  };

  useEffect(() => {
    categories(); // Gọi khi component mount
  }, []);

  // Giả lập việc tải dữ liệu từ API
  useEffect(() => {
    const fetchCourses = async () => {
      const userId = getUserId(); // Lấy ID người dùng từ token

      const courseData = await getCourseByInstructorId(userId); // Gọi API để lấy danh sách khóa học
      courseData.map((course) => {
        const category = categoryOptions.find((cat) => cat.id === course.categoryId);
        course.category = category || { name: 'Không phân loại' };
        return course;
      });

      setCourses(courseData);
      setFilteredCourses(courseData);
      setLoading(false);
    };

    fetchCourses();
  }, [categoryOptions]);

  // Lọc khóa học dựa trên từ khóa tìm kiếm và bộ lọc
  useEffect(() => {
    if (courses.length > 0) {
      let result = [...courses];

      // Lọc theo từ khóa tìm kiếm
      if (searchTerm) {
        result = result.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Lọc theo danh mục
      if (categoryFilter) {
        result = result.filter((course) => course.category?.name === categoryFilter);
      }

      // Sắp xếp theo giá
      if (priceSort === 'asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (priceSort === 'desc') {
        result.sort((a, b) => b.price - a.price);
      }

      setFilteredCourses(result);
    }
  }, [searchTerm, categoryFilter, priceSort, courses]);

  // Format giá hiển thị
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen overflow-scroll">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Khám Phá Các Khóa Học</h1>
          <p className="text-gray-500">
            Nâng cao kỹ năng của bạn với các khóa học chất lượng cao từ các chuyên gia hàng đầu
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button
            variant={'outline'}
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            <span className="text-white">Thêm Khóa Học Mới</span>
            <Plus size={16} className="ml-2 text-white" />
          </Button>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Tìm kiếm khóa học..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Danh mục" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceSort} onValueChange={setPriceSort}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2" />
                  <SelectValue placeholder="Sắp xếp giá" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="desc">Giá: Cao đến thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Hiển thị số kết quả */}
      <div className="mb-4">
        <p className="text-gray-500">Hiển thị {filteredCourses.length} khóa học</p>
      </div>

      {/* Danh sách khóa học */}
      {loading ? (
        // Skeleton loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-[240px] bg-gray-100">
                <img
                  src={
                    import.meta.env.VITE_API_URL +
                    (course.urlImage || '/uploads/default-course.png')
                  }
                  alt={course.title}
                  className="w-full h-full object-cover shadow-sm"
                />
                <Badge className="absolute top-3 right-3 bg-primary text-sm text-white">
                  {course.price === 0 ? 'Miễn phí' : formatPrice(course.price)}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-normal">
                    {course.category?.name || 'Không phân loại'}
                  </Badge>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {course.createdAt.split(' ')[0]}
                  </div>
                </div>

                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">{course.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                {/*<div className="flex items-center text-sm text-gray-500 mb-2">*/}
                {/*  <User size={14} className="mr-1" />*/}
                {/*  <span>{course.user.name}</span>*/}
                {/*</div>*/}

                <div className="flex items-start text-sm text-gray-500">
                  <BookOpen size={14} className="mr-1 mt-1 flex-shrink-0" />
                  <div>
                    <span className="block mb-1">Nội dung khóa học:</span>
                    <p className="line-clamp-2">{course.contents?.join(', ')}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/instructor/course/${course.id}`)}
                >
                  Xem chi tiết
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Không tìm thấy khóa học</h3>
          <p className="text-gray-500 mb-4">
            Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setPriceSort('');
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
