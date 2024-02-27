/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../config/axios';

// const socket = io('http://localhost:8000', { withCredentials: true });
// const socket = io('https://job-peer.onrender.com', { withCredentials: true });
// const socket = io('job-peer.onrender.com', { withCredentials: true });
const socket = io(process.env.REACT_APP_SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket']
});

const useNotifications = (username) => {
  const [notifications, setNotifications] = useState([]);

  const fetchStoredNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${username}`);
      setNotifications(response.data); // Assuming the API returns an array of notifications
      // console.log('notifications:', notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchStoredNotifications(); // Fetch stored notifications on mount
      socket.emit('join', username);
    }

    socket.on('notification', (notification) => {
      // Update notifications state with new notification
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    return () => {
      socket.off('notification');
    };
  }, [username]);

  return notifications;
};

export default useNotifications;
