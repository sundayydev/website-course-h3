import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createQuiz } from '@/api/quizApi';

export default function AddQuiz() {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''], // Khởi tạo 4 lựa chọn mặc định
    correctAnswer: '',
    explanation: '',
    lessonId: lessonId || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!formData.lessonId.trim()) return 'ID bài học không được để trống';
    if (!formData.question.trim()) return 'Câu hỏi không được để trống';
    const validOptions = formData.options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) return 'Phải có ít nhất 2 lựa chọn không rỗng';
    if (!formData.correctAnswer.trim()) return 'Đáp án đúng không được để trống';
    if (!validOptions.includes(formData.correctAnswer.trim())) return 'Đáp án đúng phải nằm trong danh sách lựa chọn';
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({ ...prev, options: [...prev.options, ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const validOptions = formData.options.filter((opt) => opt.trim() !== '');
    const quizData = {
      Question: formData.question.trim(),
      Options: validOptions,
      CorrectAnswer: formData.correctAnswer.trim(),
      Explanation: formData.explanation?.trim() || null,
      LessonId: formData.lessonId.trim(),
      // Không gửi CreatedAt, để server tự xử lý
    };

    console.log('Dữ liệu gửi đi:', quizData);

    try {
      await createQuiz(quizData);
      navigate(`/instructor/course/${courseId}/lesson/${lessonId}`);
    } catch (err) {
      console.error('Lỗi từ API:', err);
      setError(err.message || 'Lỗi khi tạo câu hỏi. Vui lòng kiểm tra dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft size={16} /> Quay lại
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit} disabled={loading}>
          <Save size={16} className="mr-2" /> {loading ? 'Đang lưu...' : 'Lưu Câu Hỏi'}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Thêm Câu Hỏi Mới</h1>

        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen size={20} className="mr-2" /> Thông Tin Câu Hỏi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Bài học ID</label>
                <Input
                  name="lessonId"
                  value={formData.lessonId}
                  onChange={handleInputChange}
                  placeholder="Nhập ID bài học"
                  className="mt-1"
                  disabled={!!lessonId}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Câu hỏi</label>
                <Textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Nhập câu hỏi..."
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Lựa chọn</label>
                <div className="space-y-2 mt-1">
                  {formData.options.map((option, index) => (
                    <Input
                      key={index}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Lựa chọn ${index + 1}`}
                      className="w-full"
                      required={index < 2}
                    />
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddOption} className="mt-2">
                    Thêm Lựa Chọn
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Đáp án đúng</label>
                <Input
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleInputChange}
                  placeholder="Nhập đáp án đúng"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Lời giải</label>
                <Textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  placeholder="Nhập lời giải (không bắt buộc)"
                  className="mt-1"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}