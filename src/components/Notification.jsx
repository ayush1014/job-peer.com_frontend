import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useNotifications from './notificationHook';
import { MdDeleteForever } from "react-icons/md";
import api from '../config/axios'; // Ensure the import path is correct

export default function Notification({ isOpen, setIsOpen }) {
  const [open, setOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const username = JSON.parse(sessionStorage.getItem("User")).username;

  const fetchedNotifications = useNotifications(username);

  useEffect(() => {
    if (fetchedNotifications.length > 0) {
      setNotifications(fetchedNotifications);
      setOpen(true); // Open the notification panel if there are new notifications
    }
  }, [fetchedNotifications]);

  const handleAccept = async (id, sender) => {
    await api.put(`/peerFollowed/${sender}/${username}`)
    setNotifications(notifications.filter(notification => notification.id !== id));
    // window.location.reload();
    // console.log(`Accepted notification with ID: ${id}`);
    await api.delete(`/deleteNotification/${id}`);
    // window.location.reload()

  };

  const handleDecline = async (id, sender) => {
    // Implement the logic to decline the notification here
    // Optionally, delete the notification from the backend
    await api.delete(`/peerUnFollow/${sender}/${username}`)
    setNotifications(notifications.filter(notification => notification.id !== id));
    await api.delete(`/deleteNotification/${id}`);
    // console.log(`Declined notification with ID: ${id}`);

  };

  const handleDelete = async (id, sender) => {
    // Implement the logic to delete the notification from the backend
    // console.log(`Deleting notification with ID: ${id}`);
    // Example API call to delete the notification
    setNotifications(notifications.filter(notification => notification.id !== id));
    await api.delete(`/deleteNotification/${id}`);
    await api.delete(`/peerUnFollow/${sender}/${username}`)

    // Refresh notifications list or remove the notification from the state
  };

  return (
    <Fragment>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Notifications
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 px-4 py-6 sm:px-6">
                        {/* Dynamically render notifications */}
                        {notifications.map((notification, index) => (
                          <div key={index} className="p-4 mb-4 rounded-lg bg-gray-100 relative">
                            <button
                              onClick={() => handleDelete(notification.id, notification.sender)}
                              className="absolute top-0 right-0 p-2"
                            >
                              <MdDeleteForever className="text-2xl text-red-500" />
                            </button>
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                              {notification.status === 'requestNoti' && (
                                <div className="mt-4 flex">
                                  <button
                                    type="button"
                                    className="mr-2 inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    onClick={() => handleAccept(notification.id, notification.sender)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    onClick={() => handleDecline(notification.id, notification.sender)}
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <p className="text-center text-sm text-gray-500">No new notifications.</p>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
