import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { getCourseById } from '@/api/courseApi';
import { getChapters, createChapter } from '@/api/chapterApi';
import { createLesson, uploadVideoLesson, getVideoPreviewUrl } from '@/api/lessonApi';
import MDEditor from '@uiw/react-md-editor';
import { Upload, X, Video } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AddContent() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Lesson form state
  const [lessonData, setLessonData] = useState({
    courseId: courseId,
    chapterId: '',
    title: '',
    description: '',
    content: '',
    videoName: '',
    duration: '',
    orderNumber: '',
    status: 'Pending',
  });

  // Chapter form state
  const [chapterData, setChapterData] = useState({
    courseId: courseId,
    title: '',
    description: '',
    orderNumber: '',
  });

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch course and chapters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseById(courseId);
        const chaptersData = await getChapters(courseId);
        setCourse(courseData);
        setChapters(chaptersData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load course and chapters');
      }
    };
    fetchData();
  }, [courseId]);

  // Handle input changes for lesson form
  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes for lesson form
  const handleLessonSelectChange = (name, value) => {
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for chapter form
  const handleChapterInputChange = (e) => {
    const { name, value } = e.target;
    setChapterData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle video file selection
  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn file video hợp lệ');
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error('Kích thước video không được vượt quá 500MB');
      return;
    }

    setVideoFile(file);
    try {
      const preview = await getVideoPreviewUrl(file);
      setVideoPreview(preview);
      setLessonData((prev) => ({
        ...prev,
        duration: Math.round(preview.duration / 60), // Convert to minutes
        videoName: null,
      }));
    } catch (error) {
      toast.error('Không thể tạo preview video');
    }
  };

  // Handle video upload
  const handleVideoUpload = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadVideoLesson(videoFile, (progress) => {
        setUploadProgress(progress);
      });

      // Kiểm tra cấu trúc phản hồi từ server
      console.log('Upload response:', response); // Debug để kiểm tra dữ liệu trả về

      // Cập nhật videoName vào lessonData
      setLessonData((prev) => ({
        ...prev,
        videoName: response.videoName, // Đảm bảo response.videoName tồn tại
      }));

      toast.success('Tải lên video thành công');
      return response.videoName; // Trả về videoName để sử dụng trong handleLessonSubmit
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải lên video');
      throw error; // Ném lỗi để xử lý trong handleLessonSubmit
    } finally {
      setIsUploading(false);
    }
  };

  // Handle lesson form submission
  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!lessonData.chapterId || !lessonData.title || !lessonData.description) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      let videoName = lessonData.videoName;

      // Upload video nếu có file và chưa có videoName
      if (videoFile) {
        videoName = await handleVideoUpload(); // Chờ upload hoàn tất và lấy videoName
      }

      // Prepare payload
      const payload = {
        ...lessonData,
        videoName: videoName, // Sử dụng videoName từ kết quả upload hoặc lessonData
        duration: parseInt(lessonData.duration) || 0,
        orderNumber: parseInt(lessonData.orderNumber) || 0,
      };

      console.log('Payload gửi đi:', payload); // Debug payload

      // Call API to create lesson
      const response = await createLesson(payload);
      toast.success('Tạo bài học thành công');

      // Navigate to course management page
      navigate(`/instructor/course/${courseId}/lessons`);
    } catch (err) {
      setError(err.message || 'Không thể tạo bài học');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle chapter form submission
  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!chapterData.title) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      // Prepare payload
      const payload = {
        ...chapterData,
        orderNumber: parseInt(chapterData.orderNumber) || 0,
      };

      // Call API to create chapter
      const response = await createChapter(payload);

      // Navigate to course management page
      navigate(`/instructor/courses/${courseId}/lessons`);
    } catch (err) {
      setError(err.message || 'Không thể tạo chương');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 overflow-scroll">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/instructor/courses/${courseId}/lessons`)}
          >
            Quay lại
          </Button>
          <h2 className="text-3xl font-bold">Thêm nội dung khóa học</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin nội dung</CardTitle>
              <CardDescription>Thêm bài học hoặc chương mới cho khóa học</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="lesson">Thêm bài học</TabsTrigger>
                  <TabsTrigger value="chapter">Thêm chương</TabsTrigger>
                </TabsList>

                {/* Lesson Form */}
                <TabsContent value="lesson">
                  <form onSubmit={handleLessonSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="chapterId">Chương *</Label>
                      <Select
                        value={lessonData.chapterId}
                        onValueChange={(value) => handleLessonSelectChange('chapterId', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chương" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters.map((chapter) => (
                            <SelectItem key={chapter.id} value={chapter.id}>
                              {chapter.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề bài học *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={lessonData.title}
                        onChange={handleLessonInputChange}
                        placeholder="Nhập tiêu đề bài học"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả bài học *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={lessonData.description}
                        onChange={handleLessonInputChange}
                        placeholder="Mô tả chi tiết về bài học"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Nội dung bài học</Label>
                      <div data-color-mode="light">
                        <MDEditor
                          value={lessonData.content}
                          onChange={(value) =>
                            setLessonData((prev) => ({ ...prev, content: value }))
                          }
                          height={400}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Video bài học</Label>
                      <div
                        className={`
                          border-2 border-dashed rounded-lg p-6
                          ${isUploading ? 'border-gray-300' : 'border-gray-300 hover:border-pink-500'}
                          transition-colors cursor-pointer
                        `}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoChange}
                          disabled={isUploading}
                        />

                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {isUploading
                                ? 'Đang tải lên...'
                                : 'Kéo thả hoặc click để tải video lên'}
                            </p>
                            <p className="text-xs text-gray-500">MP4, WebM, MOV (tối đa 500MB)</p>
                          </div>
                        </div>

                        {isUploading && (
                          <div className="mt-4 space-y-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-sm text-center text-gray-500">
                              {uploadProgress}% hoàn thành
                            </p>
                          </div>
                        )}
                      </div>

                      {videoPreview && (
                        <div className="mt-4 space-y-2">
                          <div className="relative rounded-lg overflow-hidden border">
                            <video
                              src={videoPreview.url}
                              controls
                              className="w-full aspect-video"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setVideoFile(null);
                                setVideoPreview(null);
                                setLessonData((prev) => ({
                                  ...prev,
                                  videoName: '',
                                  duration: '',
                                }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            {videoFile?.name} ({(videoFile?.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Thời lượng (phút)</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={lessonData.duration}
                          onChange={handleLessonInputChange}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orderNumber">Thứ tự</Label>
                        <Input
                          id="orderNumber"
                          name="orderNumber"
                          type="number"
                          value={lessonData.orderNumber}
                          onChange={handleLessonInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select
                        value={lessonData.status}
                        onValueChange={(value) => handleLessonSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Chờ duyệt</SelectItem>
                          <SelectItem value="Approved">Đã duyệt</SelectItem>
                          <SelectItem value="Rejected">Bị từ chối</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {error && <div className="text-red-600 text-sm">{error}</div>}
                  </form>
                </TabsContent>

                {/* Chapter Form */}
                <TabsContent value="chapter">
                  <form onSubmit={handleChapterSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề chương *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={chapterData.title}
                        onChange={handleChapterInputChange}
                        placeholder="Nhập tiêu đề chương"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả chương</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={chapterData.description}
                        onChange={handleChapterInputChange}
                        placeholder="Mô tả chi tiết về chương (nếu có)"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNumber">Thứ tự</Label>
                      <Input
                        id="orderNumber"
                        name="orderNumber"
                        type="number"
                        value={chapterData.orderNumber}
                        onChange={handleChapterInputChange}
                        placeholder="0"
                      />
                    </div>

                    {error && <div className="text-red-600 text-sm">{error}</div>}
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/instructor/courses/${courseId}/lessons`)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={(e) => {
                  if (activeTab === 'lesson') {
                    handleLessonSubmit(e);
                  } else {
                    handleChapterSubmit(e);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Đang tạo...'
                  : activeTab === 'lesson'
                    ? 'Thêm bài học'
                    : 'Thêm chương'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt nội dung</CardTitle>
              <CardDescription>Thiết lập các tùy chọn bổ sung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loại nội dung</Label>
                <p className="text-sm text-gray-600">
                  Chọn giữa bài học hoặc chương để thêm nội dung phù hợp cho khóa học.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
