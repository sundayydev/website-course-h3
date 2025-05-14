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
  Eye,
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
    duration: 0,
    videoUrl: '',
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

      const totalDuration = lessonsResponse.reduce((total, lesson) => total + lesson.duration, 0);
      setCourse((prevCourse) => ({
        ...prevCourse,
        duration: totalDuration,
      }));

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
    setNewLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        ...newLesson,
        courseId: courseId,
      };

      console.log('lessonData: ', lessonData);
      await createLesson(lessonData);
      toast.success('Thêm bài học thành công');
      fetchCourseData();
      setNewLesson({
        title: '',
        description: '',
        content: '',
        orderNumber: '',
        duration: 0,
        videoUrl: '',
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

  const formatDuration = (isoDuration) => {
    if (!isoDuration) return 0;

    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    let totalMinutes = hours * 60 + minutes;
    if (seconds >= 30) totalMinutes += 1;

    return totalMinutes;
  };

  // Hàm trích xuất ID video từ URL
  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return url?.match(regex)?.[1] || null;
  };

  // Hàm chuẩn bị video
  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleVideoUrlChange = async (e) => {
    const { value } = e.target;
    setNewLesson((prev) => ({
      ...prev,
      videoUrl: value,
      duration: 0,
    }));

    // Fetch new video data when URL changes
    if (value) {
      try {
        const videoId = value.split('v=')[1];
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,statistics&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        const duration = data.items[0].contentDetails.duration;
        const views = data.items[0].statistics.viewCount;
        setNewLesson((prev) => ({
          ...prev,
          duration: formatDuration(duration),
        }));
        setVideoViews(views);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    }
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
      <Card className="overflow-hidden border rounded-xl shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">Thông tin khóa học</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-pink-500 hover:bg-pink-600 text-white transition-colors shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bài học
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    Thêm bài học mới
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Điền thông tin bài học mới vào form dưới đây
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                  {/* Cột bên trái */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-medium text-gray-700">
                        Tiêu đề
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={newLesson.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề bài học"
                        className="focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-medium text-gray-700">
                        Mô tả
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newLesson.description}
                        onChange={handleInputChange}
                        placeholder="Nhập mô tả bài học"
                        className="min-h-24 focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content" className="font-medium text-gray-700">
                        Nội dung chi tiết
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={newLesson.content}
                        onChange={handleInputChange}
                        placeholder="Nhập nội dung chi tiết bài học"
                        className="min-h-32 focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderNumber" className="font-medium text-gray-700">
                          Số thứ tự
                        </Label>
                        <Input
                          type="number"
                          id="orderNumber"
                          name="orderNumber"
                          value={newLesson.orderNumber}
                          onChange={handleInputChange}
                          placeholder="Nhập số thứ tự bài học"
                          min="1"
                          className="focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration" className="font-medium text-gray-700">
                          Thời lượng (phút)
                        </Label>
                        <Input
                          type="number"
                          id="duration"
                          name="duration"
                          value={newLesson.duration}
                          onChange={handleInputChange}
                          placeholder="Thời lượng video"
                          min="0"
                          className="focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cột bên phải */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl" className="font-medium text-gray-700">
                        Video URL (YouTube)
                      </Label>
                      <Input
                        id="videoUrl"
                        name="videoUrl"
                        value={newLesson.videoUrl}
                        onChange={handleVideoUrlChange}
                        placeholder="Nhập URL video YouTube (ví dụ: https://www.youtube.com/watch?v=...)"
                        className="focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                      />
                    </div>

                    {newLesson.videoUrl && getEmbedUrl(newLesson.videoUrl) && (
                      <div className="mt-4 rounded-lg overflow-hidden border shadow-sm">
                        <iframe
                          width="100%"
                          height="280px"
                          src={getEmbedUrl(newLesson.videoUrl)}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="aspect-video"
                        />
                      </div>
                    )}

                    <input type="hidden" name="courseId" value={courseId} />
                  </div>

                  {/* Nút bấm */}
                  <div className="col-span-2 flex justify-end mt-6">
                    <Button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      Thêm bài học
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Thông tin bên trái */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-pink-50 px-3 py-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700 font-medium">{lessons.length} bài học</span>
                </div>

                <div className="flex items-center gap-2 bg-pink-50 px-3 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700 font-medium">
                    Thời lượng: {course.duration} phút
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin bên phải */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Giá</h3>
                {course.price === 0 ? (
                  <Badge
                    variant="success"
                    className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-md"
                  >
                    Miễn phí
                  </Badge>
                ) : (
                  <p className="text-2xl font-bold text-pink-600">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ảnh khóa học</h3>
                <div className="rounded-xl overflow-hidden shadow-sm border w-[460px] h-[259px]">
                  <img
                    src={
                      course.urlImage
                        ? import.meta.env.VITE_API_URL + course.urlImage
                        : import.meta.env.VITE_API_URL + '/uploads/placeholder.png'
                    }
                    alt={course.title}
                    className="w-[460px] h-[259px] object-cover"
                  />
                </div>
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
                      <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {lesson.duration + ' phút' || '0 phút'}
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
              Bạn có chắc chắn muốn xóa bài học "{selectedLesson?.title}" không? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteLesson(selectedLesson?.id)}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;
