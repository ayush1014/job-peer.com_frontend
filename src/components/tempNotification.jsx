import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useNotifications from './notificationHook';

const Notification = ({ isOpen, setIsOpen }) => {
  const username = JSON.parse(sessionStorage.getItem("User")).username;
  const notifications = useNotifications(username);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsOpen(true);
    }
  }, [notifications]);

  const handleClose = () => setIsOpen(false);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        {/* Dialog structure */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md p-4">
                <div className="flex justify-between">
                  <div>Notifications</div>
                  <button onClick={handleClose} className="inline-flex justify-center items-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">Close notifications</span>
                  </button>
                </div>
                {notifications.map((notification, index) => (
                  <div key={index} className="mt-2">
                    <p>{notification.message}</p>
                  </div>
                ))}
              </Dialog.Panel>

            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Notification;
