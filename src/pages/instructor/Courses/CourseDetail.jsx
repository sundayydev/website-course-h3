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
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { format } from 'date-fns';
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

import { getCourseById } from '@/api/courseApi';
import { getUserById } from '@/api/userApi';
import { getCategoryById } from '@/api/categoryApi';
import { getReviewsByCourseId } from '@/api/reviewApi'

export default function CourseDetail() {
  // Mock data based on the provided models
  // const course = useMemo(
  //   () => ({
  //     id: 'CRS-xj4k2m9p',
  //     title: 'Web Development Masterclass',
  //     description:
  //       'A comprehensive course covering all aspects of modern web development from basics to advanced concepts.',
  //     price: 299.99,
  //     urlImage: '/api/placeholder/640/360',
  //     instructorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //     categoryId: '5da85f64-5717-4562-b3fc-2c963f66afb7',
  //     createdAt: '01-05-2025 14:30:45',
  //     user: {
  //       id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //       fullName: 'John Smith',
  //       email: 'john.smith@example.com',
  //       profileImage: '/api/placeholder/100/100',
  //       role: 'Teacher',
  //     },
  //     category: {
  //       id: '5da85f64-5717-4562-b3fc-2c963f66afb7',
  //       name: 'Programming',
  //       description: 'Learn programming and software development skills',
  //     },
  //     contents: [
  //       'HTML5 & CSS3 Fundamentals',
  //       'JavaScript Programming',
  //       'Responsive Design',
  //       'Backend Development with Node.js',
  //     ],
  //   }),
  //   []
  // );

  // // Mock chapters and lessons data
  // const chapters = [
  //   {
  //     id: '6fa85f64-5717-4562-b3fc-2c963f66afc8',
  //     title: 'Getting Started with Web Development',
  //     courseId: 'CRS-xj4k2m9p',
  //     orderNumber: 1,
  //     description: 'Introduction to the fundamental concepts of web development',
  //     lessons: [
  //       {
  //         id: 'LES-r8k2n3p5',
  //         title: 'Introduction to HTML',
  //         description: 'Learn the basics of HTML markup language',
  //         content: "In this lesson, we'll cover the structure of HTML documents...",
  //         videoUrls: ['https://example.com/videos/intro-html.mp4'],
  //         duration: 45,
  //         orderNumber: 1,
  //         status: 'Approved',
  //       },
  //       {
  //         id: 'LES-t9m4p6s2',
  //         title: 'CSS Basics',
  //         description: 'Understanding CSS styling for web pages',
  //         content: 'CSS is used to style HTML elements...',
  //         videoUrls: [
  //           'https://example.com/videos/css-basics-1.mp4',
  //           'https://example.com/videos/css-basics-2.mp4',
  //         ],
  //         duration: 60,
  //         orderNumber: 2,
  //         status: 'Approved',
  //       },
  //     ],
  //   },
  //   {
  //     id: '7fa85f64-5717-4562-b3fc-2c963f66afd9',
  //     title: 'JavaScript Fundamentals',
  //     courseId: 'CRS-xj4k2m9p',
  //     orderNumber: 2,
  //     description: 'Learn the basics of JavaScript programming language',
  //     lessons: [
  //       {
  //         id: 'LES-v2q7r4t8',
  //         title: 'JavaScript Syntax',
  //         description: 'Understanding JavaScript syntax and basic constructs',
  //         content:
  //           'JavaScript is a programming language that allows you to implement complex features on web pages...',
  //         videoUrls: ['https://example.com/videos/js-syntax.mp4'],
  //         duration: 55,
  //         orderNumber: 1,
  //         status: 'Approved',
  //       },
  //       {
  //         id: 'LES-w3s8t5u9',
  //         title: 'DOM Manipulation',
  //         description: 'Learn how to interact with the Document Object Model',
  //         content:
  //           'The Document Object Model (DOM) is a programming interface for web documents...',
  //         videoUrls: ['https://example.com/videos/dom-manipulation.mp4'],
  //         duration: 65,
  //         orderNumber: 2,
  //         status: 'Pending',
  //       },
  //     ],
  //   },
  // ];

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
    chapters.reduce((total, chapter) => total + chapter.lessons.length, 0));


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

        const reviewsData = await getReviewsByCourseId(data.id)
        setReviews(reviewsData);
      }
    };
    
    fetchData();
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

  const userReview = async (userId) => {
    const data = await getUserById(userId);
    return data.fullName
  }

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

        <div className='flex items-center gap-4'>
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
      <CourseStats rating={calculateAverageRating(reviews)} reviewCount={reviews.length}/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Basic Info */}
          <CourseBasicInfo courseId={courseId} course={course} category={category}/>

          {/* Content Tabs */}
          <Tabs defaultValue="curriculum">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>Manage course content and structure</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/instructor/courses/${courseId}/curriculum/edit`)}
                  >
                    Edit Curriculum
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
                                    <div className="mr-3 bg-gray-100 rounded-full p-2">
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
                        onClick={() => navigate(`/instructor/courses/${courseId}/curriculum/create`)}
                      >
                        Create Curriculum
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Enrollments</CardTitle>
                  <CardDescription>Students enrolled in this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                          <TableCell>
                            {format(new Date(enrollment.enrollDate), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${
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
                            <div className="text-xs text-muted-foreground mt-1 text-right">
                              {enrollment.completionPercentage}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.status === 'active'
                                  ? 'default'
                                  : enrollment.status === 'completed'
                                    ? 'outline'
                                    : 'destructive'
                              }
                            >
                              {enrollment.status.charAt(0).toUpperCase() +
                                enrollment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/students/${enrollment.id}`)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {enrollments.length} of {course.enrollments} enrollments
                  </div>
                  <Button variant="outline" size="sm">
                    View All Enrollments
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
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{review.userFullName}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* <Badge
                              variant={
                                review.status === 'approved'
                                  ? 'default'
                                  : review.status === 'pending'
                                    ? 'outline'
                                    : 'destructive'
                              }
                            >
                              {review.status}
                            </Badge> */}
                            <div className="text-xs text-muted-foreground">
                              {review.createdAt}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <div className="flex justify-end gap-2 mt-4">
                          {review.status !== 'approved' && (
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          )}
                          {review.status !== 'flagged' && (
                            <Button variant="outline" size="sm" className="text-amber-600">
                              <Flag className="mr-1 h-4 w-4" />
                              Flag
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <XCircle className="mr-1 h-4 w-4" />
                            Xóa đánh giá
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Analytics</CardTitle>
                  <CardDescription>Performance metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Revenue Chart Placeholder */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Revenue Over Time</h3>
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Revenue chart placeholder</p>
                      </div>
                    </div>

                    {/* Enrollment Chart Placeholder */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Enrollments Over Time</h3>
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Enrollments chart placeholder</p>
                      </div>
                    </div>

                    {/* Demographics */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Student Demographics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location Chart Placeholder */}
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Geographic distribution</p>
                        </div>

                        {/* Age Distribution Placeholder */}
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Age distribution</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Visibility</label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="password">Password Protected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Featured Status</label>
                  <Select defaultValue="not-featured">
                    <SelectTrigger>
                      <SelectValue placeholder="Select featured status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="not-featured">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Comments</label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue placeholder="Comment settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="moderated">Moderated</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>

            {/* Approval Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="outline" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Request Changes
                </Button>

                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Course
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the course &quot;
                        {course.title}&quot; and remove all associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
