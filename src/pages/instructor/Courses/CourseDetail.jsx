// app/admin/courses/[courseId]/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Flag,
  Star,
  Trash,
  User,
  XCircle,
  Play,
  Pencil,
  Check,
  Trash2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ConfirmDeleteDialog from '@/components/instructor/course/ConfirmDeleteDialog';
import CourseStats from '@/components/instructor/course/CourseStats';
import CourseBasicInfo from '@/components/instructor/course/CourseBasicInfo';
import MediaPlayer from '@/components/MediaPlayer';

import { getCourseById } from '@/api/courseApi';
import { getUserById } from '@/api/userApi';
import { getCategoryById } from '@/api/categoryApi';
import { getReviewsByCourseId, updateReview, deleteReview } from '@/api/reviewApi';
import { getChaptersByCourseId, deleteChapter } from '@/api/chapterApi';
import { getLessonsByChapterId, deleteLesson, getVideoLesson } from '@/api/lessonApi';
import { getEnrollmentsByCourseId } from '@/api/enrollmentApi';
import { getStudentById } from '@/api/studentApi';
import { getProgressByUserAndLesson } from '@/api/progressApi';
import { formatDate } from '@/utils/formatDate';

import { toast } from 'react-hot-toast';
import { getCourseAnalytics, COLORS } from '@/api/analyticsApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function CourseDetail() {
  const { id } = useParams();
  const courseId = id;

  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [instructor, setInstructor] = useState();
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [category, setCategory] = useState(course.category);
  const [chapters, setChapters] = useState([]);
  const [totalLessons, setTotalLessons] = useState(
    chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
  );
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [analytics, setAnalytics] = useState({
    revenue: [],
    enrollments: [],
    demographics: {
      locations: [],
      ageGroups: [],
    },
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const coursesCount = 0;
  const enrolledStudents = 0;

  useEffect(() => {
    const fetchData = async () => {
      // First fetch course data
      const data = await getCourseById(courseId);
      setCourse(data);

      // Then fetch instructor and category details only if course data exists
      if (data) {
        const instructorData = await getUserById(data.instructorId);
        setInstructor(instructorData.data);

        const categoryData = await getCategoryById(data.categoryId);
        setCategory(categoryData);

        const reviewsData = await getReviewsByCourseId(data.id);
        setReviews(reviewsData);

        // Fetch chapters and their lessons
        const chaptersData = await getChaptersByCourseId(data.id);
        const chaptersWithLessons = await Promise.all(
          chaptersData.map(async (chapter) => {
            const lessons = await getLessonsByChapterId(chapter.id);
            return { ...chapter, lessons };
          })
        );
        setChapters(chaptersWithLessons);
      }
    };

    fetchData();
  }, [courseId]);

  // Fetch enrollments when courseId changes
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const enrollmentsData = await getEnrollmentsByCourseId(courseId);

        // Fetch additional student details and progress for each enrollment
        const enrichedEnrollments = await Promise.all(
          enrollmentsData.map(async (enrollment) => {
            try {
              // Get student details
              const studentData = await getStudentById(enrollment.userId);

              // Calculate overall progress
              let totalProgress = 0;
              let completedLessons = 0;

              // Get progress for each lesson in the course
              for (const chapter of chapters) {
                for (const lesson of chapter.lessons) {
                  const progress = await getProgressByUserAndLesson(enrollment.userId, lesson.id);
                  if (progress) {
                    totalProgress += progress.completionPercentage;
                    if (progress.completionPercentage === 100) {
                      completedLessons++;
                    }
                  }
                }
              }

              const averageProgress =
                chapters.length > 0
                  ? Math.round(totalProgress / (chapters.length * chapters[0].lessons.length))
                  : 0;

              return {
                ...enrollment,
                studentName: studentData.fullName,
                studentEmail: studentData.email,
                completionPercentage: averageProgress,
                completedLessons,
                status:
                  averageProgress === 100
                    ? 'completed'
                    : averageProgress > 0
                      ? 'active'
                      : 'not_started',
              };
            } catch (error) {
              console.error('Error fetching student details:', error);
              return enrollment;
            }
          })
        );

        setEnrollments(enrichedEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setError('Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [courseId, chapters]);

  // Fetch reviews when courseId changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;

      try {
        setReviewLoading(true);
        const reviewsData = await getReviewsByCourseId(courseId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewError('Không thể tải đánh giá');
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  // Add useEffect for analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!courseId) return;

      try {
        setAnalyticsLoading(true);
        const data = await getCourseAnalytics(courseId);
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [courseId]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateAverageRating = (reviews) => {
    // Kiểm tra nếu mảng reviews rỗng hoặc không tồn tại
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    // Tính tổng tất cả các rating
    const totalRating = reviews.reduce((sum, review) => {
      // Kiểm tra nếu review có rating và rating là số hợp lệ
      const rating = parseFloat(review.rating);
      return !isNaN(rating) ? sum + rating : sum;
    }, 0);

    // Tính trung bình và làm tròn đến 1 chữ số thập phân
    const averageRating = totalRating / reviews.length;
    return Math.round(averageRating * 10) / 10;
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      setIsDeleting(true);
      await deleteChapter(chapterId);
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
      toast.success('Xóa chương thành công');
    } catch (error) {
      toast.error('Không thể xóa chương');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      setIsDeleting(true);
      await deleteLesson(lessonId);
      setChapters(
        chapters.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.filter((lesson) => lesson.id !== lessonId),
        }))
      );
      toast.success('Xóa bài học thành công');
    } catch (error) {
      toast.error('Không thể xóa bài học');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewVideo = async (lesson) => {
    try {
      setSelectedLesson(lesson);
      const urlVideo = import.meta.env.VITE_API_URL + '/api/lesson/stream/' + lesson.videoName;
      setVideoUrl(urlVideo);
      setIsVideoDialogOpen(true);
    } catch (error) {
      toast.error('Không thể tải video');
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await updateReview(reviewId, { status: 'approved' });
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, status: 'approved' } : review
        )
      );
      toast.success('Đã phê duyệt đánh giá');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Không thể phê duyệt đánh giá');
    }
  };

  const handleFlagReview = async (reviewId) => {
    try {
      await updateReview(reviewId, { status: 'flagged' });
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, status: 'flagged' } : review
        )
      );
      toast.success('Đã gắn cờ đánh giá');
    } catch (error) {
      console.error('Error flagging review:', error);
      toast.error('Không thể gắn cờ đánh giá');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success('Đã xóa đánh giá');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Không thể xóa đánh giá');
    }
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p>The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button className="mt-6" variant="outline" onClick={() => navigate('/instructor/courses')}>
          Return to Course List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 overflow-scroll">
      {/* Admin Actions Header */}

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/instructor/courses')}>
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Chi tiết khóa học
            {/* <CourseStatusBadge status={course.status} /> */}
          </h1>
          <p className="text-muted-foreground mt-1">
            Mã khóa học <span className="font-semibold text-pink-500">#{courseId}</span>{' '}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue={course.status}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="reviewing">Đang xem xét</SelectItem>
              <SelectItem value="rejected">Loại bỏ</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => navigate(`/details/${courseId}`)}>
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/instructor/course/${courseId}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <ConfirmDeleteDialog title={course.title} />
        </div>
      </div>

      {/* Course Stats */}
      <CourseStats rating={calculateAverageRating(reviews)} reviewCount={reviews.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Basic Info */}
          <CourseBasicInfo courseId={courseId} course={course} category={category} />

          {/* Content Tabs */}
          <Tabs defaultValue="curriculum">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curriculum">Nội dung khóa học</TabsTrigger>
              <TabsTrigger value="enrollments">Học viên</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            </TabsList>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Nội dung khóa học</CardTitle>
                    <CardDescription>Quản lý nội dung và cấu trúc khóa học</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/instructor/course/${courseId}/lessons`)}
                  >
                    Thêm
                  </Button>
                </CardHeader>

                <CardContent>
                  {chapters.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {chapters.map((chapter, index) => (
                        <AccordionItem key={chapter.id} value={`chapter-${index}`}>
                          <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-lg">
                            <div className="flex items-center text-left">
                              <span className="bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center text-xs mr-3">
                                {chapter.orderNumber}
                              </span>
                              <div>
                                <h3 className="font-medium">{chapter.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {chapter.lessons.length} lessons •{' '}
                                  {formatDuration(
                                    chapter.lessons.reduce(
                                      (sum, lesson) => sum + lesson.duration,
                                      0
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent>
                            <div className="pl-4 pr-2 space-y-2">
                              {chapter.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className="mr-3 bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200"
                                      onClick={() => handlePreviewVideo(lesson)}
                                    >
                                      <Play className="h-4 w-4 text-gray-700" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{lesson.title}</h4>
                                      <p className="text-sm text-gray-500">{lesson.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge
                                      variant={lesson.status === 'Approved' ? 'default' : 'outline'}
                                    >
                                      {lesson.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500 whitespace-nowrap">
                                      {lesson.duration} min
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          navigate(
                                            `/instructor/course/${courseId}/lessons/edit/${lesson.id}`
                                          )
                                        }
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Bạn có chắc chắn muốn xóa bài học này? Hành động này
                                              không thể hoàn tác.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteLesson(lesson.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Xóa
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No curriculum content has been added yet.
                      </p>
                      <Button
                        onClick={() =>
                          navigate(`/instructor/courses/${courseId}/curriculum/create`)
                        }
                      >
                        Create Curriculum
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Video Preview Dialog */}
              <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{selectedLesson?.title}</DialogTitle>
                    <DialogDescription>{selectedLesson?.description}</DialogDescription>
                  </DialogHeader>
                  {videoUrl && (
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                      <MediaPlayer
                        type="video"
                        url={videoUrl}
                        title={selectedLesson?.title}
                        controls={true}
                        autoplay={false}
                        muted={false}
                        loop={false}
                        playsinline={true}
                        preload="auto"
                        poster={selectedLesson?.thumbnailUrl}
                      />
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
                      Đóng
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Học viên đã đăng ký</CardTitle>
                  <CardDescription>Danh sách học viên đã đăng ký khóa học này</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Học viên</TableHead>
                          <TableHead>Ngày đăng ký</TableHead>
                          <TableHead>Tiến độ</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{enrollment.studentName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {enrollment.studentEmail}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(enrollment.createdAt)}</TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      enrollment.completionPercentage >= 80
                                        ? 'bg-green-500'
                                        : enrollment.completionPercentage >= 40
                                          ? 'bg-amber-500'
                                          : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${enrollment.completionPercentage}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{enrollment.completedLessons} bài học hoàn thành</span>
                                  <span>{enrollment.completionPercentage}%</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  enrollment.status === 'completed'
                                    ? 'default'
                                    : enrollment.status === 'active'
                                      ? 'secondary'
                                      : 'outline'
                                }
                              >
                                {enrollment.status === 'completed'
                                  ? 'Hoàn thành'
                                  : enrollment.status === 'active'
                                    ? 'Đang học'
                                    : 'Chưa bắt đầu'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(`/instructor/students/${enrollment.userId}`)
                                }
                              >
                                Xem chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {enrollments.length} học viên
                  </div>
                  <Button variant="outline" size="sm">
                    Xuất danh sách
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá khóa học</CardTitle>
                  <CardDescription>Quản lý đánh giá và xếp hạng của học viên</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Đánh giá ({reviews.length})</h3>
                      {reviews.length > 3 && (
                        <Button variant="ghost" onClick={() => setShowAllReviews(!showAllReviews)}>
                          {showAllReviews ? 'Thu gọn' : 'Xem tất cả'}
                        </Button>
                      )}
                    </div>

                    {reviewLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : reviewError ? (
                      <div className="text-red-500">{reviewError}</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-gray-500">Chưa có đánh giá nào</div>
                    ) : (
                      <div className="space-y-4">
                        {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar>
                                    <AvatarImage src={review.user?.avatar} />
                                    <AvatarFallback>
                                      {review.user?.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{review.user?.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {review.status === 'pending' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApproveReview(review.id)}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Phê duyệt
                                    </Button>
                                  )}
                                  {review.status !== 'flagged' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleFlagReview(review.id)}
                                    >
                                      <Flag className="h-4 w-4 mr-1" />
                                      Gắn cờ
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteReview(review.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center mb-2">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-500">
                                    {review.rating}/5
                                  </span>
                                </div>
                                <p className="text-gray-700">{review.content}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê khóa học</CardTitle>
                  <CardDescription>Số liệu và thông tin chi tiết</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="space-y-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                          <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Revenue Chart */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Doanh thu theo thời gian</h3>
                        <div className="w-full h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.revenue}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="amount" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Enrollment Chart */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Số lượng học viên theo thời gian
                        </h3>
                        <div className="w-full h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.enrollments}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Demographics */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Thông tin học viên</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Location Chart */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Phân bố địa lý</h4>
                            <div className="w-full h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={analytics.demographics.locations}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                  >
                                    {analytics.demographics.locations.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Age Distribution */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Phân bố độ tuổi</h4>
                            <div className="w-full h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.demographics.ageGroups}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="range" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="count" fill="#ffc658" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">
                              Tổng doanh thu
                            </div>
                            <div className="text-2xl font-bold">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(
                                analytics.revenue.reduce((sum, item) => sum + item.amount, 0)
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">
                              Tổng học viên
                            </div>
                            <div className="text-2xl font-bold">{enrollments.length}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">
                              Tỷ lệ hoàn thành
                            </div>
                            <div className="text-2xl font-bold">
                              {Math.round(
                                (enrollments.filter((e) => e.status === 'completed').length /
                                  enrollments.length) *
                                  100
                              )}
                              %
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">
                              Đánh giá trung bình
                            </div>
                            <div className="text-2xl font-bold">
                              {calculateAverageRating(reviews)}/5
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Người tạo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructor ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {instructor.avatarUrl ? (
                        <img
                          src={instructor.avatarUrl}
                          alt={instructor.fullName}
                          className="rounded-full w-[64px] h-[64px] object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <User size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{instructor.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{instructor.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Courses</p>
                        <p className="font-medium">{coursesCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Students</p>
                        <p className="font-medium">{enrolledStudents}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <p className="text-sm mb-4">{instructor.bio}</p>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/instructors/profile/${instructor.id}`)}
                    >
                      View Full Profile
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Instructor information not available.</p>
                )}
              </CardContent>
            </Card>

            {/* Course Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt khóa học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Hiển thị</label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chế độ hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Công khai</SelectItem>
                      <SelectItem value="private">Riêng tư</SelectItem>
                      <SelectItem value="password">Bảo vệ bằng mật khẩu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Trạng thái nổi bật</label>
                  <Select defaultValue="not-featured">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái nổi bật" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Nổi bật</SelectItem>
                      <SelectItem value="not-featured">Không nổi bật</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Bình luận</label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue placeholder="Cài đặt bình luận" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Cho phép</SelectItem>
                      <SelectItem value="moderated">Kiểm duyệt</SelectItem>
                      <SelectItem value="disabled">Tắt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Lưu cài đặt</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
