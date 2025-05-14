import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  Save,
  Edit,
  X,
} from 'lucide-react';

// Import các API
import { getLessonById, updateLesson, deleteLesson } from '@/api/lessonApi';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLesson, setEditedLesson] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [videoDuration, setVideoDuration] = useState('');
  const [videoViews, setVideoViews] = useState('');

  // Lấy dữ liệu bài học
  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  //Tạo nút trở về trang danh sách bài học
  const handleBackCourse = () => {
    const courseId = lesson.courseId;
    return `/admin/course-detail/${courseId}`;
  };

  // Hàm lấy dữ liệu bài học
  const fetchLessonData = async () => {
    try {
      const response = await getLessonById(lessonId);
      setLesson(response);
      setEditedLesson(response);

      // Fetch video data when lesson loads
      if (response.videoUrl) {
        let videoId = null;

        // Hỗ trợ nhiều định dạng URL
        if (response.videoUrl.includes('v=')) {
          videoId = response.videoUrl.split('v=')[1]?.split('&')[0];
        } else if (response.videoUrl.includes('youtu.be/')) {
          videoId = response.videoUrl.split('youtu.be/')[1]?.split('?')[0];
        }

        if (videoId) {
          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,statistics&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
          );

          if (!videoResponse.ok) {
            throw new Error('Không thể lấy thông tin video từ YouTube');
          }

          const videoData = await videoResponse.json();
          const item = videoData.items?.[0];

          if (item) {
            setVideoDuration(item.contentDetails.duration);
            setVideoViews(item.statistics.viewCount);
          } else {
            console.warn('Không tìm thấy video từ YouTube API');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Không thể tải thông tin bài học');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý sự kiện khi thay đổi dữ liệu bài học
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm định dạng thời gian video
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

  // Hàm xử lý sự kiện khi thay đổi URL video
  const handleVideoUrlChange = async (e) => {
    const { value } = e.target;
    setEditedLesson((prev) => ({
      ...prev,
      videoUrl: value,
      videoViews: 0,
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
        setEditedLesson((prev) => ({
          ...prev,
          duration: formatDuration(duration),
        }));
        setVideoViews(views);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    }
  };

  // Hàm xử lý sự kiện khi lưu bài học
  const handleSave = async () => {
    try {
      await updateLesson(lessonId, editedLesson);
      setLesson(editedLesson);
      setIsEditing(false);
      toast.success('Cập nhật bài học thành công');
    } catch (error) {
      toast.error('Cập nhật bài học thất bại');
      console.error('Error:', error);
    }
  };

  // Hàm xử lý sự kiện khi xóa bài học
  const handleDelete = async () => {
    try {
      await deleteLesson(lessonId);
      toast.success('Xóa bài học thành công');
      navigate('/admin/lessons');
    } catch (error) {
      toast.error('Xóa bài học thất bại');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-[calc(1520px-250px)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Link to={handleBackCourse()}>
              <ArrowLeft className="h-6 w-6 text-pink-500" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết bài học</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="border-b">
            <CardTitle className="text-xl text-gray-800">Thông tin bài học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Tên bài học</Label>
              {isEditing ? (
                <Input
                  name="title"
                  value={editedLesson.title}
                  onChange={handleInputChange}
                  className="focus:ring-2 focus:ring-pink-500"
                  placeholder="Nhập tên bài học"
                />
              ) : (
                <p className="text-lg text-gray-900 font-medium">{lesson.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Mô tả</Label>
              {isEditing ? (
                <Textarea
                  name="description"
                  value={editedLesson.description}
                  onChange={handleInputChange}
                  className="min-h-[100px] focus:ring-2 focus:ring-pink-500"
                  placeholder="Nhập mô tả bài học"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Nội dung bài học</Label>
              {isEditing ? (
                <Textarea
                  name="content"
                  value={editedLesson.content}
                  onChange={handleInputChange}
                  className="min-h-[100px] focus:ring-2 focus:ring-pink-500"
                  placeholder="Nhập nội dung bài học"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{lesson.content}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Thứ tự</Label>
              {isEditing ? (
                <Input
                  type="number"
                  name="orderNumber"
                  value={editedLesson.orderNumber}
                  onChange={handleInputChange}
                  className="w-32 focus:ring-2 focus:ring-pink-500"
                  min="1"
                />
              ) : (
                <p className="text-gray-900 font-medium">{lesson.orderNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Thời gián</Label>
              {isEditing ? (
                <Input
                  type="number"
                  name="duration"
                  value={editedLesson.duration}
                  onChange={handleInputChange}
                  className="w-32 focus:ring-2 focus:ring-pink-500"
                  min="1"
                />
              ) : (
                <p className="text-gray-900 font-medium">{lesson.duration} Phút</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nội dung bài học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Video URL</Label>
              {isEditing ? (
                <>
                  <Input
                    name="videoUrl"
                    value={editedLesson.videoUrl}
                    onChange={handleVideoUrlChange}
                    placeholder="Nhập URL video YouTube (ví dụ: https://www.youtube.com/watch?v=...)"
                    className="w-full focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="mt-4 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <iframe
                      width="100%"
                      height="340px"
                      src={getEmbedUrl(editedLesson.videoUrl)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="h-5 w-5 text-pink-500" />
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600 hover:underline font-medium"
                    >
                      Xem video trên YouTube
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <iframe
                      width="100%"
                      height="340px"
                      src={
                        lesson.videoUrl
                          ? `https://www.youtube.com/embed/${lesson.videoUrl.split('v=')[1]}`
                          : ''
                      }
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>Thống kê video</Label>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700 font-medium">
                    {lesson.videoDuration || '0:00'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700 font-medium">
                    {lesson.videoViews || 0} lượt xem
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tài liệu đính kèm</Label>
              {isEditing ? (
                <Input
                  name="attachments"
                  value={editedLesson.attachments}
                  onChange={handleInputChange}
                  className="w-full focus:ring-2 focus:ring-pink-500"
                  placeholder="Nhập đường dẫn tài liệu đính kèm"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <FileVideo className="h-5 w-5 text-pink-500" />
                  <p className="font-medium">{lesson.attachments || 'Không có tài liệu'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài học này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonDetail;
