import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus, Search, Loader2, BookOpen, Filter, FileVideo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getCourses, createCourse, updateCourse, uploadImage, deleteCourse } from '@/api/courseApi';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    urlImage: null,
    instructorId: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Không thể tải danh sách khóa học');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, formData);
        if (formData.urlImage) {
          await uploadImage(editingCourse.id, formData.urlImage);
        }
      } else {
        const response = await createCourse(formData);
        if (formData.urlImage) {
          await uploadImage(response.id, formData.urlImage);
        }
      }

      toast.success(editingCourse ? 'Cập nhật khóa học thành công' : 'Thêm khóa học thành công');
      setIsDialogOpen(false);
      fetchCourses();
      resetForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await deleteCourse(id);
        toast.success('Xóa khóa học thành công');
        fetchCourses();
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa khóa học');
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      urlImage: course.urlImage || '',
      instructorId: course.instructorId,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '', 
      price: 0,
      urlImage: '',
      instructorId: '',
    });
    setEditingCourse(null);
  };

  const handleViewLessons = (courseId) => {
    navigate(`/admin/course-detail/${courseId}`);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-[calc(1520px-250px)]">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi thông tin các khóa học</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Thêm khóa học
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex gap-4" encType="multipart/form-data">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên khóa học</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Nhập tên khóa học"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Nhập mô tả khóa học"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá (VNĐ)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                      placeholder="Nhập giá khóa học"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Ảnh khóa học</Label>
                    <div
                      className="
                      border-2 border-dashed border-gray-300 rounded-lg p-4 
                      text-center cursor-pointer 
                      hover:border-pink-500 transition-colors"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        setFormData({ ...formData, urlImage: e.target.files[0] });
                      }}
                    >
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {setFormData({ ...formData, urlImage: e.target.files[0] });
                        }}
                      />
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <FileVideo className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Kéo thả hoặc click để tải ảnh lên
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                  {editingCourse ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
              <div className="w-[230px] flex flex-col items-center gap-2">
                <div className="w-[230px] h-[129px] bg-gray-100 rounded-lg overflow-hidden">
                  {formData.urlImage || editingCourse?.urlImage ? (
                    <img
                      src={
                        editingCourse?.urlImage
                          ? import.meta.env.VITE_API_URL + editingCourse.urlImage
                          : formData.urlImage
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">Kích thước: 460x259</span>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white hover:bg-gray-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng số khóa học</CardTitle>
            <BookOpen className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{courses.length}</div>
            <p className="text-sm text-gray-500 mt-1">Khóa học đang hoạt động</p>
          </CardContent>
        </Card>
        <Card className="bg-white hover:bg-gray-50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Khóa học miễn phí</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {courses.filter((c) => c.price === 0).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Khóa học không tính phí</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Danh sách khóa học</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Button variant="outline" className="gap-2 hover:bg-gray-100">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Chưa có khóa học nào được tạo</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%] text-pink-500">Thông tin khóa học</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Giá</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Ngày tạo</TableHead>
                    <TableHead className="w-[15%] text-pink-500 text-center">Bài học</TableHead>
                    <TableHead className="text-right w-[15%] text-pink-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-gray-50">
                      <TableCell className="flex items-center gap-3">
                        <img
                          src={
                            course.urlImage
                              ? import.meta.env.VITE_API_URL + course.urlImage
                              : import.meta.env.VITE_API_URL + '/uploads/placeholder.png'
                          }
                          alt={course.title}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[400px]">
                            {course.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.price === 0 ? (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            Miễn phí
                          </Badge>
                        ) : (
                          <span className="font-medium text-gray-900">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(course.price)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{course.createdAt}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          className="gap-2 hover:bg-pink-50 hover:text-pink-600"
                          onClick={() => handleViewLessons(course.id)}
                        >
                          <FileVideo className="h-4 w-4" />
                          Xem bài học
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(course)}
                            className="hover:bg-pink-50 hover:text-pink-600"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(course.id)}
                            className="hover:bg-red-50 text-red-500 hover:text-red-600"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;
