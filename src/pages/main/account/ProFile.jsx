import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTimes, FaBirthdayCake, FaCamera } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo, uploadProfileImage } from '@/api/userApi';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    birthDate: '',
    password: '', // Giữ rỗng, không lấy từ dữ liệu hiện tại
    profileImage: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        console.log("User data received:", response.data);
        const userData = response.data;
        setUser(userData);
        setEditForm({
          fullname: userData.fullname || '',
          email: userData.email || '',
          birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().slice(0, 10) : '',
          password: '', // Không gán giá trị từ backend
          profileImage: userData.profileImage || null
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const dataToUpdate = {
        fullname: editForm.fullname,
        email: editForm.email,
        birthDate: editForm.birthDate ? new Date(editForm.birthDate).toISOString() : null,
      };

      // Chỉ thêm password nếu người dùng nhập giá trị mới
      if (editForm.password.trim()) {
        dataToUpdate.password = editForm.password;
      }

      console.log("Data to update:", dataToUpdate);

      const updatedUser = await updateUserInfo(userId, dataToUpdate);
      setUser(updatedUser);

      if (editForm.profileImage && editForm.profileImage instanceof File) {
        const imageResponse = await uploadProfileImage(editForm.profileImage);
        setUser(prev => ({ ...prev, profileImage: imageResponse.profileImage }));
      }

      setIsEditModalOpen(false);
      toast.success('Cập nhật hồ sơ thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      toast.error(err.response?.data?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại sau.', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, profileImage: file }));
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:p-4 bg-white mt-20 md:mt-0">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Avatar + Tên */}
          <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
            <div className="relative inline-block">
              <img
                src={user?.profileImage ? `${import.meta.env.VITE_API_URL}${user.profileImage}` : "https://i.pravatar.cc/300"}
                alt="Profile"
                className="rounded-full w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-4 border-4 border-pink-500 transition-transform duration-300 hover:scale-105"
                onClick={() => setIsModalOpen(true)}
              />
              <label className="absolute bottom-4 right-4 bg-pink-600 text-white rounded-full p-2 cursor-pointer hover:bg-pink-700 transition-colors">
                <FaCamera />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-pink-500 mb-1 sm:mb-2">
              {user?.fullname || "Đang tải..."}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">{user?.role || "Người dùng"}</p>
            <div className="flex justify-center mt-3 sm:mt-4">
              <button 
                className="bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-300 flex items-center gap-2"
                onClick={() => setIsEditModalOpen(true)}
              >
                <FaEdit /> Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="w-full md:w-2/3 md:pl-8">
            <Section title="Giới thiệu">
              <p className="text-gray-700 text-sm sm:text-base">
                {user?.bio || "Chưa có thông tin giới thiệu"}
              </p>
            </Section>

            <Section title="Kỹ năng">
              <div className="flex flex-wrap gap-2">
                {(user?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']).map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </Section>

            <Section title="Thông tin liên hệ">
              <ul className="space-y-2 text-gray-700">
                <ContactItem icon={<FaEnvelope />} text={user?.email || "Chưa có email"} />
                <ContactItem icon={<FaPhone />} text={user?.phone || "Chưa có số điện thoại"} />
                <ContactItem icon={<FaMapMarkerAlt />} text={user?.address || "Chưa có địa chỉ"} />
                <ContactItem 
                  icon={<FaBirthdayCake />} 
                  text={user?.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : "Chưa có ngày sinh"}
                />
              </ul>
            </Section>
          </div>
        </div>
      </div>

      {/* Modal Hiển thị ảnh */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <img
              src={user?.profileImage ? `${import.meta.env.VITE_API_URL}${user.profileImage}` : "https://i.pravatar.cc/600"}
              alt="Profile Enlarged"
              className="rounded-lg shadow-2xl w-full"
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

      {/* Modal Chỉnh sửa thông tin */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-pink-500 mb-4">Chỉnh sửa hồ sơ</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Ngày sinh</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={editForm.birthDate}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Ảnh đại diện</label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleImageChange}
                    className="w-full border rounded-lg p-2"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
    </div>
  );
};

// Các component phụ
const Section = ({ title, children }) => (
  <div className="mb-4 sm:mb-6">
    <h2 className="text-lg sm:text-xl font-semibold text-pink-500 mb-2 sm:mb-4">{title}</h2>
    {children}
  </div>
);

const SkillTag = ({ skill }) => (
  <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-100 text-pink-500 transition-colors duration-300 cursor-pointer hover:bg-pink-700 hover:text-white">
    {skill}
  </span>
);

const ContactItem = ({ icon, text }) => (
  <li className="flex items-center gap-2 text-sm sm:text-lg">
    <span className="text-pink-500">{icon}</span>
    {text}
  </li>
);

export default ProfilePage;