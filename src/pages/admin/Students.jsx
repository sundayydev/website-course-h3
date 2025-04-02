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
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus, Search, Loader2, Users, Filter, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  uploadAvatar,
  deleteStudent,
} from '@/api/studentAPi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthDate: null,
    avatar: null,
    role: 'student',
  });

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Gọi API lấy danh sách học viên
      const response = await getStudents();
      console.log('Danh sách học viên: ', response);
      setStudents(response);
    } catch (error) {
      toast.error('Không thể tải danh sách học viên');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update student
        console.log('formData: ', formData);
        console.log('editingStudent: ', editingStudent);
        await updateStudent(editingStudent.id, formData);

        if (formData.avatar) {
          await uploadAvatar(editingStudent.id, formData.avatar);
        }
        toast.success('Cập nhật học viên thành công');
      } else {
        const data = await addStudent(formData);
        if (formData.avatar) {
          await uploadAvatar(data.id, formData.avatar);
        }
        toast.success('Thêm học viên thành công');
      }
      setIsDialogOpen(false);
      fetchStudents();
      resetForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error('Error:', error);
    }
  };

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      await deleteStudent(id);
      toast.success('Xóa học viên thành công');
      fetchStudents();
    }
  };

  // Handle edit student
  const handleEdit = async (studentId) => {
    try {
      const response = await getStudentById(studentId);

      setEditingStudent(response);
      setFormData({
        fullName: response.fullName,
        email: response.email,
        birthDate: response.birthDate,
        avatar: response.profileImage,
        status: response.status,
      });
      console.log('Thông tin học viên: ', response);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error('Không thể tải thông tin học viên');
      console.error('Lỗi:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      birthDate: '',
      status: 'active',
      role: 'student',
    });
    setEditingStudent(null);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.birthDate?.includes(searchTerm)
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
          <h1 className="text-2xl font-bold tracking-tight text-pink-500">Quản lý học viên</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi thông tin học viên của bạn</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-pink-500 hover:bg-pink-600 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Thêm học viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Chỉnh sửa học viên' : 'Thêm học viên mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Nhập họ và tên học viên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      id="password"
                      type={formData.showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nhập mật khẩu"
                      disabled={editingStudent}
                      className={editingStudent ? 'bg-gray-100 text-gray-500 w-[250px]' : ''}
                      required={!editingStudent}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                      }
                    >
                      {formData.showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="bg-pink-500 hover:bg-pink-600"
                    onClick={() => {
                      const chars =
                        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                      let randomPassword = '';
                      for (let i = 0; i < 8; i++) {
                        randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                      }
                      setFormData({ ...formData, password: randomPassword });
                    }}
                  >
                    Tạo mật khẩu
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Ngày sinh</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50',
                        !formData.birthDate && 'text-gray-500'
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      {formData.birthDate ? (
                        <span className="flex-1">{format(formData.birthDate, 'dd/MM/yyyy')}</span>
                      ) : (
                        <span className="flex-1">Chọn ngày sinh</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={(date) => {
                        setFormData({ ...formData, birthDate: date });
                      }}
                      initialFocus
                      className="rounded-md border shadow-md"
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Ảnh đại diện</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })}
                      className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-500 transition-colors">
                      <div className="text-gray-600">
                        <svg
                          className="mx-auto h-12 w-12"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-1">Tải ảnh lên hoặc kéo thả vào đây</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                      </div>
                    </div>
                  </div>
                  {(editingStudent || formData.avatar) && (
                    <div className="flex-shrink-0">
                      <img
                        src={
                          editingStudent?.profileImage
                            ? `${API_URL}/${editingStudent.profileImage}`
                            : formData.avatar instanceof File
                              ? URL.createObjectURL(formData.avatar)
                              : formData.avatar
                        }
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className={`w-full ${editingStudent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600'}`}
              >
                {editingStudent ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[calc(1420px-250px)]">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Tổng số học viên</CardTitle>
            <Users className="h-6 w-6 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">{students.length}</div>
            <p className="text-sm text-gray-500 mt-1">Tổng số học viên đã đăng ký</p>
            <div className="mt-2 flex items-center text-sm text-green-500">
              <span className="font-medium">+12%</span>
              <span className="ml-1">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Đang học</CardTitle>
            <Users className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {students.filter((s) => s.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Học viên đang theo học</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${(students.filter((s) => s.status === 'active').length / students.length) * 100}%`}}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Online</CardTitle>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-sm text-green-500">Đang hoạt động</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{students.filter((s) => s.isOnline).length}</div>
            <p className="text-sm text-gray-500 mt-1">Học viên đang trực tuyến</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex -space-x-2">
                {students.filter((s) => s.isOnline).slice(0,3).map((student, index) => (
                  <Avatar key={index} className="border-2 border-white w-6 h-6">
                    <AvatarImage src={`${API_URL}/${student.profileImage}`} />
                    <AvatarFallback>{student.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {students.filter((s) => s.isOnline).length > 3 && (
                <span className="text-sm text-gray-500">+{students.filter((s) => s.isOnline).length - 3} khác</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Danh sách học viên</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm học viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-6 w-6" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-pink-500">Học viên</TableHead>
                  <TableHead className="text-pink-500">Email</TableHead>
                  <TableHead className="text-pink-500">Ngày sinh</TableHead>
                  <TableHead className="text-pink-500">Trạng thái</TableHead>
                  <TableHead className="text-pink-500">Online</TableHead>
                  <TableHead className="text-pink-700 font-semibold text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`${API_URL}/${student.profileImage}`} />
                        <AvatarFallback>
                          {student.fullName?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.fullName}</span>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.birthDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === 'active'
                            ? 'success'
                            : student.status === 'inactive'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {student.status === 'active'
                          ? 'Đang học'
                          : student.status === 'inactive'
                            ? 'Đã nghỉ'
                            : 'Đã tốt nghiệp'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={student.isOnline ? 'success' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            student.isOnline ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                        {student.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(student.id)}
                          className="hover:bg-green-200"
                        >
                          <Pencil className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(student.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
