import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { FileVideo } from 'lucide-react';
import { getAllPost, createPost, updatePost, uploadImage, deletePost } from '@/api/postApi';
import { jwtDecode } from 'jwt-decode';
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
import { toast } from 'react-toastify';

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    content: '',
    tags: '',
    urlImage: null, // Thay đổi từ '' thành null để đồng bộ với Courses
    userId: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllPost();
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (err) {
      setError('Không thể tải danh sách bài viết');
      console.error('Error fetching posts:', err);
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
  }, [searchTerm, posts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleImageChange = (file) => {
    setCurrentPost({ ...currentPost, urlImage: file });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetForm = () => {
    setCurrentPost({
      title: '',
      content: '',
      tags: '',
      urlImage: null, // Đồng bộ với Courses
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
      urlImage: post.urlImage || null, // Đồng bộ với Courses
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
        fetchPosts();
        toast.success('Xóa bài viết thành công');
      } catch (err) {
        toast.error('Không thể xóa bài viết');
        console.error('Error deleting post:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const decoded = jwtDecode(token);

    const formData = {
      title: currentPost.title,
      content: currentPost.content,
      tags: currentPost.tags,
      userId: decoded.id,
    };

    if (isEditing) {
      try {
        await updatePost(currentPost.id, formData);
        if (currentPost.urlImage && currentPost.urlImage instanceof File) {
          console.log(currentPost.id);
          await uploadImage(currentPost.id, currentPost.urlImage);
        }
        toast.success('Cập nhật bài viết thành công');
        setIsModalOpen(false);
        fetchPosts();
        resetForm();
      } catch (error) {
        console.error('Error updating post:', error);
        toast.error('Có lỗi xảy ra khi cập nhật bài viết');
      }
    } else {
      try {
        const response = await createPost(formData);
        console.log(response.data.id);
        if (currentPost.urlImage && currentPost.urlImage instanceof File) {
          await uploadImage(response.data.id, currentPost.urlImage);
        }
        toast.success('Thêm bài viết thành công');
        setIsModalOpen(false);
        fetchPosts();
        resetForm();
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error('Có lỗi xảy ra khi tạo bài viết');
      }
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  return (
    <div className="container mx-auto px-4 py-8 w-[calc(1520px-250px)]">
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
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {post && (
                          <img
                            src={post.urlImage ? import.meta.env.VITE_API_URL + post.urlImage : import.meta.env.VITE_API_URL + '/uploads/placeholder.png'}
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
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                          >
                            {tag.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Không có tags</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditModal(post)}>
                          <FaEdit className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(post.id)}>
                          <FaTrash className="h-5 w-5" />
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <Label>Tiêu đề</Label>
              <Input
                type="text"
                name="title"
                value={currentPost.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>Nội dung</Label>
              <textarea
                name="content"
                rows="4"
                className="w-full px-3 py-2 border rounded-lg"
                value={currentPost.content}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Tags (phân cách bởi dấu phẩy)</Label>
              <Input
                type="text"
                name="tags"
                value={currentPost.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="image">Ảnh bài viết</Label>
                <div
                  className="
                    border-2 border-dashed border-gray-300 rounded-lg p-4 
                    text-center cursor-pointer 
                    hover:border-pink-500 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    handleImageChange(file);
                  }}
                >
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                  />
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <FileVideo className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Kéo thả hoặc click để tải ảnh lên</span>
                  </label>
                </div>
              </div>

              <div className="w-[230px] flex flex-col items-center gap-2">
                <div className="w-[230px] h-[129px] bg-gray-100 rounded-lg overflow-hidden">
                  {currentPost.urlImage ? (
                    <img
                      src={
                        currentPost.urlImage instanceof Blob || currentPost.urlImage instanceof File
                          ? URL.createObjectURL(currentPost.urlImage)
                          : import.meta.env.VITE_API_URL + currentPost.urlImage
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : isEditing && currentPost.urlImage ? (
                    <img
                      src={
                        currentPost.urlImage
                          ? import.meta.env.VITE_API_URL + currentPost.urlImage
                          : import.meta.env.VITE_API_URL + '/uploads/placeholder.png'
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">Kích thước: 460x259</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostManagement;