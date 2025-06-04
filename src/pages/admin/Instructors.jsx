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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  uploadAvatar,
  deleteInstructor,
} from '@/api/instructorApi';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthDate: null,
    avatar: null,
    role: 'Instructor',
    status: 'Active', // Thêm trường status
    showPassword: false,
  });

  // Fetch instructors data
  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await getInstructors();
      const updatedInstructors = response.map((instructor) => ({
        ...instructor,
        status: instructor.status || 'Active', // Mặc định Active nếu không có status
      }));
      setInstructors(updatedInstructors);
    } catch (error) {
      toast.error('Không thể tải danh sách giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInstructor) {
        await updateInstructor(editingInstructor.id, formData);
        if (formData.avatar instanceof File) {
          await uploadAvatar(editingInstructor.id, formData.avatar);
        }
        toast.success('Cập nhật giảng viên thành công');
      } else {
        const data = await createInstructor(formData);
        if (formData.avatar instanceof File) {
          await uploadAvatar(data.id, formData.avatar);
        }
        toast.success('Thêm giảng viên thành công');
      }
      setIsDialogOpen(false);
      fetchInstructors();
      resetForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Handle delete instructor
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      try {
        await deleteInstructor(id);
        toast.success('Xóa giảng viên thành công');
        fetchInstructors();
      } catch (error) {
        toast.error('Không thể xóa giảng viên');
      }
    }
  };

  // Handle edit instructor
  const handleEdit = async (instructorId) => {
    try {
      const response = await getInstructorById(instructorId);
      setEditingInstructor(response);
      setFormData({
        fullName: response.fullName || '',
        email: response.email || '',
        birthDate: response.birthDate ? new Date(response.birthDate) : null,
        avatar: response.profileImage || null,
        role: 'Instructor',
        status: response.status || 'Active',
        showPassword: false,
      });
      setIsDialogOpen(true);
    } catch (error) {
      toast.error('Không thể tải thông tin giảng viên');
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
      role: 'Instructor',
      status: 'Active',
      showPassword: false,
    });
    setEditingInstructor(null);
  };

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.birthDate?.includes(searchTerm)
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
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-pink-500">Quản lý giảng viên</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi thông tin giảng viên của bạn</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-pink-500 hover:bg-pink-600 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Thêm giảng viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingInstructor ? 'Chỉnh sửa giảng viên' : 'Thêm giảng viên mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Nhập họ và tên giảng viên"
                  className="w-full"
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Mật khẩu</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={formData.showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nhập mật khẩu"
                      disabled={editingInstructor}
                      className={`w-full ${editingInstructor ? 'bg-gray-100 text-gray-500' : ''}`}
                      required={!editingInstructor}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                      }
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
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Active">Đang làm việc</option>
                  <option value="Inactive">Tạm nghỉ</option>
                </select>
              </div>
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
                  {(editingInstructor || formData.avatar) && (
                    <div className="flex-shrink-0">
                      <img
                        src={
                          editingInstructor?.profileImage
                            ? editingInstructor.profileImage
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
                className={`w-full ${editingInstructor ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600'}`}
              >
                {editingInstructor ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[calc(1420px-250px)]">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Tổng số giảng viên</CardTitle>
            <Users className="h-6 w-6 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">{instructors.length}</div>
            <p className="text-sm text-gray-500 mt-1">Tổng số giảng viên đã đăng ký</p>
            <div className="mt-2 flex items-center text-sm text-green-500">
              <span className="font-medium">+5%</span>
              <span className="ml-1">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Đang làm việc</CardTitle>
            <Users className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {instructors.filter((i) => i.status === 'Active').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Giảng viên đang làm việc</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${instructors.length > 0
                    ? (instructors.filter((i) => i.status === 'Active').length / instructors.length) * 100
                    : 0
                    }%`,
                }}
              ></div>
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
            <div className="text-2xl font-bold text-blue-500">0</div>
            <p className="text-sm text-gray-500 mt-1">Giảng viên đang trực tuyến</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-500">Không có giảng viên trực tuyến</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Danh sách giảng viên</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm giảng viên..."
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
                  <TableHead className="text-pink-500 font-semibold">Giảng viên</TableHead>
                  <TableHead className="text-pink-500 font-semibold">Email</TableHead>
                  <TableHead className="text-pink-500 font-semibold">Ngày sinh</TableHead>

                  <TableHead className="text-pink-500 font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={instructor.profileImage || null} />
                        <AvatarFallback>{instructor.fullName?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                      </Avatar>
                      <span>{instructor.fullName}</span>
                    </TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>
                      {instructor.birthDate ? format(new Date(instructor.birthDate), 'dd/MM/yyyy') : 'Chưa có'}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(instructor.id)}
                          className="hover:bg-green-200 text-green-600"
                        >
                          <Pencil className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(instructor.id)}
                          className="hover:bg-red-100 text-red-500"
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

export default Instructors;