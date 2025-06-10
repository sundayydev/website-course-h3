import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getMessagesByChat, createMessage } from '@/api/messageApi';
import { getChatsByUser } from '@/api/chatApi';
import { getUserById } from '@/api/userApi';
import { getUserId } from '@/api/authUtils';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';
import defaultAvatar from '../../../assets/imgs/default-avatar.jpg';
import '../../../components/ui/ChatPage.css';

const ChatPage = () => {
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);
  const chatRefs = useRef({});
  const navigate = useNavigate();
  const currentUserId = getUserId();

  useEffect(() => {
    if (!currentUserId) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng chat!');
      return;
    }

    const connectSignalR = async () => {
      const conn = new HubConnectionBuilder()
        .withUrl('http://localhost:5221/chatHub', {
          withCredentials: true
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      conn.on('ReceiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      conn.onclose((error) => {
        console.error('SignalR connection closed:', error);
      });

      try {
        await conn.start();
        await conn.invoke('JoinChat', chatId);
        setConnection(conn);
      } catch (error) {
        toast.error('Không thể kết nối đến server chat!');
        console.error('SignalR connection error:', error);
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const chatsData = await getChatsByUser(currentUserId);
        const enrichedChats = await Promise.all(
          chatsData.map(async (chat) => {
            const otherUserId = chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id;
            const userResponse = await getUserById(otherUserId);
            const userData = userResponse.data;
            return {
              ...chat,
              otherUser: {
                id: otherUserId,
                fullName: userData.fullName,
                image: userData.profileImage || defaultAvatar
              }
            };
          })
        );
        setChats(enrichedChats);
        const messagesData = await getMessagesByChat(chatId);
        setMessages(messagesData);

        const selectedChat = enrichedChats.find(chat => chat.id === chatId);
        if (selectedChat) {
          setOtherUser(selectedChat.otherUser);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể tải dữ liệu chat!');
        console.error('Fetch data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    connectSignalR();
    fetchData();

    return () => {
      if (connection) {
        connection.invoke('LeaveChat', chatId).then(() => {
          connection.stop();
        });
      }
    };
  }, [chatId, currentUserId, navigate]);

  // Cuộn đến tin nhắn mới nhất khi messages hoặc chatId thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatId]);

  // Cuộn sidebar đến cuộc trò chuyện được chọn
  useEffect(() => {
    if (chatRefs.current[chatId]) {
      chatRefs.current[chatId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.warn('Vui lòng nhập nội dung tin nhắn!');
      return;
    }

    try {
      const messageData = {
        chatId,
        senderId: currentUserId,
        content: newMessage
      };
      console.log('Sending message:', messageData);
      const newMsg = await createMessage(messageData);
      setNewMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn!');
      console.error('Send message error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <HashLoader color="#a858a7" size={45} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col mt-20 container">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Cuộc trò chuyện</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  ref={(el) => (chatRefs.current[chat.id] = el)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${chat.id === chatId ? 'bg-emerald-50' : ''}`}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <img
                    src={chat.otherUser.image}
                    alt={chat.otherUser.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{chat.otherUser.fullName}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">Chưa có cuộc trò chuyện nào</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-3/4 flex flex-col h-full">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              {otherUser ? `Chat với ${otherUser.fullName || 'Không xác định'}` : 'Đang tải...'}
            </h2>
            <button
              onClick={() => navigate(`/profile/${otherUser?.id}`)}
              className="text-gray-600 hover:text-emerald-500"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${msg.senderId === currentUserId
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-gray-900 shadow'
                      }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {msg.sentAt
                        ? new Date(Date.parse(msg.sentAt.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1'))).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'Vừa gửi'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Chưa có tin nhắn nào</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chat-form">
            <div className="flex gap-2 p-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nhập tin nhắn..."
              />
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 flex items-center gap-2"
              >
                <FaPaperPlane /> Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;