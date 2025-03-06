import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

const AccountSettings = () => {
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Duy Hoàng');
  const [tempName, setTempName] = useState(name);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 mt-10">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6">
        <h1 className="text-xl font-bold text-orange-600 mb-6">H3</h1>
        <button
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
            selectedTab === 'personal' ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedTab('personal')}
        >
          <FaUser className="text-gray-700" />
          Thông tin cá nhân
        </button>
        <button
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mt-2 ${
            selectedTab === 'security' ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedTab('security')}
        >
          <FaLock className="text-gray-700" />
          Mật khẩu và bảo mật
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-8 bg-gradient-to-br from-white to-gray-50">
        {selectedTab === 'personal' ? (
          <div>
            <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
            <p className="text-gray-600">Quản lý thông tin cá nhân của bạn.</p>

            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col space-y-4">
                <div
                  className="flex justify-between border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="text-gray-600">Họ và tên</span>
                  <span className="font-semibold">{name}</span>
                </div>
                <div
                  className="flex justify-between border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="text-gray-600">Tên người dùng</span>
                  <span className="font-semibold">hoangduy50</span>
                </div>
                <div
                  className="flex justify-between border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="text-gray-600">Giới thiệu</span>
                  <span className="text-gray-500">Chưa cập nhật</span>
                </div>
                <div
                  className="flex justify-between border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="text-gray-600">Ảnh đại diện</span>
                  <span className="w-12 h-12 bg-gray-300 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold">Mật khẩu và bảo mật</h2>
            <p className="text-gray-600">Quản lý mật khẩu và bảo mật tài khoản.</p>

            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Mật khẩu</span>
                  <span className="font-semibold text-blue-600 cursor-pointer">Đổi mật khẩu</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Mật khẩu</span>
                  <span
                    className="font-semibold text-blue-600 cursor-pointer"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    Quên mật khẩu?
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup chỉnh sửa */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-red-500">Chỉnh sửa họ và tên</h2>
            <p className="mb-4 font-sans">
              Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.
            </p>
            <input
              type="text"
              className="w-full border rounded-xl p-2"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded-xl"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
              <button
                className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Quên Mật Khẩu */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-center flex items-center justify-center">
              <FaLock className="mr-2 text-yellow-400" /> Quên Mật Khẩu
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
            </p>

            <input
              type="email"
              placeholder="Nhập email..."
              className="w-full border rounded-md p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-3 hover:bg-blue-600 transition"
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setIsResetPasswordOpen(true);
              }}
            >
              Gửi yêu cầu
            </button>

            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="mt-2 w-full bg-slate-100 py-2 rounded-lg text-gray-600 hover:text-gray-800 text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Popup Đặt Lại Mật Khẩu */}
      {isResetPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-center">🔑 Đặt Lại Mật Khẩu</h2>
            <p className="text-sm text-gray-600 text-center">
              Nhập mật khẩu mới cho tài khoản của bạn.
            </p>

            <input
              type="password"
              placeholder="Nhập mật khẩu mới..."
              className="w-full border rounded-md p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu..."
              className="w-full border rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="w-full bg-green-500 text-white py-2 rounded-md mt-3 hover:bg-green-600 transition"
              onClick={() => {
                if (newPassword === confirmPassword && newPassword !== '') {
                  alert('✅ Mật khẩu đã được đặt lại thành công!');
                  setIsResetPasswordOpen(false);
                } else {
                  alert('⚠️ Mật khẩu không khớp. Vui lòng thử lại!');
                }
              }}
            >
              Đặt lại mật khẩu
            </button>

            <button
              onClick={() => setIsResetPasswordOpen(false)}
              className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
