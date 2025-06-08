import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getAllPost, createPost, updatePost, uploadPostImage, deletePost } from '../../../api/postApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import { formatDate } from '../../../utils/formatDate';
import { getUserId } from '@/api/authUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Post() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    tags: '',
    urlImage: null,
    userId: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  // Fetch posts for the current user
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('Không tìm thấy userId');
      }
      const response = await getAllPost();
      const userPosts = response.data?.filter((post) => post.userId === userId) ?? [];
      setPosts(userPosts);
      setFilteredPosts(userPosts);
      setTotalPages(Math.ceil(userPosts.length / postsPerPage));
    } catch (err) {
      setError('Không thể tải danh sách bài viết');
      toast.error('Không thể tải danh sách bài viết');
      console.error('Lỗi khi lấy bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
    setTotalPages(Math.ceil(results.length / postsPerPage));
    setPage(1); // Reset về trang 1 khi lọc thay đổi
  }, [searchTerm, posts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleContentChange = (value) => {
    setCurrentPost({ ...currentPost, content: value || '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentPost({ ...currentPost, urlImage: file });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetForm = () => {
    setCurrentPost({
      title: '',
      content: '',
      tags: '',
      urlImage: null,
      userId: '',
    });
    setIsEditing(false);
    setError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setCurrentPost({
      id: post.id,
      title: post.title,
      content: post.content || '',
      tags: post.tags || '',
      urlImage: post.urlImage || null,
      userId: post.userId || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setLoading(true);
      try {
        await deletePost(postId);
        toast.success('Xóa bài viết thành công');
        fetchPosts();
      } catch (err) {
        toast.error('Không thể xóa bài viết');
        console.error('Lỗi khi xóa bài viết:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      const decoded = jwtDecode(token);

      const formData = {
        title: currentPost.title,
        content: currentPost.content,
        tags: currentPost.tags,
        userId: decoded.id,
        urlImage: currentPost.urlImage && typeof currentPost.urlImage === 'string' ? currentPost.urlImage : null,
      };

      if (isEditing) {
        await updatePost(currentPost.id, formData);
        if (currentPost.urlImage instanceof File) {
          await uploadPostImage(currentPost.id, currentPost.urlImage);
        }
        toast.success('Cập nhật bài viết thành công');
      } else {
        const response = await createPost(formData);
        if (currentPost.urlImage instanceof File) {
          await uploadPostImage(response.data.id, currentPost.urlImage);
        }
        toast.success('Thêm bài viết thành công');
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi xử lý bài viết:', error);
      toast.error(`Có lỗi xảy ra khi ${isEditing ? 'cập nhật' : 'tạo'} bài viết: ${error.message}`);
    }
  };

  // Tính toán phân trang
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Hàm xử lý chuyển trang
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl font-bold mb-6 text-left text-pink-500">Quản lý bài viết</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={openCreateModal}
        >
          <FaPlus className="mr-2" /> Thêm bài viết mới
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bài viết</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post?.urlImage && (
                          <img
                            src={post.urlImage}
                            alt={post.title}
                            className="h-12 w-12 object-cover rounded-md"
                            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                          <p className="text-gray-500 truncate">
                            {post.content || 'Không có nội dung'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {post.user?.fullName || 'Unknown'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {post.tags ? (
                          post.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Không có tags</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(post)}
                          className="h-8"
                        >
                          <FaEdit className="h-4 w-4 mr-1" />
                          <span>Sửa</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="h-8"
                        >
                          <FaTrash className="h-4 w-4 mr-1" />
                          <span>Xóa</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/instructor/comments/${post.id}`)}
                          className="h-8"
                        >
                          <FaSearch className="h-4 w-4 mr-1" />
                          <span>Xem bình luận</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={page === 1 || totalPages === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Trang Trước
        </Button>
        <span>
          {totalPages === 0 ? 'Không có trang' : `Trang ${page} / ${totalPages}`}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={page >= totalPages || totalPages === 0}
        >
          Trang Sau
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết đăng'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1fr_2fr]">
            {/* Left Column - Smaller */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentPost.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={currentPost.tags}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: JavaScript, React, Node.js"
                />
              </div>
              <div>
                <Label htmlFor="image">Hình ảnh</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {(isEditing || currentPost.urlImage) && (
                    <div className="mt-2">
                      <img
                        src={
                          currentPost.urlImage instanceof File
                            ? URL.createObjectURL(currentPost.urlImage)
                            : currentPost.urlImage || '/placeholder-image.jpg'
                        }
                        alt="Preview"
                        className="h-50 w-50 object-cover rounded-md"
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                      <p className="text-sm text-gray-500">
                        {currentPost.urlImage instanceof File ? 'Ảnh xem trước' : 'Ảnh hiện tại'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Wider */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <div data-color-mode="light">
                  <MDEditor
                    value={currentPost.content}
                    onChange={handleContentChange}
                    height={400}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                {isEditing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Post;