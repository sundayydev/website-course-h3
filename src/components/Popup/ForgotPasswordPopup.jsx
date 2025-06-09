import { Button } from '@/components/ui/button';
import { FaEnvelope, FaTimes } from 'react-icons/fa';

const ForgotPasswordPopup = ({
  isOpen,
  onClose,
  forgotEmail,
  setForgotEmail,
  handleForgotPassword,
  forgotPasswordRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={forgotPasswordRef}
        className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative"
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-center text-lg font-bold text-gray-700 mb-3">Quên Mật Khẩu</h3>
        <div className="relative mb-3">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Nhập email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg"
          onClick={handleForgotPassword}
        >
          Gửi Yêu Cầu
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;