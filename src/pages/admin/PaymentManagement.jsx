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
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

import { getAllOrders, updateOrderStatus } from '@/api/orderApi';

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
    setLoading(true);
    try {
      const response = await getAllOrders({ pageNumber, pageSize });
      setOrders(Array.isArray(response.data) ? response.data : []);
      setTotalPages(Number.isInteger(response.totalPages) ? response.totalPages : 1);
    } catch (error) {
      const errorMessage = error.message || 'Không thể tải danh sách đơn hàng';
      toast.error(errorMessage);
      console.error('Lỗi khi lấy đơn hàng:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
          orders.map((order) =>
              order.id === orderId ? { ...order, status: newStatus } : order
          )
      );
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      const errorMessage = error.message || 'Cập nhật trạng thái thất bại';
      toast.error(`Lỗi: ${errorMessage}`);
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
        (order.userName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            order.courseName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            order.userId?.toString().toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            order.courseId?.toString().toLowerCase()?.includes(searchTerm.toLowerCase())) ??
        true;
    const matchesStatus =
        statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && isToday(order.createdAt)) ||
        (dateFilter === 'week' && isThisWeek(order.createdAt)) ||
        (dateFilter === 'month' && isThisMonth(order.createdAt));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    const orderDate = new Date(date);
    return orderDate.toDateString() === today.toDateString();
  };

  const isThisWeek = (date) => {
    if (!date) return false;
    const today = new Date();
    const orderDate = new Date(date);
    const diffTime = Math.abs(today - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isThisMonth = (date) => {
    if (!date) return false;
    const today = new Date();
    const orderDate = new Date(date);
    return (
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
    );
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Không xác định</Badge>;
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
      currency: 'VND',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Không xác định';
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          <span className="ml-2">Đang tải dữ liệu...</span>
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
                  <SelectItem value="pending">Đang chờ</SelectItem>
                  <SelectItem value="paid">Hoàn thành</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
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
            {filteredOrders.length === 0 ? (
                <div className="text-center py-4">Không có đơn hàng nào phù hợp</div>
            ) : (
                <>
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
                            <TableCell
                                className="truncate max-w-[200px]"
                                title={order.userName || order.userId || 'Không xác định'}
                            >
                              {order.userName || order.userId || 'Không xác định'}
                            </TableCell>
                            <TableCell
                                className="truncate max-w-[150px]"
                                title={order.courseName || order.courseId || 'Không xác định'}
                            >
                              {order.courseName || order.courseId || 'Không xác định'}
                            </TableCell>
                            <TableCell className="truncate max-w-[100px]">
                              {formatCurrency(order.amount)}
                            </TableCell>
                            <TableCell className="truncate max-w-[100px]">
                              VNPay
                            </TableCell>
                            <TableCell>
                              <Select
                                  value={order.status?.toLowerCase() || 'pending'}
                                  onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-[180px]">
                                  {getStatusBadge(order.status)}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Đang chờ</SelectItem>
                                  <SelectItem value="paid">Hoàn thành</SelectItem>
                                  <SelectItem value="failed">Thất bại</SelectItem>
                                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="truncate max-w-[150px]">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetails(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
            )}
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
                  <p><strong>ID:</strong> {selectedOrder.id || 'Không xác định'}</p>
                  <p>
                    <strong>Người dùng:</strong>{' '}
                    {selectedOrder.userName || selectedOrder.userId || 'Không xác định'}
                  </p>
                  <p>
                    <strong>Khóa học:</strong>{' '}
                    {selectedOrder.courseName || selectedOrder.courseId || 'Không xác định'}
                  </p>
                  <p><strong>Số tiền:</strong> {formatCurrency(selectedOrder.amount)}</p>
                  <p><strong>Phương thức:</strong> VNPay</p>
                  <p><strong>Trạng thái:</strong> {selectedOrder.status || 'Không xác định'}</p>
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