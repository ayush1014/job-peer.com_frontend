/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useParams, useNavigate } from "react-router-dom";
import AddJobs from "./home/homeComponents/addJobs";
import profilePic from "../assets/profile/profilePic.jpeg"
import Notification from "./Notification";
import api from "../config/axios";
import io from 'socket.io-client'
import logo from '../../src/assets/J.png'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [addJob, setAddJob] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isOpen, setIsOpen] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const handelAddJob = () => {
    setAddJob(!addJob);
  };
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    const userCheckStr = sessionStorage.getItem("User");
    // console.log("User", userCheckStr);
    if (userCheckStr) {
      const userCheck = JSON.parse(userCheckStr);
      setStoredUser(userCheck);
    } else {
      console.log("Nothing in Storage");
    }
    const currentPath = window.location.pathname;
    if (currentPath.startsWith(`/home/${username}`)) {
      setActiveLink("home");
    } else if (currentPath.startsWith(`/jobs/${username}`)) {
      setActiveLink("jobs");
    } else if (currentPath.startsWith("/leaderboard")) {
      setActiveLink("leaderboard");
    } else if (currentPath.startsWith("/peerchat")) {
      setActiveLink("peerchat");
    }
  }, [username]);
  

  useEffect(() => {
    // Fetch initial notification count on mount
    const fetchNotificationCount = async () => {
      try {
        const response = await api.get(`/notifications/count/${username}`);
        setNotificationCount(response.data.count);
      } catch (error) {
        // console.error("Failed to fetch notification count", error);
      }
    };

    fetchNotificationCount();

    // Setup socket listener for real-time updates
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket']
    });
    socket.on('connect', () => {
      // console.log('Connected to WebSocket server for notification count updates');
      socket.emit('join', username); 
    });

    socket.on('notificationCountUpdate', (data) => {
      setNotificationCount(data.count);
    });

    return () => {
      socket.off('connect');
      socket.off('notificationCountUpdate');
      socket.disconnect(); 
    };
  }, [username]);

  const handleJobs = () => {
    if (storedUser && storedUser.username) {
      setActiveLink("jobs");
      navigate(`/jobs/${storedUser.username}`);
    } else {
      console.error("Stored user username is undefined. Cannot navigate to jobs.");
    }
  };
  
  

  const handleHome = () => {
    handleLinkClick("home"); // First update the active link
    // console.log("activeLink after updating:", activeLink);
    // console.log("Navigating to:", `/home/${username}`);
    navigate(`/home/${username}`); // Then navigate
  };
  const handleLeaderboard = () => {
    handleLinkClick("home");
    // console.log("activeLink after updating:", activeLink);
    // console.log("Navigating to:", `/leaderboard/${username}`);
    navigate(`/leaderboard/${username}`);
  };

  const handlePeerboard = () => {
    if (storedUser && storedUser.username) {
      handleLinkClick("peerchat");
      navigate(`/peerchat/${storedUser.username}`); // Include the username in the path
    } else {
      console.error("Stored user username is undefined. Cannot navigate to peer chat.");
    }
  };
  

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    setIsOpen(false);
  };

  const handleNotification = () => {
    setNotification(!notification);
  }

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xlx px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <a
                    style={{ textDecoration: "none", cursor: "pointer" }}
                    to="/home"
                  >
                    <img
                      className="h-10 w-auto"
                      src={logo}
                      alt="Job-Peer Logo"
                    />
                  </a>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <a
                    onClick={handleHome}
                    className={classNames(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 no-underline cursor-pointer",
                      activeLink === "home"
                        ? "border-b-2 border-indigo-500 text-gray-900"
                        : "hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    Home
                  </a>
                  <a
                    onClick={handleJobs}
                    className={classNames(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 no-underline cursor-pointer",
                      activeLink === "jobs"
                        ? "border-b-2 border-indigo-500 text-gray-900"
                        : "hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    Jobs
                  </a>
                  <a
                    onClick={handleLeaderboard}
                    className={classNames(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 no-underline cursor-pointer",
                      activeLink === "leaderboard"
                        ? "border-b-2 border-indigo-500 text-gray-900"
                        : "hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    Peerboard
                  </a>
                  <a
                    onClick={handlePeerboard}
                    className={classNames(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 no-underline cursor-pointer",
                      activeLink === "peerchat"
                        ? "border-b-2 border-indigo-500 text-gray-900"
                        : "hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    Peer Chat
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handelAddJob}
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 no-underline cursor-pointer"
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Add Job
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleNotification}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={profilePic}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 no-underline"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                onClick={handleHome}
                as="a"
                href="#"
                className={classNames(
                  "block py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 no-underline",
                  activeLink === "home" ? "border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700" : "border-l-4 border-transparent text-gray-500",
                  "hover:border-gray-300 hover:text-gray-700"
                )}
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                onClick={handleJobs}
                as="a"
                href="#"
                className={classNames(
                  "block py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 no-underline",
                  activeLink === "jobs" ? "border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700" : "border-l-4 border-transparent text-gray-500",
                  "hover:border-gray-300 hover:text-gray-700"
                )} >
                Jobs
              </Disclosure.Button>
              <Disclosure.Button
                onClick={handleLeaderboard}
                as="a"
                href="#"
                className={classNames(
                  "block py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 no-underline",
                  activeLink === "leaderboard" ? "border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700" : "border-l-4 border-transparent text-gray-500",
                  "hover:border-gray-300 hover:text-gray-700"
                )}>
                Peerboard
              </Disclosure.Button>
              <Disclosure.Button
                onClick={handlePeerboard}
                as="a"
                href="#"
                className={classNames(
                  "block py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 no-underline",
                  activeLink === "peerchat" ? "border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700" : "border-l-4 border-transparent text-gray-500",
                  "hover:border-gray-300 hover:text-gray-700"
                )}>
                Peer chat
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4 no-underline">
              <div className="flex items-center px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={profilePic}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {storedUser && storedUser.username}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {storedUser && storedUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
                  onClick={handleNotification}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  onClick={handleLogout}
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6 no-underline"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
          {addJob && (
            <div>
              <AddJobs handelAddJob={handelAddJob} />
            </div>
          )}
          {notification && (
            <Notification isOpen={notification} setIsOpen={setNotification} />
          )}
        </>
      )}
    </Disclosure>
  );
};
export default Navbar;
