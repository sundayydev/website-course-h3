import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Import các components UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Import các icons
import { 
  Loader2, 
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2
} from 'lucide-react';

import { getAllOrders, updateOrderStatus, deleteOrder } from '@/api/orderApi';

const PaymentManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [pageNumber]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders({ pageNumber, pageSize });
      setOrders(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    await updateOrderStatus(orderId, newStatus);
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success('Cập nhật trạng thái thành công');
  } catch (error) {
    const errorMessage = error.response?.data || 'Cập nhật trạng thái thất bại';
    toast.error(`Lỗi: ${errorMessage}`);
    console.error('Error:', error);
  }
};

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      return;
    }
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      toast.success('Xóa đơn hàng thành công');
    } catch (error) {
      toast.error('Xóa đơn hàng thất bại');
      console.error('Error:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.userId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.courseId.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                        (dateFilter === 'today' && isToday(order.createdAt)) ||
                        (dateFilter === 'week' && isThisWeek(order.createdAt)) ||
                        (dateFilter === 'month' && isThisMonth(order.createdAt));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const isToday = (date) => {
    const today = new Date();
    const orderDate = new Date(date);
    return orderDate.toDateString() === today.toDateString();
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const orderDate = new Date(date);
    const diffTime = Math.abs(today - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isThisMonth = (date) => {
    const today = new Date();
    const orderDate = new Date(date);
    return orderDate.getMonth() === today.getMonth() && 
           orderDate.getFullYear() === today.getFullYear();
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary">Đang chờ</Badge>;
      case 'paid':
        return <Badge variant="default">Hoàn thành</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-[calc(1500px-250px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên người dùng hoặc khóa học"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Pending">Đang chờ</SelectItem>
                <SelectItem value="Paid">Hoàn thành</SelectItem>
                <SelectItem value="Cancelled">Thất bại</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%] text-pink-500">ID</TableHead>
                <TableHead className="w-[20%] text-pink-500">Người dùng</TableHead>
                <TableHead className="w-[15%] text-pink-500">Khóa học</TableHead>
                <TableHead className="w-[10%] text-pink-500">Số tiền</TableHead>
                <TableHead className="w-[10%] text-pink-500">Phương thức</TableHead>
                <TableHead className="w-[15%] text-pink-500">Trạng thái</TableHead>
                <TableHead className="w-[15%] text-pink-500">Ngày tạo</TableHead>
                <TableHead className="w-[15%] text-pink-500">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="truncate max-w-[150px]" title={order.id}>
                    {order.id}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]" title={order.userName || order.userId}>
                    {order.userName || order.userId}
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]" title={order.courseName || order.courseId}>
                    {order.courseName || order.courseId}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    {formatCurrency(order.amount)}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    VNPay
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status.toLowerCase()}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        {getStatusBadge(order.status)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Đang chờ</SelectItem>
                        <SelectItem value="Paid">Hoàn thành</SelectItem>
                        <SelectItem value="Cancelled">Thất bại</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Trang trước
            </Button>
            <span>
              Trang {pageNumber} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={pageNumber === totalPages}
            >
              Trang sau
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button 
              onClick={closeModal} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Người dùng:</strong> {selectedOrder.userName || selectedOrder.userId}</p>
              <p><strong>Khóa học:</strong> {selectedOrder.courseName || selectedOrder.courseId}</p>
              <p><strong>Số tiền:</strong> {formatCurrency(selectedOrder.amount)}</p>
              <p><strong>Phương thức:</strong> VNPay</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
              <p><strong>Ngày tạo:</strong> {formatDate(selectedOrder.createdAt)}</p>
            </div>
            <Button 
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600" 
              onClick={closeModal}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;