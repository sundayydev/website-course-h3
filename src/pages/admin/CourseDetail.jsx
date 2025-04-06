// Import các thư viện và components
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import các components UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Import các icons
import { 
  Loader2, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  FileVideo, 
  Plus, 
  Trash2,
  Video,
  Eye 
} from 'lucide-react';

// Import các API
import { getCourseById } from '@/api/courseApi';
import { getLessonsByCourseId, createLesson, deleteLesson } from '@/api/lessonApi';

const CourseDetail = () => {
  // State và hooks
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoViews, setVideoViews] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    content: '',
    orderNumber: '',
    videoUrl: ''
  });

  // Effects
  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // Các hàm xử lý
  const fetchCourseData = async () => {
    try {
      const courseResponse = await getCourseById(courseId);
      const lessonsResponse = await getLessonsByCourseId(courseId);

      console.log('courseResponse: ', courseResponse);
      console.log('lessonsResponse: ', lessonsResponse);

      setCourse(courseResponse);
      setLessons(lessonsResponse);

      console.log('courseResponse: ', courseResponse);
      console.log('lessonsResponse: ', lessonsResponse);
    } catch (error) {
      toast.error('Không thể tải thông tin khóa học');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        ...newLesson,
        courseId: courseId
      };
      await createLesson(lessonData);
      toast.success('Thêm bài học thành công');
      fetchCourseData();
      setNewLesson({
        title: '',
        description: '',
        content: '',
        orderNumber: '',
        videoUrl: ''
      });
    } catch (error) {
      toast.error('Thêm bài học thất bại');
      console.error('Error:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(lessonId);
      toast.success('Xóa bài học thành công');
      fetchCourseData();
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Xóa bài học thất bại');
      console.error('Error:', error);
    }
  };

  const convertDurationToMinutes = (duration) => {
    if (!duration) return 0;

    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return 0;

    const hours = parseInt(matches[1] || 0);
    const minutes = parseInt(matches[2] || 0);
    const seconds = parseInt(matches[3] || 0);

    return Math.round(hours * 60 + minutes + seconds / 60);
  };

  const getEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Error state
  if (!course) {
    return (
      <div className="text-center py-8 text-gray-500 text-2xl font-bold w-[calc(1520px-250px)]">
        Không tìm thấy thông tin khóa học
      </div>
    );
  }

  // Main render
  return (
    <div className="p-6 space-y-6 w-[calc(1520px-250px)]">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/courses')}
          className="hover:bg-pink-50 hover:text-pink-500 border-pink-200 text-pink-500 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">Chi tiết và quản lý bài học</p>
        </div>
      </div>

      {/* Course Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Thông tin khóa học</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bài học
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                  <DialogTitle>Thêm bài học mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin bài học mới vào form dưới đây
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề</Label>
                      <Input 
                        id="title"
                        name="title"
                        value={newLesson.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề bài học" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea 
                        id="description"
                        name="description"
                        value={newLesson.description}
                        onChange={handleInputChange}
                        placeholder="Nhập mô tả bài học" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Nội dung chi tiết</Label>
                      <Textarea 
                        id="content"
                        name="content"
                        value={newLesson.content}
                        onChange={handleInputChange}
                        placeholder="Nhập nội dung chi tiết bài học" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderNumber">Số thứ tự</Label>
                        <Input
                          type="number"
                          id="orderNumber"
                          name="orderNumber"
                          value={newLesson.orderNumber}
                          onChange={handleInputChange}
                          placeholder="Nhập số thứ tự bài học"
                          min="1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Thời lượng (phút)</Label>
                        <Input
                          type="number"
                          id="duration"
                          name="duration"
                          value={newLesson.duration}
                          onChange={handleInputChange}
                          placeholder="Thời lượng video"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">Video URL (YouTube)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="videoUrl"
                          name="videoUrl"
                          value={newLesson.videoUrl}
                          onChange={handleInputChange}
                          placeholder="Nhập đường dẫn video YouTube"
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="hover:bg-pink-50 hover:text-pink-500 border-pink-200 text-pink-500"
                            >
                              Xem thử
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[860px] h-[700px] bg-gradient-to-br from-pink-50 to-white">
                            <DialogHeader className="border-b pb-4">
                              <DialogTitle className="text-2xl font-bold text-pink-600">
                                Xem trước video
                              </DialogTitle>
                              {videoUrl && (
                                <div className="flex items-center gap-8">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-pink-500" />
                                    <p className="text-gray-700 font-medium">
                                      Thời lượng: {convertDurationToMinutes(videoDuration)} phút
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-pink-500" />
                                    <p className="text-gray-700 font-medium">
                                      Lượt xem: {videoViews}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </DialogHeader>
                            <div className="w-[700px] h-[500px] mx-auto mt-6 rounded-lg overflow-hidden shadow-lg">
                              {videoUrl ? (
                                <>
                                  <iframe
                                    id="previewVideo"
                                    className="w-full h-full rounded-t-lg"
                                    src={getEmbedUrl(videoUrl)}
                                    title="Video Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onLoad={async () => {
                                      try {
                                        const videoId = videoUrl.split('v=')[1];
                                        const response = await fetch(
                                          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,statistics&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
                                        );
                                        const data = await response.json();
                                        const duration = data.items[0].contentDetails.duration;
                                        const views = data.items[0].statistics.viewCount;
                                        setVideoDuration(duration);
                                        setVideoViews(views);
                                      } catch (error) {
                                        console.error('Error fetching video data:', error);
                                      }
                                    }}
                                  />
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
                                  <Video className="h-16 w-16 text-gray-400 mb-4" />
                                  <p className="text-gray-500 text-lg">Chưa có video nào được chọn</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <input 
                      type="hidden" 
                      name="courseId" 
                      value={courseId}
                    />

                    <div className="flex justify-end mt-6">
                      <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                        Thêm bài học
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Mô tả</h3>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-600">{lessons.length} bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-600">Thời lượng: 0 giờ</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Giá</h3>
                {course.price === 0 ? (
                  <Badge variant="success" className="bg-green-100 text-green-800 mt-1">
                    Miễn phí
                  </Badge>
                ) : (
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(course.price)}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Ảnh khóa học</h3>
                <img
                  src={
                    course.urlImage
                      ? import.meta.env.VITE_API_URL + course.urlImage
                      : import.meta.env.VITE_API_URL + '/uploads/placeholder.png'
                  }
                  alt={course.title}
                  className="mt-1 rounded-lg w-[460px] h-[259px] object-cover"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Danh sách bài học</CardTitle>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm bài học
          </Button>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileVideo className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium">Chưa có bài học nào</p>
              <p className="text-sm">Hãy thêm bài học đầu tiên cho khóa học này</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="group flex items-center justify-between p-4 border rounded-lg bg-white hover:border-pink-200 hover:shadow-sm transition-all duration-200"
                  onClick={() => navigate(`/admin/lesson-detail/${lesson.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                      <span className="text-pink-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">{lesson.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {lesson.videoDuration || "0:00"}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {lesson.videoViews || 0} lượt xem
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-pink-50 hover:text-pink-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/lesson-detail/${lesson.id}`);
                      }}
                    >
                      <FileVideo className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-50 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLesson(lesson);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài học</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài học "{selectedLesson?.title}" không?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteLesson(selectedLesson?.id)}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;
