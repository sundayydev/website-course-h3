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
import { Pencil, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getComments,
  createComment,
  deleteComment,
  getCommentById,
} from '@/api/commentApi'; // Xóa updateComment vì không dùng

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    postId: '',
  });

  // Fetch comments data
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await getComments();
      console.log('Danh sách bình luận: ', response);
      setComments(response);
    } catch (error) {
      toast.error('Không thể tải danh sách bình luận');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (chỉ dùng khi thêm mới)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment(formData);
      toast.success('Thêm bình luận thành công');
      setIsDialogOpen(false);
      fetchComments();
      resetForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error('Error:', error);
    }
  };

  // Handle delete comment
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        await deleteComment(id);
        toast.success('Xóa bình luận thành công');
        fetchComments();
      } catch (error) {
        toast.error('Không thể xóa bình luận');
        console.error('Error:', error);
      }
    }
  };

  // Handle view comment (chỉ log và hiển thị, không chỉnh sửa)
  const handleEdit = async (commentId) => {
    try {
      const response = await getCommentById(commentId);
      setEditingComment(response);
      setFormData({
        content: response.content,
        postId: response.postId,
      });
      console.log('Thông tin bình luận: ', response);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error('Không thể tải thông tin bình luận');
      console.error('Lỗi:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      content: '',
      postId: '',
    });
    setEditingComment(null);
  };

  // Filter comments based on search term
  const filteredComments = comments.filter(
    (comment) =>
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.userId?.toString().includes(searchTerm) ||
      comment.postId?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-[calc(1520px-250px)]">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-pink-500">Quản lý bình luận</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi bình luận của người dùng</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-pink-500 hover:bg-pink-600 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Thêm bình luận
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingComment ? 'Xem thông tin bình luận' : 'Thêm bình luận mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingComment ? null : handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung bình luận</Label>
                <Input
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required={!editingComment}
                  disabled={!!editingComment} // Vô hiệu hóa khi xem
                  placeholder="Nhập nội dung bình luận"
                  className={editingComment ? 'bg-gray-100 text-gray-700' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postId">ID bài viết</Label>
                <Input
                  id="postId"
                  value={formData.postId}
                  onChange={(e) => setFormData({ ...formData, postId: e.target.value })}
                  required={!editingComment}
                  disabled={!!editingComment} // Vô hiệu hóa khi xem
                  placeholder="Nhập ID bài viết"
                  className={editingComment ? 'bg-gray-100 text-gray-700' : ''}
                />
              </div>
              {!editingComment && (
                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  Thêm mới
                </Button>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[calc(1420px-250px)]">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Tổng số bình luận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">{comments.length}</div>
            <p className="text-sm text-gray-500 mt-1">Tổng số bình luận đã đăng</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Bình luận hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {comments.filter((c) => c.createdAt.startsWith(new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'))).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Số bình luận trong ngày</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Người dùng bình luận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {new Set(comments.map((c) => c.userId)).size}
            </div>
            <p className="text-sm text-gray-500 mt-1">Số người dùng đã bình luận</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Danh sách bình luận</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm bình luận..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-pink-500">Người dùng (ID)</TableHead>
                  <TableHead className="text-pink-500">Bài viết (ID)</TableHead>
                  <TableHead className="text-pink-500">Nội dung</TableHead>
                  <TableHead className="text-pink-500">Thời gian tạo</TableHead>
                  <TableHead className="text-pink-700 font-semibold text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
               {filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.userName}</TableCell>
                    <TableCell>{comment.postTitle}</TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(comment.id)}
                          className="hover:bg-green-200"
                        >
                          <Pencil className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
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

export default Comment;