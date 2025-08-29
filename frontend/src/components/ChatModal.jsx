import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaUser, FaStore } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import {
  getOrCreateChatRoom,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../api/chat";

const ChatModal = ({ propertyId, sellerId, sellerInfo, propertyTitle, onClose }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        // Get or create chat room
        const room = await getOrCreateChatRoom(propertyId, sellerId);
        setChatRoom(room);

        // Fetch messages
        const chatMessages = await getMessages(room._id);
        setMessages(chatMessages);

        // Mark messages as read
        await markMessagesAsRead(room._id);
      } catch (err) {
        setError("Failed to load chat");
        console.error("Error initializing chat:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      initializeChat();
    }
  }, [currentUser, propertyId, sellerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatRoom) return;

    try {
      const newMessage = {
        text: message,
        roomId: chatRoom._id,
        receiverId: sellerId,
        propertyId: propertyId,
      };

      const sentMessage = await sendMessage(newMessage);

      // Update local state with the new message
      setMessages([...messages, sentMessage]);
      setMessage("");
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  // Helper function to determine message styling and info
  const getMessageInfo = (msg) => {
    const isCurrentUser = msg.senderId._id === currentUser.id;
    const isSeller = msg.senderId.role === 'seller';
    const isBuyer = msg.senderId.role === 'buyer';

    return {
      isCurrentUser,
      isSeller,
      isBuyer,
      senderName: msg.senderId.name,
      senderRole: msg.senderId.role,
      alignment: isCurrentUser ? 'justify-end' : 'justify-start',
      bubbleColor: isCurrentUser 
        ? (isSeller ? 'bg-green-500 text-white' : 'bg-blue-500 text-white')
        : (isSeller ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'),
      roleIcon: isSeller ? <FaStore className="text-xs" /> : <FaUser className="text-xs" />,
      roleLabel: isSeller ? 'Seller' : 'Buyer',
      roleLabelColor: isSeller ? 'text-green-600' : 'text-blue-600'
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              {currentUser.role === 'buyer' ? 'Chat with Seller' : 'Chat with Buyer'}
            </h2>
            {propertyTitle && (
              <p className="text-sm opacity-90 truncate">{propertyTitle}</p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors p-1"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="mb-4">
                <FaUser className="text-4xl text-gray-300 mx-auto mb-2" />
              </div>
              <p>No messages yet.</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const messageInfo = getMessageInfo(msg);
              
              return (
                <div key={msg._id} className={`flex ${messageInfo.alignment}`}>
                  <div className="max-w-xs lg:max-w-md">
                    {/* Sender info (only show for other person's messages) */}
                    {!messageInfo.isCurrentUser && (
                      <div className="flex items-center mb-1 px-2">
                        {messageInfo.roleIcon}
                        <span className={`text-xs font-medium ml-1 ${messageInfo.roleLabelColor}`}>
                          {messageInfo.senderName}
                        </span>
                        <span className={`text-xs ml-1 ${messageInfo.roleLabelColor}`}>
                          ({messageInfo.roleLabel})
                        </span>
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div className={`px-4 py-2 rounded-lg shadow-sm ${messageInfo.bubbleColor} ${
                      messageInfo.isCurrentUser 
                        ? 'rounded-tr-none' 
                        : 'rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {/* Show role badge for current user's messages */}
                        {messageInfo.isCurrentUser && (
                          <div className="flex items-center">
                            {messageInfo.roleIcon}
                            <span className="text-xs ml-1 opacity-70">
                              {messageInfo.roleLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200 bg-white rounded-b-lg"
        >
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Type your message as ${currentUser.role}...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              disabled={!chatRoom}
              maxLength={1000}
            />
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded-r-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={!message.trim() || !chatRoom}
            >
              <FaPaperPlane />
            </button>
          </div>
          {/* Character counter */}
          <div className="text-xs text-gray-500 mt-1 text-right">
            {message.length}/1000
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;