/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaAngleDown, FaEnvelope, FaPhone, FaBirthdayCake, FaCalendar, FaUserPlus, FaTimes } from 'react-icons/fa';
import { getUserByProfile } from '../../api/userApi';
import { getFollowersByUser, getFollowingByUser, createFollower, deleteFollower } from '../../api/followerApi'; // Import follower APIs
import { getUserId } from '../../api/authUtils';

const ProfileImage = ({ src, onClick }) => (
  <img
    src={src || 'https://i.pravatar.cc/150'}
    alt="Profile"
    className="w-24 h-24 rounded-full object-cover border-2 border-pink-500 cursor-pointer"
    onClick={onClick}
    onError={(e) => (e.target.src = 'https://i.pravatar.cc/150')}
  />
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
    {children}
  </div>
);

const ContactItem = ({ icon, text }) => (
  <li className="flex items-center gap-2">
    {icon}
    <span>{text}</span>
  </li>
);

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerId, setFollowerId] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const currentUserId = getUserId();
        const [userResponse, followersResponse, followingResponse] = await Promise.all([
          getUserByProfile(id).then(res => res.data),
          getFollowersByUser(id).then(res => res.data),
          getFollowingByUser(id).then(res => res.data),
        ]);

        setUser(userResponse);
        setFollowerCount(followersResponse.count || followersResponse.length || 0);
        setFollowingCount(followingResponse.count || followingResponse.length || 0);

        // Check if current user is following this user
        const followerRecord = followersResponse.find(f => f.followerId === currentUserId);
        if (followerRecord) {
          setIsFollowing(true);
          setFollowerId(followerRecord.id); // Store the follow relationship ID
        } else {
          setIsFollowing(false);
          setFollowerId(null);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể tải thông tin người dùng!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const formatCreatedAt = (date) => {
    if (!date) return 'Chưa có ngày tạo';
    return new Date(date).toLocaleDateString('vi-VN');
  };
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await deleteFollower(followerId);
        setIsFollowing(false);
        setFollowerId(null);
        setFollowerCount(prev => prev - 1);
        toast.success('Đã hủy theo dõi!');
      } else {
        const followerData = {
          followerId: getUserId(),
          userId: id
        };
        const response = await createFollower(followerData);
        setIsFollowing(true);
        setFollowerId(response.data.id);
        setFollowerCount(prev => prev + 1);
        toast.success('Đã theo dõi!');
      }
    } catch (error) {
      toast.error(error.message || 'Không thể thực hiện hành động!');
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500">Không tìm thấy người dùng!</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <ProfileImage
              src={user.profileImage ? `${import.meta.env.VITE_API_URL}${user.profileImage}` : null}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-pink-500 mb-1 mt-2 md:mt-6">
              {user.fullName || 'Không có tên'}
            </h1>
            <p className="text-gray-600 mb-2">{user.role ? `${user.role}` : 'Không có thông tin'}</p>
            <p className="text-gray-600 mb-2">{`${followerCount} người theo dõi`}</p>
            <p className="text-gray-600 mb-2">{`${followingCount} đang theo dõi`}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className={`${isFollowing ? 'bg-gray-300' : 'bg-green-600'
                } text-white px-3 py-1.5 rounded-md hover:${isFollowing ? 'bg-gray-400' : 'bg-green-700'
                } transition-colors flex items-center gap-1.5`}
              onClick={handleFollowToggle}
              aria-label={isFollowing ? 'Unfollow' : 'Follow'}
            >
              <FaUserPlus /> {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
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
                          toast.info('Chức năng chặn đang được phát triển!');
                          setIsDropdownOpen(false);
                        }}
                      >
                        Chặn
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          toast.info('Chức năng nhắn tin đang được phát triển!');
                          setIsDropdownOpen(false);
                        }}
                      >
                        Nhắn tin
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="my-6" />
        <div className="ml-5">
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
    </div>
  );
};

export default UserProfile;