import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTimes, FaBirthdayCake, FaCamera } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo, uploadProfileImage } from '@/api/userApi';
import { toast } from 'react-toastify';

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
    password: '',
    profileImage: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        console.log("User data received:", response);
        setUser(response.data);
        setEditForm({
          fullname: response.data.fullname || '',
          email: response.data.email || '',
          birthDate: response.data.birthDate || '',
          password: '',
          profileImage: response.data.profileImage || null
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = user.id;
      const formData = new FormData();
      
      // Only include password if it was changed
      const dataToUpdate = {...editForm};
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      // Handle file upload separately if exists
      if (editForm.profileImage) {
        formData.append('profileImage', editForm.profileImage);
        await uploadProfileImage(formData);
      }

      const response = await updateUserInfo(userId, dataToUpdate);
      setUser(response);
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      console.error("Error updating user:", err);
      if (err.response?.status === 405) {
        toast.error("Method not allowed. Please check your permissions.", {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        toast.error("Failed to update profile. Please try again later.", {
          position: "top-right",
          autoClose: 3000
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadProfileImage(file);
      setUser(prev => ({
        ...prev,
        profileImage: response.profileImage
      }));
      toast.success('Profile image updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error(err.message || "Failed to upload image. Please try again.", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
            Try Again
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
                src={user?.profileImage ? `http://localhost:5221${user.profileImage}` : "https://i.pravatar.cc/300"}
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
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-pink-500 mb-1 sm:mb-2">{user?.fullname || "Loading..."}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{user?.role || "User"}</p>
            <div className="flex justify-center mt-3 sm:mt-4">
              <button 
                className="bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-300 flex items-center gap-2"
                onClick={() => setIsEditModalOpen(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="w-full md:w-2/3 md:pl-8">
            <Section title="About Me">
              <p className="text-gray-700 text-sm sm:text-base">
                {user?.bio || "No bio available"}
              </p>
            </Section>

            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {(user?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']).map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </Section>

            <Section title="Contact Information">
              <ul className="space-y-2 text-gray-700">
                <ContactItem icon={<FaEnvelope />} text={user?.email || "No email available"} />
                <ContactItem icon={<FaPhone />} text={user?.phone || "No phone available"} />
                <ContactItem icon={<FaMapMarkerAlt />} text={user?.address || "No address available"} />
                <ContactItem 
                  icon={<FaBirthdayCake />} 
                  text={user?.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : "No birthday available"}
                />
              </ul>
            </Section>
          </div>
        </div>
      </div>

      {/* Modal Hiển thị ảnh khi click vào Avatar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <img
              src={user?.profileImage ? `http://localhost:5221${user.profileImage}` : "https://i.pravatar.cc/600"}
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
            <h2 className="text-2xl font-bold text-pink-500 mb-4">Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
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
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleInputChange}
                    placeholder="Leave blank to keep current password"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={editForm.birthDate}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Component hiển thị từng phần nội dung (About, Skills, Contact)
const Section = ({ title, children }) => (
  <div className="mb-4 sm:mb-6">
    <h2 className="text-lg sm:text-xl font-semibold text-pink-500 mb-2 sm:mb-4">{title}</h2>
    {children}
  </div>
);

// Component hiển thị từng kỹ năng với hiệu ứng hover
const SkillTag = ({ skill }) => (
  <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-100 text-pink-500 transition-colors duration-300 cursor-pointer hover:bg-pink-700 hover:text-white">
    {skill}
  </span>
);

// Component hiển thị thông tin liên hệ với icon
const ContactItem = ({ icon, text }) => (
  <li className="flex items-center gap-2 text-sm sm:text-lg">
    <span className="text-pink-500">{icon}</span>
    {text}
  </li>
);

export default ProfilePage;
