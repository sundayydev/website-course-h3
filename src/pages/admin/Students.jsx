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
import { Pencil, Trash2, Plus, Search, Loader2, Eye, EyeOff, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  uploadAvatar,
  deleteStudent,
} from '@/api/studentApi';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthDate: null,
    avatar: null,
    role: 'Student',
    phone: '',
    showPassword: false,
  });

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      console.log(response);
      setStudents(response);
    } catch (error) {
      toast.error(error.message || 'Không thể tải danh sách học viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const studentData = {
        fullName: formData.fullName,
        email: formData.email,
      };

      // Chỉ thêm các trường nếu có giá trị
      if (formData.password) {
        studentData.password = formData.password;
      }
      if (formData.birthDate) {
        studentData.birthDate = formData.birthDate.toISOString().split('T')[0];
      }
      if (formData.phone) {
        studentData.phone = formData.phone;
      }

      let newStudent;
      if (editingStudent) {
        // Cập nhật học viên
        newStudent = await updateStudent(editingStudent.id, studentData);
        // Tải lên ảnh nếu có
        if (formData.avatar instanceof File) {
          const uploadResult = await uploadAvatar(formData.avatar);
          if (uploadResult.url) {
            await updateStudent(editingStudent.id, {
              ...studentData,
              profileImage: uploadResult.url,
            });
          }
        }
        toast.success('Cập nhật học viên thành công');
      } else {
        // Thêm học viên mới
        if (!formData.password) {
          throw new Error('Mật khẩu là bắt buộc khi tạo mới');
        }
        newStudent = await addStudent({
          ...studentData,
          role: formData.role,
        });
        // Tải lên ảnh nếu có
        if (formData.avatar instanceof File) {
          const uploadResult = await uploadAvatar(formData.avatar);
          if (uploadResult.url) {
            await updateStudent(newStudent.id, {
              ...studentData,
              profileImage: uploadResult.url,
            });
          }
        }
        toast.success('Thêm học viên thành công');
      }

      setIsDialogOpen(false);
      fetchStudents();
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể thực hiện thao tác';
      toast.error(errorMessage);
      console.error('Lỗi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      try {
        await deleteStudent(id);
        toast.success('Xóa học viên thành công');
        fetchStudents();
      } catch (error) {
        toast.error(error.message || 'Không thể xóa học viên');
      }
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
        password: '',
        birthDate: response.birthDate ? new Date(response.birthDate) : null,
        avatar: response.profileImage,
        role: response.role,
        phone: response.phone || '',
        showPassword: false,
      });
      setIsDialogOpen(true);
    } catch (error) {
      toast.error(error.message || 'Không thể tải thông tin học viên');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      birthDate: null,
      avatar: null,
      role: 'Student',
      phone: '',
      showPassword: false,
    });
    setEditingStudent(null);
  };

  // Format birth date for display
  const formatBirthDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
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
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Chỉnh sửa học viên' : 'Thêm học viên mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Nhập họ và tên học viên"
                      className="w-full"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="example@email.com"
                      className="w-full"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mật khẩu {editingStudent ? '(để trống nếu không đổi)' : ''}
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="password"
                          type={formData.showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={editingStudent ? 'Nhập mật khẩu mới (nếu có)' : 'Nhập mật khẩu'}
                          required={!editingStudent}
                          className="w-full"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
                        >
                          {formData.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="bg-pink-500 hover:bg-pink-600 whitespace-nowrap"
                        onClick={() => {
                          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                          const randomPassword = Array.from({ length: 8 }, () =>
                            chars.charAt(Math.floor(Math.random() * chars.length))
                          ).join('');
                          setFormData({ ...formData, password: randomPassword });
                        }}
                      >
                        Tạo mật khẩu
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className="w-full"
                    />
                  </div>

                  {/* Birth Date Field */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium">Ngày sinh</Label>
                    <div className="relative">
                      <DatePicker
                        id="birthDate"
                        selected={formData.birthDate}
                        onChange={(date) => setFormData({ ...formData, birthDate: date })}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày sinh"
                        className="w-full pl-10 pr-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        maxDate={new Date()}
                        minDate={new Date('1900-01-01')}
                        showYearDropdown
                        yearDropdownItemNumber={100}
                        scrollableYearDropdown
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>

                  {/* Avatar Field */}
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-sm font-medium">Ảnh đại diện</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
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
                      {(editingStudent?.profileImage || formData.avatar) && (
                        <div className="flex-shrink-0">
                          <img
                            src={
                              editingStudent?.profileImage ||
                              (formData.avatar instanceof File
                                ? URL.createObjectURL(formData.avatar)
                                : formData.avatar)
                            }
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${editingStudent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600'}`}
              >
                {isSubmitting ? 'Đang xử lý...' : (editingStudent ? 'Cập nhật' : 'Thêm mới')}
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
                  <TableHead className="text-pink-500">Số điện thoại</TableHead>
                  <TableHead className="text-pink-500">Ngày sinh</TableHead>
                  <TableHead className="text-pink-500">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.profileImage || null} />
                        <AvatarFallback>
                          {student.fullName?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.fullName}</span>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone || '-'}</TableCell>
                    <TableCell>{formatBirthDate(student.birthDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
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