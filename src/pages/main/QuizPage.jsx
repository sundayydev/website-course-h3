/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizzesByLessonId, checkAnswer, submitAnswer } from '../api/quizApi';

const QuizPage = () => {
  const { lessonId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]); // Lưu trạng thái trả lời cho từng câu hỏi

  // Lấy danh sách câu hỏi khi component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzesByLessonId(lessonId);
        setQuizzes(data);
        setAnswers(new Array(data.length).fill(null)); // Khởi tạo mảng trạng thái trả lời
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [lessonId]);

  // Xử lý khi người dùng chọn đáp án
  const handleAnswerSelect = async (answer) => {
    setSelectedAnswer(answer);
    setError(null);

    try {
      const currentQuiz = quizzes[currentQuizIndex];
      const answerData = { quizId: currentQuiz._id, userAnswer: answer };

      // Kiểm tra đáp án ngay lập tức
      const checkResult = await checkAnswer(answerData);
      setResult(checkResult);

      // Lưu trạng thái trả lời vào mảng
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuizIndex] = { answer, result: checkResult };
      setAnswers(updatedAnswers);

      // Lưu vào database
      await submitAnswer(answerData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Chuyển câu hỏi tiếp theo
  const handleNextQuiz = () => {
    setSelectedAnswer('');
    setResult(null);
    setError(null);
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  // Làm lại toàn bộ quiz
  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setResult(null);
    setError(null);
    setAnswers(new Array(quizzes.length).fill(null)); // Reset trạng thái trả lời
  };

  // Hiển thị khi đang tải
  if (loading) {
    return <div>Đang tải câu hỏi...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // Hiển thị thông báo nếu không có câu hỏi
  if (quizzes.length === 0) {
    return <div>Không có câu hỏi nào cho bài học này.</div>;
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const isCompleted = answers.every((answer) => answer !== null); // Kiểm tra đã hoàn thành tất cả

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Câu hỏi trắc nghiệm</h2>
      <h3>
        Câu {currentQuizIndex + 1}/{quizzes.length}: {currentQuiz.question}
      </h3>

      {/* Hiển thị các lựa chọn */}
      <div>
        {currentQuiz.options.map((option, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <label>
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                disabled={answers[currentQuizIndex] !== null} // Vô hiệu hóa nếu đã trả lời
              />
              {option}
            </label>
          </div>
        ))}
      </div>

      {/* Hiển thị kết quả ngay sau khi chọn */}
      {result && (
        <div style={{ margin: '10px 0', color: result.isCorrect ? 'green' : 'red' }}>
          {result.message}
        </div>
      )}

      {/* Nút chuyển câu hỏi tiếp theo */}
      {answers[currentQuizIndex] !== null && currentQuizIndex < quizzes.length - 1 && (
        <button
          onClick={handleNextQuiz}
          style={{ padding: '10px 20px', margin: '10px 0' }}
        >
          Câu tiếp theo
        </button>
      )}

      {/* Nút làm lại khi hoàn thành */}
      {isCompleted && (
        <div>
          <div style={{ margin: '10px 0', fontWeight: 'bold' }}>
            Bạn đã hoàn thành bài trắc nghiệm!
          </div>
          <button
            onClick={handleRestart}
            style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: 'blue', color: 'white' }}
          >
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;