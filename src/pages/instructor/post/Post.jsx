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
import { Pagination } from '@mui/material';

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
      const userPosts = Array.isArray(response.data) ? response.data.filter((post) => post.userId === userId) : [];
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

  // Calculate pagination
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

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
                      <div className="flex items-center">
                        {post && (
                          <img
                            src={post.urlImage || ''}
                            alt={post.title}
                            className="h-12 w-12 object-cover rounded-md mr-3"
                            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-gray-500 truncate max-w-md">
                            {post.content || 'Không có nội dung'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{post.user?.fullName || 'Unknown'}</TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>
                      {post.tags ? (
                        post.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          >
                            {tag.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Không có tags</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(post)}>
                          <FaEdit className="mr-1" /> Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <FaTrash className="mr-1" /> Xóa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/instructor/comments/${post.id}`)}
                        >
                          <FaSearch className="mr-1" /> Xem bình luận
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

      <div className="mt-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
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