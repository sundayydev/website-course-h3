import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCourseById } from '@/api/courseApi';
import { getChaptersByCourseId, updateChapter, deleteChapter } from '@/api/chapterApi';
import { getLessons, updateLesson, deleteLesson } from '@/api/lessonApi';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

export default function ManageLessons() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseById(courseId);
        const chaptersData = await getChaptersByCourseId(courseId);
        const lessonsData = await getLessons(courseId);
        setCourse(courseData);
        setChapters(chaptersData);
        setLessons(lessonsData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      }
    };
    fetchData();
  }, [courseId]);

  // Chapter operations
  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setIsEditingChapter(true);
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(chapterId);
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    } catch (err) {
      setError('Failed to delete chapter');
    }
  };

  const handleUpdateChapter = async (updatedChapter) => {
    try {
      const result = await updateChapter(updatedChapter);
      setChapters(chapters.map((chapter) => (chapter.id === result.id ? result : chapter)));
      setIsEditingChapter(false);
    } catch (err) {
      setError('Failed to update chapter');
    }
  };

  // Lesson operations
  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditingLesson(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
    } catch (err) {
      setError('Failed to delete lesson');
    }
  };

  const handleUpdateLesson = async (updatedLesson) => {
    try {
      const result = await updateLesson(updatedLesson);
      setLessons(lessons.map((lesson) => (lesson.id === result.id ? result : lesson)));
      setIsEditingLesson(false);
    } catch (err) {
      setError('Failed to update lesson');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 h-screen overflow-y-auto ">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/instructor/courses')}>
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">Quản lý nội dung khóa học</h1>
        </div>
        <Button onClick={() => navigate(`/instructor/course/${courseId}/content/add`)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm nội dung
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Chapters List - 4 columns */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Danh sách chương</CardTitle>
            <CardDescription>Quản lý các chương trong khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{chapter.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {lessons.filter((l) => l.chapterId === chapter.id).length} bài học
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditChapter(chapter);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChapter(chapter.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Lessons List and Content - 8 columns */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>{selectedChapter ? selectedChapter.title : 'Chọn một chương'}</CardTitle>
              <CardDescription>
                {selectedChapter
                  ? selectedChapter.description
                  : 'Vui lòng chọn một chương để xem bài học'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedChapter && (
                <div className="space-y-6">
                  {lessons
                    .filter((lesson) => lesson.chapterId === selectedChapter.id)
                    .map((lesson) => (
                      <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">{lesson.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Thời lượng: {lesson.duration} phút
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditLesson(lesson)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="prose max-w-none">
                          <MDEditor.Markdown source={lesson.content} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Chapter Dialog */}
      <Dialog open={isEditingChapter} onOpenChange={setIsEditingChapter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chương</DialogTitle>
            <DialogDescription>Cập nhật thông tin chương học</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="chapterTitle">Tiêu đề</Label>
              <Input
                id="chapterTitle"
                value={selectedChapter?.title || ''}
                onChange={(e) => setSelectedChapter({ ...selectedChapter, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="chapterDescription">Mô tả</Label>
              <Textarea
                id="chapterDescription"
                value={selectedChapter?.description || ''}
                onChange={(e) =>
                  setSelectedChapter({ ...selectedChapter, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingChapter(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleUpdateChapter(selectedChapter)}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={isEditingLesson} onOpenChange={setIsEditingLesson}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài học</DialogTitle>
            <DialogDescription>Cập nhật thông tin và nội dung bài học</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lessonTitle">Tiêu đề</Label>
              <Input
                id="lessonTitle"
                value={selectedLesson?.title || ''}
                onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lessonDescription">Mô tả</Label>
              <Textarea
                id="lessonDescription"
                value={selectedLesson?.description || ''}
                onChange={(e) =>
                  setSelectedLesson({ ...selectedLesson, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Nội dung</Label>
              <div data-color-mode="light">
                <MDEditor
                  value={selectedLesson?.content || ''}
                  onChange={(value) => setSelectedLesson({ ...selectedLesson, content: value })}
                  height={400}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingLesson(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleUpdateLesson(selectedLesson)}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
