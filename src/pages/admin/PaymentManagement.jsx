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
import { Loader2, Search, Download, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { getAllOrders, updateOrderStatus } from '@/api/orderApi';
import { getCourseById } from '@/api/courseApi';

const OrdersDetail = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
      const ordersData = Array.isArray(response.data) ? response.data : [];

      const enrichedOrders = await Promise.all(
        ordersData.map(async (order) => {
          let fullName = 'Không Xác Định';
          let title = 'Không Xác Định';
          let urlImage = '/default-image.jpg';
          let courseId = null;

          if (order.user && order.user.fullName) {
            fullName = order.user.fullName;
          }

          if (order.orderDetails && order.orderDetails.length > 0) {
            courseId = order.orderDetails[0].courseId;
            console.log('courseId', courseId);
          }

          if (courseId) {
            try {
              const courseResponse = await getCourseById(courseId);
              console.log('courseResponse', courseResponse);
              title = courseResponse.title || 'Không Xác Định';
              urlImage = courseResponse.urlImage || '';
            } catch (error) {
              console.error(`Lỗi khi lấy thông tin khóa học ${courseId}:`, error);
            }
          }

          return { ...order, fullName, title, urlImage };
        })
      );

      setOrders(enrichedOrders);
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
    let confirmMessage = '';
    if (newStatus === 'Cancelled') {
      confirmMessage = 'Bạn có chắc muốn hủy đơn hàng này? Thao tác này sẽ xóa đăng ký khóa học liên quan.';
    } else if (newStatus === 'Failed' || newStatus === 'Pending') {
      confirmMessage = `Bạn có chắc muốn chuyển trạng thái thành ${newStatus === 'Failed' ? 'Thất Bại' : 'Đang Chờ'}? Đăng ký khóa học liên quan sẽ được đánh dấu là Thất Bại.`;
    } else {
      confirmMessage = `Bạn có chắc muốn cập nhật trạng thái thành ${newStatus === 'Paid' ? 'Đã Thanh Toán' : newStatus}?`;
    }

    const confirmChange = window.confirm(confirmMessage);
    if (!confirmChange) {
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
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
      (order.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order.title?.toLowerCase()?.includes(searchTerm.toLowerCase())) ??
      true;
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Không Xác Định</Badge>;
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Đã Thanh Toán</Badge>;
      case 'Pending':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Đang Chờ</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Đã Hủy</Badge>;
      case 'Failed':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Thất Bại</Badge>;
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
      <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
        <div className="flex items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
          <span className="text-lg font-medium text-gray-800">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Đơn Hàng</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo họ tên hoặc tiêu đề khóa học"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc Theo Trạng Thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                <SelectItem value="Paid">Đã Thanh Toán</SelectItem>
                <SelectItem value="Pending">Đang Chờ</SelectItem>
                <SelectItem value="Cancelled">Đã Hủy</SelectItem>
                <SelectItem value="Failed">Thất Bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Đơn Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-4">Không có đơn hàng nào phù hợp</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%] text-pink-500">Mã Đơn Hàng</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Họ Tên</TableHead>
                    <TableHead className="w-[20%] text-pink-500">Khóa Học</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Số Tiền</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Phương Thức</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Trạng Thái</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Ngày Tạo</TableHead>
                    <TableHead className="w-[20%] text-pink-500">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="truncate max-w-[150px]" title={order.id}>
                        {order.id}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]" title={order.fullName}>
                        {order.fullName}
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]" title={order.title}>
                        {order.title}
                      </TableCell>
                      <TableCell className="truncate max-w-[100px]">
                        {formatCurrency(order.amount)}
                      </TableCell>
                      <TableCell className="truncate max-w-[100px]">VNPay</TableCell>
                      <TableCell>
                        <Select
                          value={order.status || 'Pending'}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            {getStatusBadge(order.status)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Paid">Đã Thanh Toán</SelectItem>
                            <SelectItem value="Pending">Đang Chờ</SelectItem>
                            <SelectItem value="Cancelled">Đã Hủy</SelectItem>
                            <SelectItem value="Failed">Thất Bại</SelectItem>
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
            <Button variant="outline" onClick={handlePreviousPage} disabled={pageNumber === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Trang Trước
            </Button>
            <span>
              Trang {pageNumber} / {totalPages}
            </span>
            <Button variant="outline" onClick={handleNextPage} disabled={pageNumber === totalPages}>
              Trang Sau
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl relative transition-all duration-300 transform hover:scale-102">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-pink-500 pb-2">
              Chi Tiết Đơn Hàng
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Đơn Hàng</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Mã Đơn Hàng:</span>
                      <span className="text-gray-900">{selectedOrder.id || 'Không Xác Định'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Số Tiền:</span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(selectedOrder.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Phương Thức:</span>
                      <span className="text-gray-900">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Trạng Thái:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Ngày Tạo:</span>
                      <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Khóa Học</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Họ Tên:</span>
                      <span className="text-gray-900">{selectedOrder.fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-600 mb-2">Khóa Học:</span>
                      <span className="text-gray-900">{selectedOrder.title}</span>
                      {selectedOrder.urlImage && (
                        <img
                          src={selectedOrder.urlImage}
                          alt={selectedOrder.title || 'Hình ảnh khóa học'}
                          className="mt-3 w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg transition-colors duration-200"
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

export default OrdersDetail;