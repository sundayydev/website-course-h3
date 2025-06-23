'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getCategories } from '@/api/categoryApi';
import { createCourse, uploadImage } from '@/api/courseApi'; // Assuming these APIs exist
import { X } from 'lucide-react';

export default function AddCourse() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    urlImage: '',
    categoryId: '',
    status: 'draft',
    visibility: 'public',
    contents: [],
  });
  const [newContent, setNewContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        console.log('CATEGORY:', categories);
        setCategoriesData(categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Optionally set an error state
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContent = () => {
    if (newContent.trim()) {
      setCourseData((prev) => ({
        ...prev,
        contents: [...prev.contents, newContent.trim()],
      }));
      setNewContent('');
    }
  };

  const handleRemoveContent = (index) => {
    setCourseData((prev) => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !courseData.title ||
        !courseData.description ||
        !courseData.price
      ) {
        throw new Error('Please fill in all required fields');
      }

      let imageUrl = courseData.urlImage;

      // Upload image if selected
      if (imageFile) {
        const uploadResponse = await uploadImage(imageFile);
        imageUrl = uploadResponse.url; // Assuming API returns { url: 'image-url' }
      }

      // Prepare payload
      const payload = {
        ...courseData,
        price: parseFloat(courseData.price),
        urlImage: imageUrl,
        contents: courseData.contents, // Will be serialized to SerializedContents in backend
      };

      console.log(payload)

      // Call API to create course
      const response = await createCourse(payload);

      // Navigate to course details page after successful creation
      navigate(`/instructor/course/${response.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 h-max-screen overflow-scroll">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/instructor/courses')}>
            Quay lại
          </Button>
          <h2 className="text-3xl font-bold">Tạo khóa học mới</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khóa học</CardTitle>
              <CardDescription>Nhập chi tiết cơ bản cho khóa học mới</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề khóa học *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề khóa học"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả khóa học *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về khóa học"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá (VNĐ) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0"
                      value={courseData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Danh mục *</Label>
                    <Select
                      value={courseData.categoryId}
                      onValueChange={(value) => handleSelectChange('categoryId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-base font-semibold text-gray-700">
                    Hình ảnh khóa học
                  </Label>

                  <div className="relative">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}                    />
                  </div>

                  {imageFile && previewUrl && (
                    <div className="mt-4 space-y-3">
                      <div className="relative rounded-lg border border-gray-200 p-4 bg-gray-50">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 w-full object-contain rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 truncate">Đã chọn: {imageFile.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nội dung khóa học</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Nhập nội dung khóa học (ví dụ: HTML5 Fundamentals)"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddContent()}
                    />
                    <Button type="button" onClick={handleAddContent} disabled={!newContent.trim()}>
                      Thêm
                    </Button>
                  </div>
                  {courseData.contents.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {courseData.contents.map((content, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span>{content}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveContent(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/instructor/courses')}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Tạo khóa học'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt khóa học</CardTitle>
              <CardDescription>Thiết lập các tùy chọn cho khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={courseData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="reviewing">Đang xem xét</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Hiển thị</Label>
                <Select
                  value={courseData.visibility}
                  onValueChange={(value) => handleSelectChange('visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hiển thị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Công khai</SelectItem>
                    <SelectItem value="private">Riêng tư</SelectItem>
                    <SelectItem value="password">Bảo vệ bằng mật khẩu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
