import { Button } from '@/components/ui/button';
import { FaUser, FaEnvelope, FaLock, FaTimes, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LogoH3 from '@/assets/LogoH3.png';

const RegisterPopup = ({
  isOpen,
  onClose,
  registerData,
  setRegisterData,
  showPassword,
  setShowPassword,
  handleRegister,
  openLogin,
  registerRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative h-[500px] md:h-[550px]"
        ref={registerRef}
      >
        <div className="flex justify-center mb-4 mt-4">
          <img src={LogoH3} alt="Logo H3" className="h-10 rounded-lg" />
        </div>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <div className="mx-4 md:mx-10">
          <h3 className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-3">
            Đăng ký Tài Khoản
          </h3>
          <div className="relative mb-3">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={registerData.fullName}
              required
              placeholder="Nhập họ và tên"
              onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
            />
          </div>
          <div className="relative mb-3">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
            />
          </div>
          <div className="relative mb-3">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold"
            onClick={handleRegister}
          >
            Đăng Ký
          </Button>
          <div className="my-3 text-center text-gray-500 text-xs md:text-sm">HOẶC</div>
          <div className="flex flex-col gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
              <FcGoogle className="w-5 h-5 mr-2" />
              Tiếp tục với Google
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
              <FaFacebook className="w-5 h-5 mr-2" />
              Tiếp tục với Facebook
            </button>
          </div>
          <div className="mt-3 text-center mb-3">
            <span className="text-gray-600 text-xs md:text-sm">Đã có tài khoản?</span>
            <button
              className="text-blue-500 hover:text-green-500 text-xs md:text-sm ml-1"
              onClick={openLogin}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPopup;