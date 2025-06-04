import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Thêm useSearchParams
import { FaArrowLeft } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import { isSameDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { getAllEmails } from '../../../api/emailApi';
import { formatDate } from '../../../utils/formatDate';

// Ánh xạ sourceType và status sang tiếng Việt
const typeLabels = {
  Assignment: 'Bài tập',
  PasswordReset: 'Đặt lại mật khẩu',
  Contact: 'Liên hệ',
  Payment: 'Thanh toán',
};

const statusLabels = {
  Sent: 'Đã gửi',
  Draft: 'Bản nháp',
  Failed: 'Thất bại',
  Pending: 'Đang chờ',
};

function EmailManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Thêm useSearchParams
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Khởi tạo state từ query parameters
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    const type = searchParams.get('type') || 'all';
    const date = searchParams.get('date') || 'all';
    const search = searchParams.get('search') || '';

    setCurrentPage(page);
    setTypeFilter(type);
    setDateFilter(date);
    setSearchTerm(search);
  }, [searchParams]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const emailData = await getAllEmails();
      emailData.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
      setEmails(emailData);
    } catch (err) {
      setError('Không thể tải danh sách email. Vui lòng thử lại sau.');
      toast.error('Không thể tải dữ liệu');
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Cập nhật query parameters khi các bộ lọc thay đổi
  const updateSearchParams = (updates) => {
    const currentParams = Object.fromEntries(searchParams);
    setSearchParams({
      ...currentParams,
      ...updates,
    });
  };

  const isToday = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') {
      console.warn('Invalid date input:', dateStr);
      return false;
    }
    try {
      const emailDate = new Date(dateStr);
      if (isNaN(emailDate.getTime())) {
        console.warn('Failed to parse date:', dateStr);
        return false;
      }
      return isSameDay(emailDate, new Date());
    } catch (e) {
      console.warn('Date parsing error:', dateStr, e);
      return false;
    }
  };

  const isThisWeek = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') {
      console.warn('Invalid date input:', dateStr);
      return false;
    }
    try {
      const emailDate = new Date(dateStr);
      if (isNaN(emailDate.getTime())) {
        console.warn('Failed to parse date:', dateStr);
        return false;
      }
      const today = new Date();
      return isWithinInterval(emailDate, {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      });
    } catch (e) {
      console.warn('Date parsing error:', dateStr, e);
      return false;
    }
  };

  const isThisMonth = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') {
      console.warn('Invalid date input:', dateStr);
      return false;
    }
    try {
      const emailDate = new Date(dateStr);
      if (isNaN(emailDate.getTime())) {
        console.warn('Failed to parse date:', dateStr);
        return false;
      }
      const today = new Date();
      return isWithinInterval(emailDate, {
        start: startOfMonth(today),
        end: endOfMonth(today),
      });
    } catch (e) {
      console.warn('Date parsing error:', dateStr, e);
      return false;
    }
  };

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      (email.subject?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        email.senderEmail?.toLowerCase()?.includes(searchTerm.toLowerCase())) ??
      true;
    const matchesType = typeFilter === 'all' || email.sourceType === typeFilter;
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && isToday(email.sentAt)) ||
      (dateFilter === 'week' && isThisWeek(email.sentAt)) ||
      (dateFilter === 'month' && isThisMonth(email.sentAt));
    return matchesSearch && matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateSearchParams({ page });
    }
  };

  // Cập nhật query params khi các bộ lọc thay đổi
  useEffect(() => {
    updateSearchParams({
      page: currentPage,
      type: typeFilter,
      date: dateFilter,
      search: searchTerm,
    });
  }, [currentPage, typeFilter, dateFilter, searchTerm]);

  const totalEmails = emails.length;
  const sentEmails = emails.filter((e) => e.status === 'Sent').length;
  const recentEmails = emails.filter((e) => isThisWeek(e.sentAt)).length;

  const renderEmail = (email) => (
    <TableRow key={email.id}>
      <TableCell>{email.id}</TableCell>
      <TableCell>{email.senderEmail}</TableCell>
      <TableCell>{email.receiverEmail}</TableCell>
      <TableCell>{email.subject}</TableCell>
      <TableCell>{typeLabels[email.sourceType] || 'Không có'}</TableCell>
      <TableCell>{formatDate(email.sentAt)}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/admin/email/${email.id}`)}
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
        >
          <Eye className="h-6 w-6" />
        </Button>
      </TableCell>
    </TableRow>
  );

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
            Quản lý Email
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tổng số email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{totalEmails}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Email đã gửi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{sentEmails}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Email mới (tuần này)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{recentEmails}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc người gửi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo loại email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="Assignment">Bài tập</SelectItem>
                <SelectItem value="PasswordReset">Đặt lại mật khẩu</SelectItem>
                <SelectItem value="Contact">Liên hệ</SelectItem>
                <SelectItem value="Payment">Thanh toán</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
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

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {!loading && error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách email</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Thời gian gửi</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmails.length > 0 ? (
                  paginatedEmails.map(email => renderEmail(email))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không có email nào phù hợp
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
}

export default EmailManagement;