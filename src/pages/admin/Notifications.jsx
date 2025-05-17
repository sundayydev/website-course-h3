// src/pages/Notifications.jsx
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
import { Bell, Trash2, Plus, Search, Loader2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getNotifications,
    addNotification,
    deleteNotification,
} from '@/api/notificationApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'LessonApproval',
        content: '',
        relatedEntityId: '',
        relatedEntityType: '',
        userIds: '',
    });

    // Lấy danh sách thông báo
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            console.log('Danh sách thông báo:', response);
            setNotifications(response);
        } catch (error) {
            toast.error('Không thể tải danh sách thông báo');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) {
            toast.error('Vui lòng nhập nội dung thông báo');
            return;
        }
        const userIdsArray = formData.userIds.split(',').map((id) => id.trim()).filter((id) => id);
        if (userIdsArray.length === 0) {
            toast.error('Vui lòng nhập ít nhất một ID người dùng');
            return;
        }
        const isValidGuid = (id) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
        if (!userIdsArray.every(isValidGuid)) {
            toast.error('ID người dùng phải là định dạng Guid hợp lệ');
            return;
        }
        // Kiểm tra relatedEntityId nếu có
        if (formData.relatedEntityId && !isValidGuid(formData.relatedEntityId)) {
            toast.error('RelatedEntityId phải là định dạng Guid hợp lệ (ví dụ: 123e4567-e89b-12d3-a456-426614174000)');
            return;
        }
        if ((formData.relatedEntityId && !formData.relatedEntityType) || (!formData.relatedEntityId && formData.relatedEntityType)) {
            toast.error('RelatedEntityId và RelatedEntityType phải cùng được cung cấp hoặc cùng rỗng');
            return;
        }

        try {
            const notificationData = {
                type: formData.type,
                content: formData.content,
                relatedEntityId: formData.relatedEntityId || null,
                relatedEntityType: formData.relatedEntityType || null,
                userIds: userIdsArray,
            };
            await addNotification(notificationData);
            toast.success('Thêm thông báo thành công');
            setIsDialogOpen(false);
            fetchNotifications();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm thông báo');
        }
    };

    // Xử lý xóa thông báo
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            try {
                await deleteNotification(id);
                toast.success('Xóa thông báo thành công');
                fetchNotifications();
            } catch (error) {
                toast.error('Không thể xóa thông báo');
                console.error('Error:', error);
            }
        }
    };

    // Đặt lại form
    const resetForm = () => {
        setFormData({
            type: 'LessonApproval',
            content: '',
            relatedEntityId: '',
            relatedEntityType: '',
            userIds: '',
        });
    };

    // Lọc thông báo dựa trên tìm kiếm
    const filteredNotifications = notifications.filter(
        (notification) =>
            notification.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.type?.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Phần tiêu đề */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-pink-500">Quản lý thông báo</h1>
                    <p className="text-muted-foreground">Quản lý và gửi thông báo đến người dùng</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="bg-pink-500 hover:bg-pink-600 flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm thông báo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Thêm thông báo mới</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Loại thông báo</Label>
                                <Select
                                    id="type"
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại thông báo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LessonApproval">Phê duyệt bài học</SelectItem>
                                        <SelectItem value="NewMessage">Tin nhắn mới</SelectItem>
                                        <SelectItem value="CourseEnrollment">Đăng ký khóa học</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Nội dung</Label>
                                <Input
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    placeholder="Nhập nội dung thông báo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="relatedEntityId">ID thực thể liên quan (tùy chọn)</Label>
                                <Input
                                    id="relatedEntityId"
                                    type="text"
                                    value={formData.relatedEntityId}
                                    onChange={(e) => setFormData({ ...formData, relatedEntityId: e.target.value })}
                                    placeholder="Nhập ID thực thể (chuỗi)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="relatedEntityType">Loại thực thể liên quan (tùy chọn)</Label>
                                <Input
                                    id="relatedEntityType"
                                    value={formData.relatedEntityType}
                                    onChange={(e) => setFormData({ ...formData, relatedEntityType: e.target.value })}
                                    placeholder="Nhập loại thực thể"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="userIds">ID người dùng (phân tách bằng dấu phẩy, định dạng Guid)</Label>
                                <Input
                                    id="userIds"
                                    value={formData.userIds}
                                    onChange={(e) => setFormData({ ...formData, userIds: e.target.value })}
                                    required
                                    placeholder="Ví dụ: 123e4567-e89b-12d3-a456-426614174000,987fcdeb-1234-5678-9abc-def123456789"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
                                Thêm mới
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Thẻ thống kê */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[calc(1420px-250px)]">
                <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-pink-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Tổng số thông báo</CardTitle>
                        <Bell className="h-6 w-6 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-pink-500">{notifications.length}</div>
                        <p className="text-sm text-gray-500 mt-1">Tổng số thông báo đã gửi</p>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Thông báo chưa đọc</CardTitle>
                        <Bell className="h-6 w-6 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {notifications.reduce(
                                (count, n) => count + n.userNotifications.filter((un) => !un.isRead).length,
                                0
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Thông báo chưa được người dùng đọc</p>
                    </CardContent>
                </Card>
            </div>

            {/* Nội dung chính */}
            <Card className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">Danh sách thông báo</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Tìm kiếm thông báo..."
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
                                    <TableHead className="text-pink-500">Loại</TableHead>
                                    <TableHead className="text-pink-500">Nội dung</TableHead>
                                    <TableHead className="text-pink-500">Ngày tạo</TableHead>
                                    <TableHead className="text-pink-500">Người nhận</TableHead>
                                    <TableHead className="text-pink-500">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNotifications.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell>{notification.type}</TableCell>
                                        <TableCell>{notification.content}</TableCell>
                                        <TableCell>{notification.createdAt}</TableCell>
                                        <TableCell>
                                            {notification.userNotifications.map((un) => (
                                                <div key={un.id}>
                                                    User ID: {un.userId} ({un.isRead ? 'Đã đọc' : 'Chưa đọc'})
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                            >
                                                <Trash2 className="h-6 w-6" />
                                            </Button>
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

export default Notifications;