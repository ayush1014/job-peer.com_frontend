import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { ChatBubbleOvalLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../config/axios';
import io from 'socket.io-client';

// const socket = io('http://localhost:8000');
const socket = io('https://job-peer.onrender.com');

export default function Peerchat() {
  const [peerJobs, setPeerJobs] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeChatUserName, setActiveChatUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatConversationId, setActiveChatConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    socket.on('newMessage', (incomingMessage) => {
      if (incomingMessage.conversationId === activeChatConversationId) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [activeChatConversationId]);



  useEffect(() => {
    // Fetch peer jobs on component mount or when the active chat user changes
    const fetchPeers = async () => {
      const storedUser = JSON.parse(sessionStorage.getItem('User')).username;
      try {
        const response = await api.get(`/confirmedPeer/${storedUser}`);
        setPeerJobs(response.data.map(peer => {
          return peer.requestedPeerLeaderBoard.username !== storedUser
            ? peer.requestedPeerLeaderBoard
            : peer.requestingPeerLeaderBoard;
        }).filter(peer => peer !== null));
      } catch (error) {
        console.error('Error fetching peer jobs:', error);
      }
    };
    console.log(peerJobs)
    fetchPeers();
  }, [activeChatUser]);

  const fetchChatHistory = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };


  const startChat = async (username, name) => {
    setActiveChatUser(username);
    setActiveChatUserName(name);
    setIsChatOpen(true);

    // Fetch or create a conversationId from the backend
    try {
      const { data } = await api.get(`/conversations/getOrCreate?sender=${encodeURIComponent(JSON.parse(sessionStorage.getItem('User')).username)}&receiver=${encodeURIComponent(username)}`);
      setActiveChatConversationId(data.conversationId);

      // Fetch chat history
      await fetchChatHistory(data.conversationId);

      // Then emit to join the socket room
      socket.emit('joinConversation', data.conversationId);
    } catch (error) {
      console.error('Error fetching or creating conversation:', error);
    }
  };


  const handleSendMessage = () => {
    if (!message.trim()) {
      console.error('No message to send');
      return;
    }

    if (!activeChatConversationId) {
      console.error('No active conversation selected');
      return;
    }

    const messageData = {
      sender: JSON.parse(sessionStorage.getItem('User')).username,
      receiver: activeChatUser,
      text: message.trim(),
      conversationId: activeChatConversationId,
    };

    // Emit the message
    socket.emit('sendMessage', messageData);
    setMessage("");
  };

  const closeChat = () => {
    setActiveChatUser(null);
    setActiveChatUserName("");
    setIsChatOpen(false);
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${isChatOpen ? 'hidden' : 'block'} md:flex flex-col w-full md:w-80 bg-white shadow-md z-10 overflow-y-auto`}>
          <div className="p-4 border-b md:border-b-0">
            <h2 className="text-lg font-semibold">Friends</h2>
          </div>
          <ul>
            {peerJobs.map((peer) => (
              <li key={peer.username} className="flex justify-between items-center p-2 hover:bg-gray-100">
                <div className="overflow-auto whitespace-nowrap">
                  <span className="text-sm font-medium">{peer.name} (@{peer.username})</span>
                </div>
                <button
                  className="ml-2 inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => startChat(peer.username, peer.name)}
                >
                  Chat
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content area */}
        <div className={`flex flex-1 ${isChatOpen || activeChatUser ? 'flex' : 'hidden'} md:flex md:flex-col lg:w-2/3`}>
          {activeChatUser ? (
            <div className="flex flex-col flex-grow">
              {/* Chat header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Chat with {activeChatUserName}</h3>
                <button onClick={closeChat} className="rounded-full p-1 hover:bg-gray-200">
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(82vh-6rem)] max-h-[calc(100vh-15rem)]">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.sender === JSON.parse(sessionStorage.getItem('User')).username
                      ? 'items-end' : 'items-start'}`}
                  >
                    <span className={`text-sm ${msg.sender === JSON.parse(sessionStorage.getItem('User')).username
                      ? 'text-blue-500' : 'text-gray-600'}`}>
                      {msg.sender === JSON.parse(sessionStorage.getItem('User')).username ? 'You' : msg.sender}
                    </span>
                    <div
                      className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${msg.sender === JSON.parse(sessionStorage.getItem('User')).username
                        ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 rounded-bl-none'}`}
                    >
                      <span className="block">{msg.text}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="mt-auto p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-grow justify-center items-center">
              <ChatBubbleOvalLeftIcon className="h-20 w-20 text-gray-400" aria-hidden="true" />
              <p className="mt-2 text-lg text-gray-600">Select a friend to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );

}
