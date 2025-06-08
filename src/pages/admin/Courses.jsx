import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { FaComment } from 'react-icons/fa';
import { getCourses, createCourse, updateCourse, uploadImage, deleteCourse, approveCourse } from '@/api/courseApi';
import { addNotification } from '@/api/notificationApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { formatDate } from '../../utils/formatDate';
import slugify from 'slugify'; // Import slugify

const Courses = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
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
    contents: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumberFromUrl = parseInt(searchParams.get('page') || 1, 10);

  // Sử dụng slugify thay cho hàm generateSlug
  const generateSlug = (text) => {
    if (!text) return '';
    return slugify(text, {
      lower: true, // Chuyển thành chữ thường
      strict: true, // Loại bỏ ký tự đặc biệt
      remove: /[*+~.()'"!:@]/g, // Loại bỏ các ký tự không mong muốn
      locale: 'vi', // Hỗ trợ loại bỏ dấu tiếng Việt
      trim: true, // Xóa khoảng trắng đầu/cuối
    });
  };

  // Cập nhật currentPage dựa trên URL
  useEffect(() => {
    const initialPage = pageNumberFromUrl >= 1 ? pageNumberFromUrl : 1;
    setCurrentPage(initialPage);
  }, [pageNumberFromUrl]);

  // Lấy toàn bộ khóa học
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      console.log('Danh sách khóa học:', data);
      setAllCourses(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      toast.error('Không thể tải danh sách khóa học');
      console.error('Lỗi khi tải danh sách khóa học:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Xử lý phân trang và tìm kiếm phía client
  useEffect(() => {
    const slug = searchParams.get('slug') || '';
    let filteredCourses = allCourses;

    // Lọc khóa học dựa trên searchTerm và slug
    if (slug || searchTerm) {
      filteredCourses = allCourses.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          generateSlug(course.title).includes(slug)
      );
    }

    // Cập nhật totalPages dựa trên danh sách đã lọc
    setTotalPages(Math.ceil(filteredCourses.length / pageSize));

    // Tính toán khóa học hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedCourses(filteredCourses.slice(startIndex, endIndex));
  }, [searchTerm, searchParams, currentPage, allCourses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      try {
        await updateCourse(editingCourse.id, formData);
        if (formData.urlImage && formData.urlImage instanceof File && formData.urlImage !== '') {
          await uploadImage(editingCourse.id, formData.urlImage);
        }
        toast.success('Cập nhật khóa học thành công');
        setIsDialogOpen(false);
        fetchCourses();
        resetForm();
      } catch (error) {
        console.error('Lỗi khi cập nhật khóa học:', error);
        toast.error('Có lỗi xảy ra khi cập nhật khóa học');
      }
    } else {
      try {
        const response = await createCourse(formData);
        if (formData.urlImage && formData.urlImage instanceof File && formData.urlImage !== '') {
          await uploadImage(response.id, formData.urlImage);
        }
        toast.success('Thêm khóa học thành công');
        setIsDialogOpen(false);
        fetchCourses();
        resetForm();
      } catch (error) {
        console.error('Lỗi khi tạo khóa học:', error);
        toast.error('Có lỗi xảy ra khi tạo khóa học');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await deleteCourse(id);
        toast.success('Xóa khóa học thành công');
        setAllCourses(allCourses.filter((course) => course.id !== id));
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa khóa học');
        console.error('Lỗi khi xóa khóa học:', error);
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
      contents: course.contents,
    });
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (id, value) => {
    if (!['Active', 'Inactive'].includes(value)) {
      toast.error('Trạng thái không hợp lệ. Chỉ chấp nhận "Active" hoặc "Inactive".');
      return;
    }
    try {
      await approveCourse(id, value);
      toast.success(`Khóa học đã được ${value === 'Active' ? 'kích hoạt' : 'hủy kích hoạt'}`);

      const course = allCourses.find((c) => c.id === id);
      if (course && course.instructorId) {
        const notificationData = {
          type: value === 'Active' ? 'CourseActivation' : 'CourseDeactivation',
          content: `Khóa học "${course.title}" của bạn ${value === 'Active' ? 'đã được kích hoạt' : 'đã bị hủy kích hoạt'}.`,
          relatedEntityId: id.toString(),
          relatedEntityType: 'Course',
          userIds: [course.instructorId],
        };
        try {
          await addNotification(notificationData);
          console.log(`Thông báo ${value === 'Active' ? 'kích hoạt' : 'hủy kích hoạt'} khóa học đã được gửi.`);
        } catch (error) {
          console.error(`Lỗi khi gửi thông báo ${value === 'Active' ? 'kích hoạt' : 'hủy kích hoạt'} khóa học:`, error);
        }
      }

      fetchCourses();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Không xác định';
      toast.error(`Lỗi khi thay đổi trạng thái khóa học: ${errorMessage}`);
      console.error('Lỗi khi thay đổi trạng thái khóa học:', {
        id,
        value,
        error: errorMessage,
        stack: error.stack,
      });
    }
  };

  const getStatusBadge = (status) => {
    let variant, bgClass, textClass, label;
    switch (status) {
      case 'Active':
        variant = 'success';
        bgClass = 'bg-green-100';
        textClass = 'text-green-800';
        label = 'Kích hoạt';
        break;
      case 'Inactive':
      default:
        variant = 'secondary';
        bgClass = 'bg-gray-100';
        textClass = 'text-gray-800';
        label = 'Hủy kích hoạt';
        break;
    }
    return (
      <Badge variant={variant} className={`${bgClass} ${textClass}`}>
        {label}
      </Badge>
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      urlImage: null,
      instructorId: '',
      contents: [],
    });
    setEditingCourse(null);
  };

  const handleViewLessons = (courseId) => {
    navigate(`/admin/course-detail/${courseId}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang 1
    const slug = generateSlug(value);
    setSearchParams({ page: '1', slug: slug || '' }); // Cập nhật URL với slug
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ page: page, slug: searchParams.get('slug') || '' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchParams({ page: currentPage - 1, slug: searchParams.get('slug') || '' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchParams({ page: currentPage + 1, slug: searchParams.get('slug') || '' });
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
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
                <div className="space-y-2">
                  <Label htmlFor="content">Tóm tắt nội dung</Label>
                  <Textarea
                    id="content"
                    value={
                      Array.isArray(formData.contents)
                        ? formData.contents.join('\n')
                        : formData.contents
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contents: e.target.value,
                      })
                    }
                    placeholder="Nhập tóm tắt nội dung khóa học"
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
                        onChange={(e) => {
                          setFormData({ ...formData, urlImage: e.target.files[0] });
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
                  {formData?.urlImage ? (
                    <img
                      src={
                        formData.urlImage instanceof Blob || formData.urlImage instanceof File
                          ? URL.createObjectURL(formData.urlImage)
                          : editingCourse?.urlImage
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : editingCourse?.urlImage ? (
                    <img
                      src={editingCourse.urlImage}
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
            <div className="text-3xl font-bold text-gray-900">{allCourses.length}</div>
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
              {allCourses.filter((c) => c.price === 0).length}
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
                  onChange={handleSearchChange}
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
          ) : displayedCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Chưa có khóa học nào được tạo</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] text-pink-500 font-semibold">
                      Thông tin khóa học
                    </TableHead>
                    <TableHead className="w-[15%] text-pink-500 font-semibold text-center">
                      Giá
                    </TableHead>
                    <TableHead className="w-[15%] text-pink-500 font-semibold text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="w-[15%] text-pink-500 font-semibold text-center">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="w-[10%] text-pink-500 font-semibold text-center">
                      Bài học
                    </TableHead>
                    <TableHead className="w-[10%] text-pink-700 font-semibold text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedCourses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-gray-100 transition-colors">
                      <TableCell className="flex items-center gap-4 py-3">
                        <img
                          src={course.urlImage ? course.urlImage : ""}
                          alt={course.title}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <div
                            className="font-medium text-gray-900 line-clamp-1 cursor-pointer hover:underline"
                            onClick={() => navigate(`/courses/${generateSlug(course.title)}`)}
                          >
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-[350px]">
                            {course.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {course.price === 0 ? (
                          <Badge variant="success" className="bg-green-100 text-green-800 text-xs px-2 py-1">
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
                      <TableCell className="text-center">
                        <Select
                          value={course.activate || 'Inactive'}
                          onValueChange={(value) => handleStatusChange(course.id, value)}
                          className="w-[140px] mx-auto"
                        >
                          <SelectTrigger className="w-full text-center">
                            {getStatusBadge(course.activate || 'Inactive')}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Kích hoạt</SelectItem>
                            <SelectItem value="Inactive">Hủy kích hoạt</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-600 text-center">
                        {formatDate(course.createdAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          className="gap-2 hover:bg-pink-50 hover:text-pink-600 text-sm"
                          onClick={() => handleViewLessons(course.id)}
                        >
                          <FileVideo className="h-4 w-4" />
                          Xem bài học
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/reviews/${course.id}`)}
                            className="h-8 px-2"
                          >
                            <FaComment className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {/* Phân trang */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg font-medium border ${currentPage === 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 border-gray-400'}`}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg font-medium border ${currentPage === page ? 'bg-pink-500 text-white border-pink-500' : 'text-gray-700 hover:bg-gray-200 border-gray-300'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg font-medium border ${currentPage === totalPages ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 border-gray-400'}`}
            >
              Sau
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;