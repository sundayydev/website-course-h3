/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaAngleDown, FaEnvelope, FaPhone, FaBirthdayCake, FaCalendar, FaTimes, FaLocationArrow } from 'react-icons/fa';
import { getUserByProfile } from '../../api/userApi';
import { getFollowersByUser, getFollowingByUser, createFollower, deleteFollower } from '../../api/followerApi';
import { getChatsByUser, createChat } from '../../api/chatApi';
import { getUserId } from '../../api/authUtils';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';

const ProfileImage = ({ src, onClick }) => (
  <div className="relative inline-block">
    <img
      src={src || defaultAvatar}
      alt="Profile"
      className="w-24 h-24 sm:w-40 sm:h-40 rounded-full mx-auto mb-4 border-4 border-green-500 transition-transform object-cover"
      onClick={onClick}
      onError={(e) => (e.target.src = defaultAvatar)}
    />
  </div>
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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const currentUserId = getUserId();
        const [userData, followersData, followingData] = await Promise.all([
          getUserByProfile(id).then(res => res.data),
          getFollowersByUser(id).then(res => res.data),
          getFollowingByUser(id).then(res => res.data),
        ]);
        setUser(userData);
        const followersArray = Array.isArray(followersData) ? followersData : followersData?.data || [];
        const followingArray = Array.isArray(followingData) ? followingData : followingData?.data || [];
        setFollowers(followersArray);
        setFollowing(followingArray);

        setFollowerCount(followersArray.length || 0);
        setFollowingCount(followingArray.length || 0);

        const followerRecord = followersArray.find(f => f.followerId === currentUserId);
        if (followerRecord) {
          setIsFollowing(true);
          setFollowerId(followerRecord.id);
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
      toast.error(error.response?.data?.message || 'Không thể thực hiện hành động!');
    }
  };

  const handleMessageClick = async () => {
    try {
      const currentUserId = getUserId();
      if (!currentUserId) {
        toast.error('Vui lòng đăng nhập để nhắn tin!');
        navigate('/login');
        return;
      }
      if (currentUserId === id) {
        toast.error('Bạn không thể nhắn tin cho chính mình!');
        return;
      }
      const chats = await getChatsByUser(currentUserId);
      const existingChat = chats.find(
        chat =>
          (chat.user1Id === currentUserId && chat.user2Id === id) ||
          (chat.user1Id === id && chat.user2Id === currentUserId)
      );

      let chatId;
      if (existingChat) {
        chatId = existingChat.id;
      } else {
        const newChat = await createChat({
          user1Id: currentUserId,
          user2Id: id
        });
        chatId = newChat.id;
      }

      navigate(`/chat/${chatId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể mở cuộc trò chuyện!');
      console.error('Message click error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-500">Không tìm thấy người dùng!</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            <ProfileImage
              src={user.profileImage ? `${user.profileImage}` : null}
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          <div className="flex-1 ml-10">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold text-emerald-500">
                {user.fullName || 'Không có tên'}
              </h1>
            </div>
            <span>
              <p className="text-gray-600 font-semibold">
                {user.role ? (
                  user.role === 'Admin' ? 'Quản trị viên' :
                    user.role === 'Instructor' ? 'Giảng viên' :
                      user.role === 'Student' ? 'Học viên' :
                        'Không có thông tin'
                ) : 'Không có thông tin'}
              </p>
            </span>
            <div className="flex items-center gap-4 mb-4 mt-2">
              <button
                onClick={() => setIsFollowersModalOpen(true)}
                className="text-gray-600 hover:text-emerald-500"
              >
                {`0 bài viết`}
              </button>
              <button
                onClick={() => setIsFollowersModalOpen(true)}
                className="text-gray-600 hover:text-emerald-500"
              >
                {`0 khóa học`}
              </button>
              <button
                onClick={() => setIsFollowersModalOpen(true)}
                className="text-gray-600 hover:text-emerald-500"
              >
                <span className="font-bold text-emerald-500">{followerCount}</span> người theo dõi
              </button>
              <button
                onClick={() => setIsFollowingModalOpen(true)}
                className="text-gray-600 hover:text-emerald-500"
              >
                <span className="font-bold text-emerald-500">{followingCount}</span> đang theo dõi
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                aria-label="Nhắn tin"
                onClick={handleMessageClick}
              >
                <FaLocationArrow /> Nhắn tin
              </button>
              {getUserId() !== id && (
                <button
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${isFollowing
                    ? 'bg-gray-200 text-black hover:bg-gray-300'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  onClick={handleFollowToggle}
                  aria-label={isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                >
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
              )}
              <div className="relative">
                <button
                  className="bg-gray-200 text-black px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1.5"
                  onClick={handleDropdownToggle}
                  aria-label="Tùy chọn khác"
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
                          onClick={handleMessageClick}
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
        </div>
        <hr className="my-6" />
        <div className="ml-5">
          <Section title="Thông tin liên hệ">
            <ul className="space-y-2 text-gray-700">
              <ContactItem icon={<FaEnvelope />} text={user.email || 'Chưa có email'} />
              <ContactItem icon={<FaPhone />} text={user.phone || 'Chưa có số điện thoại'} />
              <ContactItem
                icon={<FaBirthdayCake />}
                text={user.birthDate ? formatDate(user.birthDate, 'dd/MM/yyyy') : 'Chưa có ngày sinh'}
              />
              <ContactItem icon={<FaCalendar />} text={formatDate(user.createdAt, 'dd/MM/yyyy') || 'Chưa có ngày tạo'} />
            </ul>
          </Section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="relative max-w-md w-full">
            <img
              src={user?.profileImage ? `${user.profileImage}` : defaultAvatar}
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
      {isFollowersModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-emerald-500">Người theo dõi</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsFollowersModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {followers.length > 0 ? (
                followers.map((follower, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${follower.followerId}`);
                      setIsFollowersModalOpen(false);
                    }}
                  >
                    <img
                      src={follower.followerProfileImage ? `${follower.followerProfileImage}` : defaultAvatar}
                      alt={follower.followerFullName || 'Không có tên'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{follower.followerFullName || 'Không có tên'}</p>
                      <p className="text-sm text-gray-500">{follower.followerEmail || 'Chưa có email'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Chưa có người theo dõi</p>
              )}
            </div>
          </div>
        </div>
      )}
      {isFollowingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-emerald-500">Đang theo dõi</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsFollowingModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {following.length > 0 ? (
                following.map((followedUser, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${followedUser.followingId}`);
                      setIsFollowingModalOpen(false);
                    }}
                  >
                    <img
                      src={followedUser.followingProfileImage ? `${followedUser.followingProfileImage}` : defaultAvatar}
                      alt={followedUser.followingFullName || 'Không có tên'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{followedUser.followingFullName || 'Không có tên'}</p>
                      <p className="text-sm text-gray-500">{followedUser.followingEmail || 'Chưa có email'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Chưa theo dõi ai</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;