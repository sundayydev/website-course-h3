import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaComment, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { getAllPost, createPost, updatePost, uploadPostImage, deletePost } from '../../api/postApi';
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
import MDEditor from '@uiw/react-md-editor';
import { formatDate } from '../../utils/formatDate';
import slugify from 'slugify';
import { getUserId } from '../../api/authUtils';


function PostManagement() {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumberFromUrl = parseInt(searchParams.get('page') || 1, 10);
  const currentUserId = getUserId();


  const generateSlug = (text) => {
    if (!text) return '';
    return slugify(text, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
      locale: 'vi',
      trim: true,
    });
  };

  useEffect(() => {
    const initialPage = pageNumberFromUrl >= 1 ? pageNumberFromUrl : 1;
    setCurrentPage(initialPage);
  }, [pageNumberFromUrl]);

  // Lấy toàn bộ bài viết
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllPost();
      if (response.data && Array.isArray(response.data)) {
        setAllPosts(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } else {
        setError('Không có bài viết nào.');
      }
    } catch (err) {
      setError('Không thể tải danh sách bài viết');
      console.error('Lỗi khi lấy bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  useEffect(() => {
    const slug = searchParams.get('slug') || '';
    let filteredPosts = allPosts;


    if (slug || searchTerm) {
      filteredPosts = allPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          generateSlug(post.title).includes(slug)
      );
    }


    setTotalPages(Math.ceil(filteredPosts.length / pageSize));


    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedPosts(filteredPosts.slice(startIndex, endIndex));
  }, [searchTerm, searchParams, currentPage, allPosts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleContentChange = (value) => {
    setCurrentPost({ ...currentPost, content: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentPost({ ...currentPost, urlImage: file });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    const slug = generateSlug(value);
    setSearchParams({ page: '1', slug: slug || '' });
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
        setAllPosts(allPosts.filter((post) => post.id !== postId));
        toast.success('Xóa bài viết thành công');
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

    const formData = {
      title: currentPost.title,
      content: currentPost.content,
      tags: currentPost.tags,
      userId: currentUserId,
      urlImage: currentPost.urlImage && typeof currentPost.urlImage === 'string' ? currentPost.urlImage : null,
    };

    try {
      if (isEditing) {
        if (currentPost.userId !== currentUserId) {
          toast.error('Bạn không có quyền chỉnh sửa bài viết này');
          return;
        }

        await updatePost(currentPost.id, formData);

        // Upload new image if provided
        if (currentPost.urlImage instanceof File) {
          await uploadPostImage(currentPost.id, currentPost.urlImage);
        }

        toast.success('Cập nhật bài viết thành công');
      } else {
        const response = await createPost(formData);

        // Upload image for new post if provided
        if (currentPost.urlImage instanceof File) {
          await uploadPostImage(response.data.id, currentPost.urlImage);
        }

        toast.success('Thêm bài viết thành công');
      }

      setIsModalOpen(false);
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error(`Lỗi khi ${isEditing ? 'cập nhật' : 'tạo'} bài viết:`, error);
      toast.error(`Có lỗi xảy ra khi ${isEditing ? 'cập nhật' : 'tạo'} bài viết`);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ page: page, slug: searchParams.get('slug') || '' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchParams({ page: currentPage - 1, slug: searchParams.get('slug') || '' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchParams({ page: currentPage + 1, slug: searchParams.get('slug') || '' });
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
                  <TableHead className="w-[40%]">Bài viết</TableHead>
                  <TableHead className="w-[20%]">Tác giả</TableHead>
                  <TableHead className="w-[15%]">Ngày tạo</TableHead>
                  <TableHead className="w-[15%]">Tags</TableHead>
                  <TableHead className="w-[10%]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3 line-clamp-1">
                        {post && (
                          <img
                            src={post.urlImage || ''}
                            alt={post.title}
                            className="h-12 w-12 object-cover rounded-md"
                            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                          />
                        )}
                        <div className="flex flex-col">
                          <div
                            className="font-medium text-gray-900 line-clamp-1 cursor-pointer hover:underline"
                            onClick={() => navigate(`/posts/${generateSlug(post.title)}`)}
                          >
                            {post.title}
                          </div>
                          <div className="text-gray-500 line-clamp-1 text-sm">
                            {post.content || 'Không có nội dung'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{post.user?.fullName || 'Unknown'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{formatDate(post.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {post.tags ? (
                          post.tags.split(',').slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700"
                            >
                              {tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Không có tags</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(post)}
                          className="h-8 px-2"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="h-8 px-2"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/comments/${post.id}`)}
                          className="h-8 px-2"
                        >
                          <FaComment className="h-4 w-4" />
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

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg font-medium border ${currentPage === 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 border-gray-400'}`}
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg font-medium border ${currentPage === page ? 'bg-red-500 text-white border-red-500' : 'text-gray-700 hover:bg-gray-200 border-gray-300'}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg font-medium border ${currentPage === totalPages ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 border-gray-400'}`}
        >
          Sau
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1fr_2fr]">
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
                {isEditing && currentPost.urlImage && typeof currentPost.urlImage === 'string' && (
                  <div className="mb-2">
                    <img
                      src={currentPost.urlImage}
                      alt="Ảnh hiện tại"
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <p className="text-sm text-gray-500">Ảnh hiện tại</p>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <div data-color-mode="light">
                  <MDEditor value={currentPost.content} onChange={handleContentChange} height={400} />
                </div>
              </div>
            </div>
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

export default PostManagement;