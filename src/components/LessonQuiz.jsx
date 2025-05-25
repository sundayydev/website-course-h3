/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { getQuizzesByLessonId, submitAndCheckAnswer, getUserAnswersByLessonId, deleteUserAnswersByLessonId } from '@/api/quizApi';
import { isAuthenticated } from '@/api/authUtils';
import { toast } from 'react-toastify';

const LessonQuiz = ({ lessonId }) => {
  console.log('LessonId nhận được trong LessonQuiz:', lessonId);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const cachedAnswers = localStorage.getItem(`selectedAnswers_${lessonId}`);
    return cachedAnswers ? JSON.parse(cachedAnswers) : {};
  });
  const [results, setResults] = useState(() => {
    const cachedResults = localStorage.getItem(`quizResults_${lessonId}`);
    return cachedResults ? JSON.parse(cachedResults) : {};
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzesAndAnswers = async () => {
      if (!lessonId) {
        setError('Vui lòng cung cấp lessonId hợp lệ.');
        setLoading(false);
        return;
      }

      try {
        const quizzesData = await getQuizzesByLessonId(lessonId);
        console.log('Dữ liệu câu hỏi từ API:', quizzesData);
        setQuizzes(quizzesData);

        const answersData = await getUserAnswersByLessonId(lessonId);
        console.log('Dữ liệu đáp án từ API:', answersData);
        const answersMap = answersData.reduce((map, ans) => {
          if (ans.quizId && ans.userAnswer) {
            map[ans.quizId] = ans.userAnswer;
          }
          return map;
        }, {});
        const resultsMap = answersData.reduce((map, ans) => {
          if (ans.quizId) {
            map[ans.quizId] = {
              isCorrect: ans.isCorrect ?? false,
              Feedback: ans.feedback ?? (ans.isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
            };
          }
          return map;
        }, {});

        setSelectedAnswers((prev) => {
          const updatedAnswers = { ...prev, ...answersMap };
          localStorage.setItem(`selectedAnswers_${lessonId}`, JSON.stringify(updatedAnswers));
          return updatedAnswers;
        });
        setResults((prev) => {
          const updatedResults = { ...prev, ...resultsMap };
          localStorage.setItem(`quizResults_${lessonId}`, JSON.stringify(updatedResults));
          return updatedResults;
        });

        setError('');
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError(err.message || 'Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzesAndAnswers();
  }, [lessonId]);

  const handleAnswerChange = (quizId, answer) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [quizId]: answer };
      localStorage.setItem(`selectedAnswers_${lessonId}`, JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
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
      console.log('Gửi đáp án:', { quizId, userAnswer });
      const result = await submitAndCheckAnswer({ quizId, userAnswer });
      console.log('Kết quả từ API (bao gồm feedback):', result);
      setResults((prev) => {
        const updatedResults = {
          ...prev,
          [quizId]: {
            isCorrect: result.isCorrect,
            Feedback: result.feedback || (result.isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
          },
        };
        localStorage.setItem(`quizResults_${lessonId}`, JSON.stringify(updatedResults));
        return updatedResults;
      });
      toast.success(result.isCorrect ? 'Đáp án đúng!' : `Đáp án sai! ${result.feedback || 'Không có phản hồi'}`);
    } catch (err) {
      console.error('Lỗi khi gửi đáp án:', err);
      toast.error(err.message || 'Lỗi khi gửi đáp án.');
    }
  };

  const handleReset = async () => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để làm lại bài trắc nghiệm.');
      return;
    }

    try {
      await deleteUserAnswersByLessonId(lessonId);
      setSelectedAnswers({});
      setResults({});
      localStorage.removeItem(`selectedAnswers_${lessonId}`);
      localStorage.removeItem(`quizResults_${lessonId}`);
      toast.success('Đã đặt lại bài trắc nghiệm!');
    } catch (err) {
      console.error('Lỗi khi làm lại bài trắc nghiệm:', err);
      toast.error('Không thể làm lại bài trắc nghiệm: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-gray-100 text-gray-600 p-4 rounded-lg text-center">
        <p>Chưa có câu hỏi nào cho bài học này.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-red-500">Trắc nghiệm bài học</h3>
        {Object.keys(results).length > 0 && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Làm lại
          </button>
        )}
      </div>
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="mb-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <p className="font-semibold text-lg text-gray-800 mb-4">{quiz.question}</p>
          <div className="space-y-3">
            {quiz.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedAnswers[quiz.id] === option
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name={`quiz-${quiz.id}`}
                  value={option}
                  checked={selectedAnswers[quiz.id] === option}
                  onChange={() => handleAnswerChange(quiz.id, option)}
                  className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                  disabled={results[quiz.id]}
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {results[quiz.id] && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50">
              <p
                className={`font-medium ${results[quiz.id].isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {results[quiz.id].isCorrect
                  ? 'Đúng!'
                  : `Sai! ${results[quiz.id].Feedback || 'Không có phản hồi'}`}
              </p>
            </div>
          )}
          {!results[quiz.id] && (
            <button
              onClick={() => handleSubmitAnswer(quiz.id)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
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