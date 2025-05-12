/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { FaEnvelope, FaPhone, FaTimes, FaBirthdayCake, FaCamera, FaCalendar, FaPlus, FaPen, FaAngleDown } from 'react-icons/fa';
import { getUserById, uploadProfileImage, updateUser, updateUserPassword } from '../../../api/userApi';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const ProfileImage = ({ src, onClick, onImageChange }) => (
  <div className="relative inline-block">
    <img
      src={src || 'https://i.pravatar.cc/300'}
      alt="Profile"
      className="w-32 h-32 sm:w-48 sm:h-48 rounded-full mx-auto mb-4 border-4 border-pink-500 hover:scale-105 transition-transform"
      onClick={onClick}
      loading="lazy"
    />
    <label className="absolute bottom-4 right-4 bg-pink-600 text-white rounded-full p-2 cursor-pointer hover:bg-pink-700 transition-colors">
      <FaCamera />
      <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
    </label>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-pink-500 mb-4">{title}</h2>
    {children}
  </div>
);

const ContactItem = ({ icon, text }) => (
  <li className="flex items-center gap-2 text-lg">
    <span className="text-pink-500">{icon}</span>
    {text}
  </li>
);

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [infoForm, setInfoForm] = useState({ fullName: '', email: '', phone: '', birthDate: '' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const validateInfoForm = () => {
    const errors = {};
    if (!infoForm.fullName.trim()) errors.fullName = 'Họ và tên không được để trống';
    if (!infoForm.email.trim() || !/\S+@\S+\.\S+/.test(infoForm.email)) errors.email = 'Email không hợp lệ';
    if (infoForm.phone && !/^\+?\d{9,12}$/.test(infoForm.phone)) errors.phone = 'Số điện thoại không hợp lệ';
    setFormErrors(errors);
    return !Object.keys(errors).length;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.password) errors.password = 'Mật khẩu không được để trống';
    else if (passwordForm.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (passwordForm.password !== passwordForm.confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    setFormErrors(errors);
    return !Object.keys(errors).length;
  };

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Không tìm thấy token xác thực');
      
      const decodedToken = jwtDecode(token);
      
      const userData = await getUserById(decodedToken.id).then(res => res.data);
      setUser(userData);
      setInfoForm({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().slice(0, 10) : ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu người dùng.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditInfoSubmit = async (e) => {
    e.preventDefault();
    if (!validateInfoForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Không tìm thấy token');

      const decodedToken = jwtDecode(token);

      const dataToUpdate = {
        fullName: infoForm.fullName,
        email: infoForm.email,
        phone: infoForm.phone || null,
        birthDate: infoForm.birthDate ? new Date(infoForm.birthDate).toISOString() : null,
        role: user?.role || 'Student'
      };

      const updatedUser = await updateUser(decodedToken.id, dataToUpdate).then(res => res.data);
      setUser(updatedUser);
      setIsEditInfoModalOpen(false);
      toast.success('Cập nhật thành công!');
    } catch (err) {
      toast.error(err.message || 'Lỗi khi cập nhật.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const decodedToken = jwtDecode(token);
      await updateUserPassword(decodedToken.id, {
        password: passwordForm.password,
        confirmPassword: passwordForm.confirmPassword
      });

      setIsEditPasswordModalOpen(false);
      setPasswordForm({ password: '', confirmPassword: '' });
      toast.success('Đổi mật khẩu thành công!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Không tìm thấy token');

      const { data } = await uploadProfileImage(file);
      setUser(prev => ({ ...prev, profileImage: data.profileImage }));
      toast.success('Cập nhật ảnh thành công!');
    } catch (err) {
      toast.error(err.message || 'Lỗi khi cập nhật ảnh!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseInfoModal = () => {
    const hasChanges = JSON.stringify(infoForm) !== JSON.stringify({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : ''
    });

    if (hasChanges && !window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?')) return;

    setIsEditInfoModalOpen(false);
    setFormErrors({});
    setInfoForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : ''
    });
  };

  const handleClosePasswordModal = () => {
    if ((passwordForm.password || passwordForm.confirmPassword) && !window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?')) return;
    setIsEditPasswordModalOpen(false);
    setFormErrors({});
    setPasswordForm({ password: '', confirmPassword: '' });
  };

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return 'Chưa có ngày tạo';
    try {
      const [date, time] = createdAt.split(' ');
      const [day, month, year] = date.split('-');
      return new Date(`${year}-${month}-${day}T${time}`).toLocaleDateString('vi-VN');
    } catch {
      return 'Chưa có ngày tạo';
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    const setForm = formType === 'info' ? setInfoForm : setPasswordForm;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddToStory = () => {
    // Logic để thêm vào tin (story)
    toast.info('Chức năng thêm vào tin đang được phát triển!');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  if (isLoading && !user) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-center">
        <p>{error}</p>
        <button onClick={fetchUserData} className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8">
       
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <ProfileImage
              src={user.profileImage ? `${import.meta.env.VITE_API_URL}${user.profileImage}` : null}
              onClick={() => setIsModalOpen(true)}
              onImageChange={handleImageChange}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-pink-500 mb-1 mt-2 md:mt-6">
              {user.fullName || 'Không có tên'}
            </h1>
            <p className="text-gray-600 mb-2">{user.friendCount ? `${user.friendCount} người bạn` : 'Không có thông tin'}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              onClick={handleAddToStory}
              aria-label="Add to story"
            >
              <FaPlus /> Thêm vào tin
            </button>
            <button
              className="bg-gray-200 text-black px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1.5"
              onClick={() => setIsEditInfoModalOpen(true)}
              aria-label="Edit profile"
            >
              <FaPen /> Chỉnh sửa trang cá nhân
            </button>
            <div className="relative">
              <button
                className="bg-gray-200 text-black px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1.5"
                onClick={handleDropdownToggle}
                aria-label="More options"
              >
                <FaAngleDown />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsEditPasswordModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                      >
                        Đổi mật khẩu
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          toast.info('Chức năng này đang được phát triển!');
                          setIsDropdownOpen(false);
                        }}
                      >
                        Cài đặt khác
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

         
        <hr className="my-6" />
        <div className='ml-5'>
        <Section title="Thông tin liên hệ">
          <ul className="space-y-2 text-gray-700">
            <ContactItem icon={<FaEnvelope />} text={user.email || 'Chưa có email'} />
            <ContactItem icon={<FaPhone />} text={user.phone || 'Chưa có số điện thoại'} />
            <ContactItem
              icon={<FaBirthdayCake />}
              text={user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'Chưa có ngày sinh'}
            />
            <ContactItem icon={<FaCalendar />} text={formatCreatedAt(user.createdAt) || 'Chưa có ngày tạo'} />
          </ul>
        </Section>
        </div>
      </div>

      {/* Profile Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="relative max-w-md w-full">
            <img
              src={user?.profileImage ? `${import.meta.env.VITE_API_URL}${user.profileImage}` : 'https://i.pravatar.cc/600'}
              alt="Profile Enlarged"
              className="rounded-lg shadow-2xl w-full"
              loading="lazy"
            />
            <button
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {isEditInfoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 mr-4">
            <h2 className="text-2xl font-bold text-pink-500 mb-6 mr-2 text-center">Chỉnh sửa thông tin</h2>
            <form onSubmit={handleEditInfoSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={infoForm.fullName}
                    onChange={(e) => handleInputChange(e, 'info')}
                    className={`w-full border rounded-lg p-2 ${formErrors.fullName ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.fullName && <p className="text-red-500 text-sm">{formErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={infoForm.email}
                    onChange={(e) => handleInputChange(e, 'info')}
                    className={`w-full border rounded-lg p-2 ${formErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={infoForm.phone}
                    onChange={(e) => handleInputChange(e, 'info')}
                    className={`w-full border rounded-lg p-2 ${formErrors.phone ? 'border-red-500' : ''}`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Ngày sinh</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={infoForm.birthDate}
                    onChange={(e) => handleInputChange(e, 'info')}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseInfoModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {isEditPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-pink-500 mb-6 text-center">Đổi mật khẩu</h2>
            <form onSubmit={handleEditPasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="password"
                    value={passwordForm.password}
                    onChange={(e) => handleInputChange(e, 'password')}
                    placeholder="Nhập mật khẩu mới"
                    className={`w-full border rounded-lg p-2 ${formErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handleInputChange(e, 'password')}
                    placeholder="Xác nhận mật khẩu mới"
                    className={`w-full border rounded-lg p-2 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;