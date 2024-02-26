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
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    socket.on('newMessage', async (incomingMessage) => {
      if (incomingMessage.conversationId === activeChatConversationId) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        if (incomingMessage.receiver === JSON.parse(sessionStorage.getItem('User')).username && activeChatUser === incomingMessage.sender) {
          const messageId = incomingMessage.id;
          try {
            await markMessagesAsRead([messageId]);
          } catch (error) {
            console.error('Error marking messages as read:', error);
          }
        }
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [activeChatConversationId, activeChatUser]);



  useEffect(() => {
    socket.on('messageRead', ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      socket.off('messageRead');
    };
  }, []);
  useEffect(() => {

    const fetchUnreadMessageCount = async (sender) => {
      try {
        const response = await api.get(`/unreadMessagesCount/${sender}`);
        if (response.data) {
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [sender]: response.data.unreadCount,
          }));
        }
      } catch (error) {
        console.error('Error fetching unread message count:', error);
      }
    };
    const fetchAllUnreadMessageCounts = async () => {
      for (const peer of peerJobs) {
        await fetchUnreadMessageCount(peer.username);
      }
    };

    fetchAllUnreadMessageCounts();
  }, [peerJobs]);

  useEffect(() => {
    const handleUnreadCountUpdate = ({ sender, count }) => {
      if (activeChatUser !== sender) {
        setUnreadCounts(prevCounts => ({
          ...prevCounts,
          [sender]: count,
        }));
      } else {
        setUnreadCounts(prevCounts => ({
          ...prevCounts,
          [sender]: 0,
        }));
      }
    };

    socket.on('unreadCountUpdate', handleUnreadCountUpdate);

    return () => {
      socket.off('unreadCountUpdate', handleUnreadCountUpdate);
    };
  }, [activeChatUser]);


  useEffect(() => {
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

  const markMessagesAsRead = async (messageIds) => {
    try {
      await api.post(`/messages/markAsReadBulk`, { messageIds });
      messageIds.forEach(id => {
        socket.emit('messageRead', { messageId: id });
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };




  const fetchChatHistory = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data);
      const unreadMessageIds = data
        .filter(msg => !msg.isRead && msg.receiver === JSON.parse(sessionStorage.getItem('User')).username)
        .map(msg => msg.id);
      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };


  const startChat = async (username, name) => {
    setActiveChatUser(username);
    setActiveChatUserName(name);
    setIsChatOpen(true);
    try {
      const { data } = await api.get(`/conversations/getOrCreate?sender=${encodeURIComponent(JSON.parse(sessionStorage.getItem('User')).username)}&receiver=${encodeURIComponent(username)}`);
      setActiveChatConversationId(data.conversationId);
      await fetchChatHistory(data.conversationId);
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

    socket.emit('sendMessage', messageData);
    setMessage("");
  };

  const closeChat = () => {
    setActiveChatUser(null);
    setActiveChatUserName("");
    setIsChatOpen(false);
  };

  // const maxMessagesHeight = `calc(100vh - 16rem)`;
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`${isChatOpen ? 'hidden' : 'block'} md:flex flex-col w-full md:w-80 bg-white shadow-md z-10`}>
          <div className="p-4 border-b md:border-b-0">
            <h2 className="text-lg font-semibold">Peers</h2>
          </div>
          <ul className="flex-1 overflow-auto">
            {peerJobs.map((peer) => (
              <li
                key={peer.username}
                className="flex justify-between items-center p-2 hover:bg-gray-100 border-b border-gray-200 overflow-auto"
              >

                <div className="flex items-center justify-start">
                  <span className="text-sm font-medium">{peer.name} (@{peer.username})</span>
                  {unreadCounts[peer.username] > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadCounts[peer.username]}
                    </span>
                  )}
                </div>
                <button
                  className="ml-2 inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              <p className="mt-2 text-lg text-gray-600">Select a Peer to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );

}
