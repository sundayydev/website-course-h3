import React, { useState, useEffect, useRef } from 'react';
import {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
} from '../../../api/postApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import { formatDate } from '../../../utils/formatDate';
import { getUserId } from '@/api/authUtils';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Icons
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const triggerButtonRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, [pageNumber]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('Không tìm thấy userId');
      }
      console.log('Fetching posts for userId:', userId);
      const response = await getAllPost({ pageNumber, pageSize });
      const userPosts = Array.isArray(response.data) ? response.data.filter((post) => post.userId === userId) : [];
      console.log('Fetched posts:', userPosts);
      setPosts(userPosts);
      setFilteredPosts(userPosts);
      setTotalPages(Number.isInteger(response.totalPages) ? response.totalPages : 1);
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết');
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPostsList = filteredPosts.filter((post) => {
    return (
      post.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      post.tags?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) ?? true;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost({ ...selectedPost, [name]: value });
  };

  const handleContentChange = (value) => {
    setSelectedPost({ ...selectedPost, content: value || '' });
  };

  const handleImageChange = (e) => {
    setSelectedPost({ ...selectedPost, urlImage: e.target.files[0] });
  };

  const resetForm = () => {
    console.log('Resetting form');
    return {
      id: null,
      title: '',
      content: '',
      tags: '',
      urlImage: null,
    };
  };

  const openCreateModal = () => {
    console.log('Opening create modal');
    setSelectedPost(resetForm());
  };

  const openEditModal = (post) => {
    console.log('Opening edit modal for post:', post.id);
    setSelectedPost({ ...post });
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  };

  const closeModal = () => {
    console.log('Closing modal');
    setSelectedPost(null);
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        console.log('Deleting post:', postId);
        await deletePost(postId);
        toast.success('Xóa bài viết thành công');
        await fetchPosts();
      } catch (error) {
        toast.error('Không thể xóa bài viết');
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', selectedPost);
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Không tìm thấy token');
      return;
    }
    const decoded = jwtDecode(token);

    const formData = {
      title: selectedPost.title,
      content: selectedPost.content,
      tags: selectedPost.tags,
      userId: decoded.id,
      urlImage: selectedPost.urlImage,
    };

    try {
      if (selectedPost.id) {
        console.log('Updating post:', selectedPost.id);
        await updatePost(selectedPost.id, formData);
        if (selectedPost.urlImage instanceof File) {
          console.log('Uploading new image for post:', selectedPost.id);
          await uploadPostImage(selectedPost.id, selectedPost.urlImage);
        }
        toast.success('Cập nhật bài viết thành công');
      } else {
        console.log('Creating new post');
        const response = await createPost(formData);
        if (selectedPost.urlImage instanceof File) {
          console.log('Uploading image for new post:', response.data.id);
          await uploadPostImage(response.data.id, selectedPost.urlImage);
        }
        toast.success('Thêm bài viết thành công');
      }
      closeModal();
      await fetchPosts();
    } catch (error) {
      toast.error(selectedPost.id ? 'Không thể cập nhật bài viết' : 'Không thể tạo bài viết mới');
      console.error('Error saving post:', error);
    }
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

  return (
    <div className="container mx-auto px-4 py-8 w-full" inert={selectedPost ? '' : undefined}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Button
          variant="outline"
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium"
          onClick={openCreateModal}
          ref={triggerButtonRef}
          aria-label="Thêm bài viết mới"
        >
          <Plus className="h-4 w-4 mr-2" /> Thêm bài viết mới
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search-post"
              placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc tags"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              aria-label="Tìm kiếm bài viết"
              aria-describedby="search-post-description"
            />
            <p id="search-post-description" className="sr-only">
              Tìm kiếm bài viết theo tiêu đề, nội dung hoặc tags
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPostsList.length === 0 ? (
            <div className="text-center py-4">Không có bài viết nào phù hợp</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%] text-pink-500">Ảnh</TableHead>
                    <TableHead className="w-[20%] text-pink-500">Tiêu đề</TableHead>
                    <TableHead className="w-[30%] text-pink-500">Nội dung</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Tags</TableHead>
                    <TableHead className="w-[15%] text-pink-500">Ngày tạo</TableHead>
                    <TableHead className="w-[10%] text-pink-500">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPostsList.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          {post.urlImage ? (
                            <img
                              src={post.urlImage}
                              alt={post.title}
                              className="h-full w-full object-cover shadow-sm"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]" title={post.title}>
                        {post.title}
                      </TableCell>
                      <TableCell className="truncate max-w-[300px]" title={post.content}>
                        {post.content}
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]" title={post.tags}>
                        {post.tags}
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label={`Thao tác cho bài viết ${post.title}`}
                              ref={triggerButtonRef}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditModal(post)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            </>
          )}
        </CardContent>
      </Card>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl relative transition-all duration-300 transform hover:scale-102">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 transition-colors duration-200"
              aria-label="Đóng modal"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-pink-500 pb-2">
              {selectedPost.id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-title">Tiêu đề</Label>
                    <Input
                      id="post-title"
                      name="title"
                      value={selectedPost.title}
                      onChange={handleInputChange}
                      placeholder="Nhập tiêu đề bài viết"
                      required
                      aria-describedby="post-title-description"
                    />
                    <p id="post-title-description" className="text-sm text-gray-500">
                      Tiêu đề bài viết, tối đa 255 ký tự.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nội dung</Label>
                    <div data-color-mode="light">
                      <MDEditor
                        key={selectedPost.id || 'new-post'}
                        value={selectedPost.content}
                        onChange={handleContentChange}
                        height={400}
                        preview="edit"
                        aria-label="Nội dung bài viết"
                      />
                    </div>
                  </div>
                </div>
                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-tags">Tags</Label>
                    <Input
                      id="post-tags"
                      name="tags"
                      value={selectedPost.tags}
                      onChange={handleInputChange}
                      placeholder="Nhập tags, phân cách bằng dấu phẩy"
                      aria-describedby="post-tags-description"
                    />
                    <p id="post-tags-description" className="text-sm text-gray-500">
                      Tags giúp phân loại bài viết, ví dụ: công nghệ, giáo dục.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-image">Hình ảnh</Label>
                    <Input
                      id="post-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                      aria-describedby="post-image-description"
                    />
                    <p id="post-image-description" className="text-sm text-gray-500">
                      Chọn hình ảnh minh họa cho bài viết (định dạng JPG, PNG).
                    </p>
                    {selectedPost.id && selectedPost.urlImage && !(selectedPost.urlImage instanceof File) && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Ảnh hiện tại:</p>
                        <img
                          src={selectedPost.urlImage}
                          alt="Ảnh bài viết hiện tại"
                          className="mt-3 w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  aria-label="Hủy chỉnh sửa hoặc tạo bài viết"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                  aria-label={selectedPost.id ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}
                >
                  {selectedPost.id ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;