import React, { useState, useEffect } from 'react';
import { getQuizzesByLessonId, submitAnswer } from '@/api/quizApi';
import { isAuthenticated } from '@/api/authUtils';
import { toast } from 'react-toastify';

const LessonQuiz = ({ lessonId }) => {
  console.log('LessonId nhận được trong LessonQuiz:', lessonId);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!lessonId) {
        setError('Vui lòng cung cấp lessonId hợp lệ.');
        setLoading(false);
        return;
      }

      try {
        const quizzesData = await getQuizzesByLessonId(lessonId);
        console.log('Dữ liệu câu hỏi từ API:', quizzesData); // Log để kiểm tra
        setQuizzes(quizzesData);
        setError('');
      } catch (err) {
        console.error('Lỗi khi lấy danh sách câu hỏi:', err);
        setError(err.message || 'Không thể tải câu hỏi.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [lessonId]);

  const handleAnswerChange = (quizId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: answer,
    }));
  };

  const handleSubmitAnswer = async (quizId) => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để trả lời câu hỏi.');
      return;
    }

    const userAnswer = selectedAnswers[quizId];
    if (!userAnswer) {
      toast.error('Vui lòng chọn một đáp án.');
      return;
    }

    try {
      console.log('Gửi đáp án:', { quizId, userAnswer }); // Log để kiểm tra
      const result = await submitAnswer({ quizId, userAnswer });
      console.log('Kết quả từ API:', result); // Log để kiểm tra
      setResults((prev) => ({
        ...prev,
        [quizId]: result,
      }));
      toast.success(result.IsCorrect ? 'Đáp án đúng!' : `Đáp án sai! ${result.Feedback || 'Không có phản hồi'}`);
    } catch (err) {
      console.error('Lỗi khi gửi đáp án:', err);
      toast.error(err.message || 'Lỗi khi gửi đáp án.');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải câu hỏi...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (quizzes.length === 0) return <p className="text-center text-gray-500">Chưa có câu hỏi nào cho bài học này.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Trắc nghiệm bài học</h3>
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="font-medium mb-2">{quiz.question}</p>
          <div className="space-y-2">
            {quiz.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`quiz-${quiz.id}`}
                  value={option}
                  checked={selectedAnswers[quiz.id] === option}
                  onChange={() => handleAnswerChange(quiz.id, option)}
                  className="form-radio h-4 w-4 text-blue-600"
                  disabled={results[quiz.id]}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {results[quiz.id] && (
            <div className="mt-2">
              <p className={results[quiz.id].IsCorrect ? 'text-green-600' : 'text-red-600'}>
                {results[quiz.id].IsCorrect ? 'Đúng!' : `Sai! ${results[quiz.id].Feedback || 'Không có phản hồi'}`}
              </p>
            </div>
          )}
          {!results[quiz.id] && (
            <button
              onClick={() => handleSubmitAnswer(quiz.id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Gửi đáp án
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonQuiz;