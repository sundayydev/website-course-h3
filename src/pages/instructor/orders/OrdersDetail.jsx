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
import { formatDate } from '../../../utils/formatDate';
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

      // Lấy fullName, title và urlImage cho từng đơn hàng
      const enrichedOrders = await Promise.all(
        ordersData.map(async (order) => {
          let fullName = 'Không xác định';
          let title = 'Không xác định';
          let urlImage = '/default-image.jpg'; // Giá trị mặc định nếu không có urlImage
          let courseId = null;

          // Lấy fullName từ order.user.fullName
          if (order.user && order.user.fullName) {
            fullName = order.user.fullName;
          }

          // Lấy courseId từ orderDetails (lấy courseId đầu tiên nếu có nhiều)
          if (order.orderDetails && order.orderDetails.length > 0) {
            courseId = order.orderDetails[0].courseId;
            console.log('courseId', courseId);
          }

          // Lấy title và urlImage từ courseId
          if (courseId) {
            try {
              const courseResponse = await getCourseById(courseId);
              console.log('courseResponse', courseResponse);
              title = courseResponse.title || 'Không xác định';
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
      statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Không xác định</Badge>;
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary">Đang chờ</Badge>;
      case 'tracking':
        return <Badge variant="default">Đang theo dõi</Badge>;
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
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="tracking">Đang theo dõi</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
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
                    <TableHead className="w-[10%] text-pink-500">ID</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Họ tên</TableHead>
                    <TableHead className="w-[20%] text-pink-500">Khóa học</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Số tiền</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Phương thức</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Trạng thái</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Ngày tạo</TableHead>
                    <TableHead className="w-[20%] text-pink-500">Thao tác</TableHead>
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
                          value={order.status?.toLowerCase() || 'pending'}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            {getStatusBadge(order.status)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Đang chờ</SelectItem>
                            <SelectItem value="tracking">Đang theo dõi</SelectItem>
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
            <Button variant="outline" onClick={handlePreviousPage} disabled={pageNumber === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Trang trước
            </Button>
            <span>
              Trang {pageNumber} / {totalPages}
            </span>
            <Button variant="outline" onClick={handleNextPage} disabled={pageNumber === totalPages}>
              Trang sau
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
              Chi tiết đơn hàng
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">ID:</span>
                      <span className="text-gray-900">{selectedOrder.id || 'Không xác định'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Số tiền:</span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(selectedOrder.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Phương thức:</span>
                      <span className="text-gray-900">VNPay</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Trạng thái:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Ngày tạo:</span>
                      <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khóa học</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Họ tên:</span>
                      <span className="text-gray-900">{selectedOrder.fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-600 mb-2">Khóa học:</span>
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
