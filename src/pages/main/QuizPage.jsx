import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getQuizzesByLessonId, submitAndCheckAnswer, saveUserAnswer, getUserAnswersByLessonId, deleteUserAnswersByLessonId } from '@/api/quizApi';
import { isAuthenticated } from '@/api/authUtils';

// Hàm debounce
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Hàm làm sạch HTML
const cleanHtml = (html) => {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '');
};

const useQuiz = ({ lessonId }) => {
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState(() => {
        // Khởi tạo từ localStorage
        const cachedAnswers = localStorage.getItem(`quizAnswers_${lessonId}`);
        return cachedAnswers ? JSON.parse(cachedAnswers) : {};
    });

    // Lấy danh sách câu hỏi và đáp án người dùng khi tải trang
    React.useEffect(() => {
        const fetchQuizzesAndAnswers = async () => {
            setIsLoading(true);
            try {
                // Lấy danh sách câu hỏi
                const quizzesData = await getQuizzesByLessonId(lessonId);
                if (!Array.isArray(quizzesData)) {
                    throw new Error('Dữ liệu câu hỏi không phải là mảng');
                }
                const uniqueQuizzes = quizzesData
                    .filter(quiz => quiz.id && typeof quiz.id === 'string')
                    .reduce((unique, quiz) => {
                        if (!unique.some(q => q.question === quiz.question)) {
                            unique.push(quiz);
                        } else {
                            console.warn('Câu hỏi trùng lặp:', quiz);
                            toast.warn(`Câu hỏi "${quiz.question}" trùng lặp, chỉ giữ câu hỏi đầu tiên.`);
                        }
                        return unique;
                    }, []);

                setQuizzes(uniqueQuizzes);

                // Lấy đáp án từ server
                const answersData = await getUserAnswersByLessonId(lessonId);
                const answersMap = answersData.reduce((map, ans) => {
                    if (ans.quizId && ans.userAnswer) {
                        map[ans.quizId] = {
                            answer: ans.userAnswer,
                            isCorrect: ans.isCorrect ?? false,
                            feedback: ans.feedback ?? (ans.isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
                        };
                    }
                    return map;
                }, {});
                setUserAnswers(answersMap);
                localStorage.setItem(`quizAnswers_${lessonId}`, JSON.stringify(answersMap)); // Lưu vào localStorage
                setError(null);
            } catch (err) {
                const errorMessage = `Lỗi khi tải dữ liệu: ${err.message}`;
                setError(errorMessage);
                if (!err.message.includes('Không tìm thấy bài học')) {
                    toast.error(errorMessage);
                }
                // Sử dụng dữ liệu từ localStorage nếu server thất bại
                const cachedAnswers = localStorage.getItem(`quizAnswers_${lessonId}`);
                if (cachedAnswers) {
                    setUserAnswers(JSON.parse(cachedAnswers));
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuizzesAndAnswers();
    }, [lessonId]);

    // Đồng bộ selectedAnswer và result với userAnswers
    React.useEffect(() => {
        const currentQuiz = quizzes[currentQuizIndex];
        if (currentQuiz && userAnswers[currentQuiz.id]) {
            const userAnswer = userAnswers[currentQuiz.id];
            setSelectedAnswer(userAnswer.answer);
            setResult({
                isCorrect: userAnswer.isCorrect,
                message: userAnswer.feedback || (userAnswer.isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
            });
        } else {
            setSelectedAnswer('');
            setResult(null);
        }
    }, [currentQuizIndex, userAnswers, quizzes]);

    const isCompleted = quizzes.length > 0 && Object.keys(userAnswers).length === quizzes.length;

    const handleAnswerSelect = debounce(async (answer) => {
        if (!answer || typeof answer !== 'string') {
            toast.error('Vui lòng chọn một đáp án hợp lệ.');
            return;
        }

        setSelectedAnswer(answer);
        setLoading(true);
        try {
            const currentQuiz = quizzes[currentQuizIndex];
            if (!currentQuiz || !currentQuiz.id || typeof currentQuiz.id !== 'string') {
                throw new Error('ID câu hỏi không hợp lệ hoặc không tồn tại');
            }
            const answerData = { quizId: currentQuiz.id, userAnswer: answer };

            if (userAnswers[currentQuiz.id]?.answer === answer) {
                toast.info('Đáp án đã được ghi nhận trước đó.');
                const result = {
                    isCorrect: userAnswers[currentQuiz.id].isCorrect,
                    message: userAnswers[currentQuiz.id].feedback || (userAnswers[currentQuiz.id].isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
                };
                setResult(result);
                return;
            }

            const result = await submitAndCheckAnswer(answerData);
            setResult(result);

            await saveUserAnswer({
                quizId: currentQuiz.id,
                userAnswer: answer,
                lessonId,
            });

            const updatedAnswers = await getUserAnswersByLessonId(lessonId);
            const answersMap = updatedAnswers.reduce((map, ans) => {
                if (ans.quizId && ans.userAnswer) {
                    map[ans.quizId] = {
                        answer: ans.userAnswer,
                        isCorrect: ans.isCorrect ?? false,
                        feedback: ans.feedback ?? (ans.isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
                    };
                }
                return map;
            }, {});
            setUserAnswers(answersMap);
            localStorage.setItem(`quizAnswers_${lessonId}`, JSON.stringify(answersMap));
            toast.success('Đáp án đã được ghi nhận!');
        } catch (err) {
            const friendlyError =
                err.message === 'Người dùng chưa xác thực'
                    ? 'Vui lòng đăng nhập để trả lời câu hỏi.'
                    : err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            toast.error(friendlyError);
            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    }, 300);

    const handleNextQuiz = () => {
        setSelectedAnswer('');
        setResult(null);
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
        }
    };

    const handleRestart = async () => {
        setCurrentQuizIndex(0);
        setSelectedAnswer('');
        setResult(null);
        setUserAnswers({});
        localStorage.removeItem(`quizAnswers_${lessonId}`);
        try {
            await deleteUserAnswersByLessonId(lessonId);
            toast.success('Đã đặt lại bài trắc nghiệm!');
        } catch (err) {
            console.error('Lỗi khi xóa đáp án:', err);
            toast.error('Không thể đặt lại đáp án trên server.');
        }
    };

    return {
        quizzes,
        currentQuizIndex,
        selectedAnswer,
        result,
        isLoading,
        error,
        userAnswers,
        loading,
        handleAnswerSelect,
        handleNextQuiz,
        handleRestart,
        isCompleted,
    };
};

const ProgressBar = ({ percent }) => (
    <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
        <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-in-out"
            style={{ width: `${percent}%` }}
        />
    </div>
);

const QuizQuestion = React.memo(({ quiz, index, total, selectedAnswer, onSelect, isAnswered, userAnswer }) => {
    if (!quiz) return <div className="text-gray-600 dark:text-gray-300">Không có câu hỏi để hiển thị.</div>;

    return (
        <div className="animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {`Câu ${index + 1}/${total}: ${cleanHtml(quiz.question)}`}
            </h3>
            <div>
                {quiz.options.map((option, i) => {
                    let color = 'text-gray-700 dark:text-gray-300';
                    if (isAnswered && selectedAnswer === option) {
                        color = userAnswer?.isCorrect ? 'text-green-500' : 'text-red-500';
                    }
                    return (
                        <div key={i} className="my-3 group">
                            <label
                                className={`flex items-center cursor-pointer transition-transform duration-200 hover:translate-x-1 hover:bg-blue-50 dark:hover:bg-gray-700 p-2 rounded-lg ${color}`}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={option}
                                    checked={selectedAnswer === option}
                                    onChange={() => onSelect(option)}
                                    disabled={isAnswered}
                                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <span className="text-base">{cleanHtml(option)}</span>
                            </label>
                        </div>
                    );
                })}
            </div>
            {isAnswered && userAnswer && (
                <div className={`mt-4 font-medium ${userAnswer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {userAnswer.feedback || (userAnswer.isCorrect ? 'Đúng rồi!' : 'Sai rồi!')}
                </div>
            )}
        </div>
    );
});

const QuizPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const {
        quizzes,
        currentQuizIndex,
        selectedAnswer,
        result,
        isLoading,
        error,
        userAnswers,
        loading,
        handleAnswerSelect,
        handleNextQuiz,
        handleRestart,
        isCompleted,
    } = useQuiz({ lessonId });

    React.useEffect(() => {
        if (!isAuthenticated()) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            navigate('/login');
        } else {
            // Đảm bảo tiếp tục tải dữ liệu nếu đã xác thực
            const fetchInitialData = async () => {
                try {
                    await getUserAnswersByLessonId(lessonId); // Kiểm tra dữ liệu
                } catch (err) {
                    console.error('Lỗi khi kiểm tra dữ liệu ban đầu:', err);
                }
            };
            fetchInitialData();
        }
    }, [navigate, lessonId]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    if (isLoading) {
        return (
            <div className="p-6 max-w-xl mx-auto">
                <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) return null;
    if (!quizzes.length) return null;

    const currentQuiz = quizzes[currentQuizIndex];
    const progress = (Object.keys(userAnswers).length / quizzes.length) * 100;

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white-100'} transition-colors duration-300 font-sans`}>
            <div className="p-6 max-w-xl mx-auto">
                <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Câu hỏi trắc nghiệm</h2>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                    <ProgressBar percent={progress} />
                    <QuizQuestion
                        quiz={currentQuiz}
                        index={currentQuizIndex}
                        total={quizzes.length}
                        selectedAnswer={selectedAnswer}
                        onSelect={handleAnswerSelect}
                        isAnswered={!!(currentQuiz && userAnswers[currentQuiz.id])}
                        userAnswer={currentQuiz && userAnswers[currentQuiz.id]}
                    />
                    {loading && <div className="text-gray-600 dark:text-gray-300 mt-4 animate-pulse">Đang xử lý đáp án...</div>}
                    {result && (
                        <div className={`mt-4 font-medium ${result.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {result.message}
                        </div>
                    )}
                    {currentQuiz && userAnswers[currentQuiz.id] && currentQuizIndex < quizzes.length - 1 && (
                        <button
                            onClick={handleNextQuiz}
                            className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                        >
                            Câu tiếp theo
                        </button>
                    )}
                    {(Object.keys(userAnswers).length > 0 || isCompleted) && (
                        <div className="mt-6">
                            {isCompleted && (
                                <div className="text-green-500 font-semibold mb-4 animate-pulse">
                                    Bạn đã hoàn thành bài trắc nghiệm! 🎉
                                </div>
                            )}
                            <button
                                onClick={handleRestart}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                            >
                                Làm lại
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;