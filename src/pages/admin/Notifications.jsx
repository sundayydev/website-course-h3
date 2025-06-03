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
import { Bell, Trash2, Plus, Search, Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getNotifications,
    addNotification,
    deleteNotification,
} from '@/api/notificationApi';
import { getUserById } from '@/api/userApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parse, isSameDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { FaArrowLeft } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

// Ánh xạ giữa type tiếng Anh và tên tiếng Việt
const typeDisplayNames = {
    LessonApproval: 'Phê duyệt bài học',
    NewMessage: 'Tin nhắn mới',
    CourseEnrollment: 'Đăng ký khóa học',
    CourseActivation: 'Khóa học chấp nhận',
    CourseDeactivation: 'Khóa học từ chối',
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [userNames, setUserNames] = useState({});
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [relatedEntityTypeFilter, setRelatedEntityTypeFilter] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const [formData, setFormData] = useState({
        type: 'LessonApproval',
        content: '',
        relatedEntityId: '',
        relatedEntityType: '',
        userIds: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getNotifications();
            response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(response);
            const userIds = [...new Set(response.flatMap(n => n.userNotifications.map(un => un.userId)))];
            await fetchUserNames(userIds);
        } catch (error) {
            toast.error('Không thể tải danh sách thông báo');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserNames = async (userIds) => {
        try {
            const nameMap = {};
            await Promise.all(
                userIds.map(async (userId) => {
                    try {
                        const response = await getUserById(userId);
                        nameMap[userId] = response.data.fullName || response.data.name || 'Không có tên';
                    } catch (error) {
                        console.error(`Lỗi khi lấy tên người dùng ${userId}:`, error);
                        nameMap[userId] = 'Không có tên';
                    }
                })
            );
            setUserNames(nameMap);
        } catch (error) {
            console.error('Lỗi khi lấy tên người dùng:', error);
            toast.error('Không thể tải tên người dùng');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

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

    const resetForm = () => {
        setFormData({
            type: 'LessonApproval',
            content: '',
            relatedEntityId: '',
            relatedEntityType: '',
            userIds: '',
        });
    };

    const isToday = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') {
            console.warn('Ngày không hợp lệ:', dateStr);
            return false;
        }
        try {
            const notificationDate = parse(dateStr, 'dd-MM-yyyy HH:mm:ss', new Date());
            if (isNaN(notificationDate.getTime())) {
                console.warn('Lỗi phân tích ngày:', dateStr);
                return false;
            }
            return isSameDay(notificationDate, new Date());
        } catch (e) {
            console.warn('Lỗi phân tích ngày:', dateStr, e);
            return false;
        }
    };

    const isThisWeek = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') {
            console.warn('Ngày không hợp lệ:', dateStr);
            return false;
        }
        try {
            const notificationDate = parse(dateStr, 'dd-MM-yyyy HH:mm:ss', new Date());
            if (isNaN(notificationDate.getTime())) {
                console.warn('Lỗi phân tích ngày:', dateStr);
                return false;
            }
            const today = new Date();
            return isWithinInterval(notificationDate, {
                start: startOfWeek(today, { weekStartsOn: 1 }),
                end: endOfWeek(today, { weekStartsOn: 1 }),
            });
        } catch (e) {
            console.warn('Lỗi phân tích ngày:', dateStr, e);
            return false;
        }
    };

    const isThisMonth = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') {
            console.warn('Ngày không hợp lệ:', dateStr);
            return false;
        }
        try {
            const notificationDate = parse(dateStr, 'dd-MM-yyyy HH:mm:ss', new Date());
            if (isNaN(notificationDate.getTime())) {
                console.warn('Lỗi phân tích ngày:', dateStr);
                return false;
            }
            const today = new Date();
            return isWithinInterval(notificationDate, {
                start: startOfMonth(today),
                end: endOfMonth(today),
            });
        } catch (e) {
            console.warn('Lỗi phân tích ngày:', dateStr, e);
            return false;
        }
    };

    const filteredNotifications = notifications.filter((notification) => {
        const typeVietnameseName = typeDisplayNames[notification.type] || notification.type;
        const matchesSearch =
            (notification.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                typeVietnameseName.toLowerCase().includes(searchTerm.toLowerCase())) ?? true;
        const matchesType = typeFilter === 'all' || notification.type === typeFilter;
        const matchesRelatedEntityType = relatedEntityTypeFilter === 'all' || notification.relatedEntityType === relatedEntityTypeFilter;
        const matchesDate =
            dateFilter === 'all' ||
            (dateFilter === 'today' && isToday(notification.createdAt)) ||
            (dateFilter === 'week' && isThisWeek(notification.createdAt)) ||
            (dateFilter === 'month' && isThisMonth(notification.createdAt));
        const matchesRead =
            readFilter === 'all' ||
            (readFilter === 'read' && notification.userNotifications.every(un => un.isRead)) ||
            (readFilter === 'unread' && notification.userNotifications.some(un => !un.isRead));
        return matchesSearch && matchesType && matchesRelatedEntityType && matchesDate && matchesRead;
    });

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter, dateFilter, readFilter]);

    const totalNotifications = notifications.length;
    const unreadNotifications = notifications.reduce(
        (count, n) => count + n.userNotifications.filter((un) => !un.isRead).length,
        0
    );
    const recentNotifications = notifications.filter((n) => isThisWeek(n.createdAt)).length;

    // Hàm xác định trạng thái thông báo
    const getNotificationStatus = (notification) => {
        const isRead = notification.userNotifications.every(un => un.isRead);
        const baseClass = "font-medium rounded px-2 py-1 text-sm min-w-[80px] text-center inline-block";

        return isRead ? (
            <span className={`${baseClass} text-green-600 border border-green-600`}>Đã đọc</span>
        ) : (
            <span className={`${baseClass} text-red-600 border border-red-600`}>Chưa đọc</span>
        );
    };


    // Hàm mở dialog chi tiết
    const openDetailDialog = (notification) => {
        setSelectedNotification(notification);
        setIsDetailDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        className="mr-4"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        <FaArrowLeft className="mr-2" /> Quay lại
                    </Button>
                    <h1 className="text-2xl font-bold text-pink-500">
                        Quản lý thông báo
                    </h1>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
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
                                        {Object.entries(typeDisplayNames).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
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
                            <Button type="submit" className="w-full">
                                Thêm mới
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Tổng số thông báo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-pink-500">{totalNotifications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Thông báo chưa đọc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-pink-500">{unreadNotifications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Thông báo mới (tuần này)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-pink-500">{recentNotifications}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Tìm kiếm theo nội dung hoặc loại (tiếng Việt)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Lọc theo loại thông báo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả loại</SelectItem>
                                {Object.entries(typeDisplayNames).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Lọc theo thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả thời gian</SelectItem>
                                <SelectItem value="today">Hôm nay</SelectItem>
                                <SelectItem value="week">Tuần này</SelectItem>
                                <SelectItem value="month">Tháng này</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={readFilter} onValueChange={setReadFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Lọc theo trạng thái đọc" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="read">Đã đọc</SelectItem>
                                <SelectItem value="unread">Chưa đọc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {!loading && !error && (
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách thông báo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Nội dung</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Người nhận</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedNotifications.length > 0 ? (
                                    paginatedNotifications.map((notification) => (
                                        <TableRow key={notification.id}>
                                            <TableCell>{typeDisplayNames[notification.type] || notification.type}</TableCell>
                                            <TableCell>{notification.content}</TableCell>
                                            <TableCell>{formatDate(notification.createdAt)}</TableCell>
                                            <TableCell>{getNotificationStatus(notification)}</TableCell>
                                            <TableCell>
                                                {notification.userNotifications.map((un) => (
                                                    <div key={un.id}>
                                                        {userNames[un.userId] || 'Đang tải...'}
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/notification/${notification.id}`)}
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 mr-2"
                                                >
                                                    <Eye className="h-6 w-6" />
                                                </Button>
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            Không có thông báo nào phù hợp
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4">
                                <Button
                                    disabled={currentPage === 1}
                                    onClick={() => goToPage(currentPage - 1)}
                                    variant="outline"
                                >
                                    Trước
                                </Button>
                                <div className="flex space-x-2">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <Button
                                            key={index + 1}
                                            variant={currentPage === index + 1 ? 'default' : 'outline'}
                                            onClick={() => goToPage(index + 1)}
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    disabled={currentPage === totalPages}
                                    onClick={() => goToPage(currentPage + 1)}
                                    variant="outline"
                                >
                                    Tiếp theo
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}


        </div>
    );
};

export default Notifications;