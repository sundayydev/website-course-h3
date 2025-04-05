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
  Eye
} from 'lucide-react';

// Import các API
import { getAllPayments, updatePaymentStatus } from '@/api/paymentApi';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getAllPayments();
      setPayments(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách thanh toán');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await updatePaymentStatus(paymentId, newStatus);
      setPayments(payments.map(payment => 
        payment._id === paymentId ? { ...payment, status: newStatus } : payment
      ));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại');
      console.error('Error:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && isToday(payment.createdAt)) ||
                       (dateFilter === 'week' && isThisWeek(payment.createdAt)) ||
                       (dateFilter === 'month' && isThisMonth(payment.createdAt));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const isToday = (date) => {
    const today = new Date();
    const paymentDate = new Date(date);
    return paymentDate.toDateString() === today.toDateString();
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const paymentDate = new Date(date);
    const diffTime = Math.abs(today - paymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isThisMonth = (date) => {
    const today = new Date();
    const paymentDate = new Date(date);
    return paymentDate.getMonth() === today.getMonth() && 
           paymentDate.getFullYear() === today.getFullYear();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Đang chờ</Badge>;
      case 'completed':
        return <Badge variant="default">Hoàn thành</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      case 'refunded':
        return <Badge variant="outline">Đã hoàn tiền</Badge>;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý thanh toán</h1>
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
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
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
          <CardTitle>Danh sách thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment._id}</TableCell>
                  <TableCell>{payment.userName}</TableCell>
                  <TableCell>{payment.courseName}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Select
                      value={payment.status}
                      onValueChange={(value) => handleStatusChange(payment._id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        {getStatusBadge(payment.status)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Đang chờ</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
                        <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement; 