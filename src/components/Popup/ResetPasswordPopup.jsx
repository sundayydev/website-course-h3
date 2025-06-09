import { Button } from '@/components/ui/button';
import { FaLock, FaTimes } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LogoH3 from '@/assets/LogoH3.png';

const ResetPasswordPopup = ({
  isOpen,
  onClose,
  resetPasswordData,
  setResetPasswordData,
  showNewPassword,
  setShowNewPassword,
  handleResetPassword,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative">
        <div className="flex justify-center mb-4 mt-4">
          <img src={LogoH3} alt="Logo H3" className="h-10 rounded-lg" />
        </div>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-3">Xác thực mã OTP</h3>
        <p className="text-center text-sm text-gray-600 mb-4">
          Mã xác thực đã được gửi qua email:{' '}
          {resetPasswordData.email ? (
            <strong className="text-gray-800 font-semibold">
              {`${resetPasswordData.email.substring(0, 3)}****${resetPasswordData.email.substring(
                resetPasswordData.email.indexOf('@') - 1
              )}`}
            </strong>
          ) : (
            <strong className="text-red-500">Email không xác định</strong>
          )}
        </p>

        <div className="relative mb-3 flex flex-col items-center">
          <label className="text-lg md:text-xl font-bold text-red-600 mb-3 text-center w-full">
            Nhập mã OTP
          </label>
          <div className="flex justify-center gap-2">
            {Array(6)
              .fill()
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={resetPasswordData.resetCode[index] || ''}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    if (/^[0-9]$/.test(newCode) || newCode === '') {
                      const newResetCode = resetPasswordData.resetCode.split('');
                      newResetCode[index] = newCode;
                      setResetPasswordData({
                        ...resetPasswordData,
                        resetCode: newResetCode.join(''),
                      });
                      if (newCode && index < 5) {
                        document.querySelectorAll('.otp-input')[index + 1].focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !resetPasswordData.resetCode[index] && index > 0) {
                      document.querySelectorAll('.otp-input')[index - 1].focus();
                    }
                  }}
                  className="otp-input w-10 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-semibold"
                />
              ))}
          </div>
        </div>

        <div className="relative mb-5 ml-16 mt-5">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu mới"
            value={resetPasswordData.newPassword}
            onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
            className="w-[400px] px-9 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 mr-16"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm md:text-base"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đặt lại mật khẩu'}
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordPopup;