import React, { useState, useEffect } from 'react';
import { getCategories, updateCategory, createCategory, deleteCategory } from '@/api/categoryApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Pencil, Plus, Trash } from 'lucide-react';
import { parse, isSameDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/formatDate';
const PageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [addForm, setAddForm] = useState({ name: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        data.sort((a, b) => new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date()));
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách danh mục.');
        toast.error('Không thể tải dữ liệu');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const isToday = (date) => {
    if (!date || typeof date !== 'string') return false;
    try {
      const categoryDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
      return isSameDay(categoryDate, new Date());
    } catch (e) {
      console.warn('Lỗi định dạng ngày:', date, e);
      return false;
    }
  };

  const isThisWeek = (date) => {
    if (!date || typeof date !== 'string') return false;
    try {
      const categoryDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
      return isWithinInterval(categoryDate, {
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
      });
    } catch (e) {
      console.warn('Lỗi định dạng ngày:', date, e);
      return false;
    }
  };

  const isThisMonth = (date) => {
    if (!date || typeof date !== 'string') return false;
    try {
      const categoryDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
      return isWithinInterval(categoryDate, {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      });
    } catch (e) {
      console.warn('Lỗi định dạng ngày:', date, e);
      return false;
    }
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      (category.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) ?? true;
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && isToday(category.createdAt)) ||
      (dateFilter === 'week' && isThisWeek(category.createdAt)) ||
      (dateFilter === 'month' && isThisMonth(category.createdAt));
    return matchesSearch && matchesDate;
  });

  const totalCategories = categories.length;
  const recentCategories = categories.filter((c) => isThisWeek(c.createdAt)).length;

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setEditForm({ name: category.name || '' });
    setIsEditOpen(true);
  };

  const handleAddCategory = () => {
    setAddForm({ name: '' });
    setIsAddOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory({ name: addForm.name });
      setCategories((prev) => [newCategory, ...prev].sort((a, b) => new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date())));
      toast.success('Thêm danh mục thành công');
      setIsAddOpen(false);
    } catch (err) {
      toast.error('Không thể thêm danh mục');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      const updatedCategory = await updateCategory(selectedCategory.id, { name: editForm.name });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, name: updatedCategory.name } : cat
        )
      );
      toast.success('Cập nhật danh mục thành công');
      setIsEditOpen(false);
    } catch (err) {
      toast.error('Không thể cập nhật danh mục');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id));
      toast.success('Xóa danh mục thành công');
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error('Không thể xóa danh mục');
    }
  };

  const renderCategory = (category) => (
    <TableRow key={category.id}>
      <TableCell>{category.id}</TableCell>
      <TableCell>
        <div className="whitespace-pre-line line-clamp-2">{category.name || 'Danh mục không tên'}</div>
      </TableCell>
      <TableCell>{formatDate(category.createdAt) || 'Không có ngày'}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(category)}
            title="Xem chi tiết"
          >
            <Eye className="mr-2 h-4 w-4" /> Xem
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditCategory(category)}
            title="Chỉnh sửa"
          >
            <Pencil className="mr-2 h-4 w-4" /> Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteCategory(category)}
            title="Xóa"
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="mr-2 h-4 w-4" /> Xóa
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-pink-500">Danh sách danh mục</h1>
        <Button
          className="bg-pink-500 hover:bg-pink-600 text-white"
          onClick={handleAddCategory}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      {/* Thẻ thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tổng số danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{totalCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Danh mục mới (tuần này)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500">{recentCategories}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên danh mục"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
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
            <CardTitle>Danh sách danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%] text-pink-500 font-semibold">ID</TableHead>
                  <TableHead className="w-[40%] text-pink-500 font-semibold">Tên danh mục</TableHead>
                  <TableHead className="w-[30%] text-pink-500 font-semibold">Ngày tạo</TableHead>
                  <TableHead className="w-[20%] text-pink-500 font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => renderCategory(category))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Không có danh mục nào phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog chi tiết danh mục */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chi tiết danh mục
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          {selectedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-medium text-red-500 block mb-2">
                    Tên danh mục:
                  </span>
                  <p className="text-gray-700">{selectedCategory.name || 'Không có tên'}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <span className="text-gray-700">{selectedCategory.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                    <span className="text-gray-700">
                      {formatDate(selectedCategory.createdAt) || 'Không có ngày'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa danh mục */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Chỉnh sửa danh mục
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          {selectedCategory && (
            <form onSubmit={handleUpdateCategory} className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tên danh mục</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                Lưu thay đổi
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm danh mục */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Thêm danh mục mới
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Tên danh mục</label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="Nhập tên danh mục"
                required
              />
            </div>
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
              Thêm danh mục
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa danh mục */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Xác nhận xóa danh mục
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Bạn có chắc muốn xóa danh mục <strong>{selectedCategory?.name || 'Không tên'}</strong>? Hành động này không thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageCategory;