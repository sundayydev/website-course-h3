import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getLessonById } from '@/api/lessonApi';
import { getQuizzesByLessonId } from '@/api/quizApi';

export default function LessonDetail() {
  const { lessonId, courseId } = useParams(); // Lấy cả courseId và lessonId từ URL
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);
        const lessonData = await getLessonById(lessonId);
        const quizData = await getQuizzesByLessonId(lessonId);
        setLesson(lessonData);
        setQuizzes(quizData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu bài học');
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId]);

  const handleAddQuiz = () => {
    if (!courseId || !lessonId) {
      setError('Thiếu ID khóa học hoặc bài học');
      return;
    }
    navigate(`/instructor/course/${courseId}/lesson/${lessonId}/add-quiz`);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/instructor/course/${courseId}/lessons`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleAddQuiz}
          disabled={loading}
        >
          <Plus size={16} className="mr-2" />
          Thêm Câu Hỏi
        </Button>
      </div>

      {loading ? (
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Lỗi</h3>
          <p className="text-gray-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate(`/instructor/course/${courseId}/lessons`)}
            className="mt-4"
          >
            Quay lại
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{lesson?.title || 'Bài Học'}</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông Tin Bài Học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tiêu đề</h3>
                  <p className="text-lg">{lesson?.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mô tả</h3>
                  <p className="text-gray-700">{lesson?.description || 'Không có mô tả'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                  <p className="text-gray-700">{lesson?.createdAt?.split(' ')[0] || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen size={20} className="mr-2" />
                Câu Hỏi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Chưa có câu hỏi nào cho bài học này.</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleAddQuiz}
                  >
                    <Plus size={16} className="mr-2" />
                    Thêm Câu Hỏi Đầu Tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/instructor/course/${courseId}/lesson/quiz/${quiz.id}`)}
                    >
                      <h3 className="font-medium">{quiz.question}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Lựa chọn: {quiz.options?.join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Đáp án đúng: {quiz.correctAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}