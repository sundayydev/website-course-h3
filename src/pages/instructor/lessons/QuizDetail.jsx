import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getQuizById } from '@/api/quizApi';

export default function QuizDetail() {
  const { quizId, courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const quizData = await getQuizById(quizId);
        setQuiz(quizData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu câu hỏi');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [quizId]);

  const parseOptions = (serializedOptions) => {
    try {
      return JSON.parse(serializedOptions) || [];
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/instructor/course/${courseId}/lesson/${lessonId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại
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
              <Skeleton className="h-4 w-1/2 mt-4" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Lỗi</h3>
          <p className="text-gray-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate(`/instructor/course/${courseId}/lesson/${lessonId}`)}
            className="mt-4"
          >
            Quay lại
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chi Tiết Câu Hỏi</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen size={20} className="mr-2" />
                Thông Tin Câu Hỏi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ID Câu Hỏi</h3>
                  <p className="text-lg">{quiz?.id || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Câu hỏi</h3>
                  <p className="text-lg">{quiz?.question || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lựa chọn</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {quiz?.options?.length > 0 ? (
                      quiz.options.map((option, index) => (
                        <li key={index} className={option === quiz.correctAnswer ? 'text-green-600 font-medium' : ''}>
                          {option}
                        </li>
                      ))
                    ) : (
                      <p>Không có lựa chọn</p>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Đáp án đúng</h3>
                  <p className="text-lg font-medium text-green-600">{quiz?.correctAnswer || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lời giải</h3>
                  <p className="text-gray-700">{quiz?.explanation || 'Không có lời giải'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bài học ID</h3>
                  <p className="text-gray-700">{quiz?.lessonId || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                  <p className="text-gray-700">{quiz?.createdAt || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}