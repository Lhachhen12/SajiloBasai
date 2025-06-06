// src/components/ChatModal.jsx
import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
// import { db } from '../firebase';
// import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

const ChatModal = ({ propertyId, sellerId, onClose }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Create a unique chat room ID based on property and participants
  const chatRoomId = [currentUser.uid, sellerId, propertyId].sort().join('_');

  useEffect(() => {
    if (!currentUser) return;

    // Reference to the messages collection for this chat room
    const messagesRef = collection(db, 'chats', chatRoomId, 'messages');
    
    // Query to get messages ordered by timestamp
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    // Set up real-time listener for messages
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatRoomId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatRoomId, 'messages');
      await addDoc(messagesRef, {
        text: message,
        senderId: currentUser.uid,
        receiverId: sellerId,
        timestamp: serverTimestamp(),
        propertyId: propertyId
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-primary-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chat with Seller</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser.uid 
                    ? 'bg-primary-500 text-white rounded-tr-none' 
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            />
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;