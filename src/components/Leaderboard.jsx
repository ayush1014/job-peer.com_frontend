import { Fragment, useState, useEffect } from 'react'
import { UsersIcon } from '@heroicons/react/24/outline'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import api from '../config/axios'
import Navbar from './Navbar'
import { IoIosPersonAdd } from "react-icons/io";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}


export default function Leaderboard() {
    const [storedUser, setStoredUser] = useState(null);
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [people, setPeople] = useState([]);
    const [peerJobs, setPeerJobs] = useState([]);
    const [addClick, setAddClick] = useState(false);

    useEffect(() => {
        const username = JSON.parse(sessionStorage.getItem('User')).username;

        setStoredUser(username);
    }, []);


    useEffect(() => {
        const fetchUsers = async (query) => {
            if (!query) return;
            try {
                const response = await api.get(`/searchPeer/${storedUser}/${query}`);
                const peopleData = response.data;

                // Initialize an object to track request states
                let requestStates = {};

                // Fetch request state for each person
                for (const person of peopleData) {
                    const requestResponse = await api.get(`/checkRequest/${storedUser}/${person.username}`);
                    requestStates[person.username] = requestResponse.data.reqSend;
                }

                setPeople(peopleData);
                setAddClick(requestStates);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers(query);
    }, [query, storedUser]);

    const filteredPeople =
        query === ''
            ? []
            : people.filter((person) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })


    // Fetch peer jobs
    useEffect(() => {
        const fetchPeers = async () => {
            try {
                const response = await api.get(`/confirmedPeer/${storedUser}`);
                const data = response.data;
                const filteredPeers = data.map(peer => {
                    if (peer.requestedPeerLeaderBoard.username !== storedUser) {
                        return peer.requestedPeerLeaderBoard;
                    }
                    else if (peer.requestingPeerLeaderBoard.username !== storedUser) {
                        return peer.requestingPeerLeaderBoard;
                    }
                    return null;
                }).filter(peer => peer !== null);
                setPeerJobs(filteredPeers);
            } catch (error) {
                console.error('Error fetching peer jobs:', error);
            }
        };

        if (storedUser) {
            fetchPeers();
        }
    }, [storedUser]);

    const handleSearch = () => {
        setOpen(true)
    }

    const handleAdd = async (person) => {
        if (!storedUser) return;
        try {
            await api.get(`/peerFollow/${storedUser}/${person.username}`);
            // console.log(response.data.message);
            // setPeerJobs(currentPeers => [...currentPeers, person]);
            setAddClick(prevState => ({ ...prevState, [person.username]: true }));
        } catch (error) {
            console.error('Error sending follow request:', error);
        }
    };

    const handleUnAdd = async (personUsername) => {
        if (!storedUser) return;
        try {
            const response = await api.delete(`/peerUnFollow/${storedUser}/${personUsername}`);
            console.log(response.data.message);
            // Remove the person from peerJobs state
            setPeerJobs(currentPeers => currentPeers.filter(peer => peer.username !== personUsername));
            setAddClick(prevState => ({ ...prevState, [personUsername]: false }));
        } catch (error) {
            console.error('Error sending unfollow request:', error);
        }
    };


    return (
        <>
            <Navbar />
            <div className="px-4 sm:px-6 lg:px-8">
                {!open ? <>
                    <div className="flex mt-10 justify-center items-center">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                            onClick={handleSearch}
                        >
                            <IoIosPersonAdd className="text-lg md:text-xl" />
                            Add Peer
                        </button>
                    </div>

                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 text-center">
                                                Username
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible text-center">
                                                    {/* <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 text-center">
                                                Name
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible text-center">
                                                    {/* <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center">
                                                Total Job Applied
                                                <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200 text-center">
                                                    {/* <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center">
                                                Job Applied In One Hour
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {/* <ChevronDownIcon
                                                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                                        aria-hidden="true"
                                                    /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Job Applied In One Day
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {/* <ChevronDownIcon
                                                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                                        aria-hidden="true"
                                                    /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Job Applied In One Week
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {/* <ChevronDownIcon
                                                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                                        aria-hidden="true"
                                                    /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Job Applied In One Month
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    {/* <ChevronDownIcon
                                                        className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                                        aria-hidden="true"
                                                    /> */}
                                                </span>
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-0">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {peerJobs.map((person) => (
                                            <tr key={person.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 tx text-center">
                                                    {person.username}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{person.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{person.numberOfJobs}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{person.numberOfJobsHour}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{person.numberOfJobsDay}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{person.numberOfJobsWeek}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{person.numberOfJobsMonth}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0 text-center">
                                                    <button
                                                        type="button"
                                                        className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-center"
                                                        onClick={() => handleUnAdd(person.username)}
                                                    >
                                                        Unadd Peer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </> : <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
                    <Dialog as="div" className="relative z-10" onClose={setOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all text-xs sm:text-sm">
                                    <Combobox onChange={(person) => (handleAdd)}>
                                        <Combobox.Input
                                            className="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                                            placeholder="Search For Your Peer by Username..."
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                        {filteredPeople.map((person) => (
                                            <Combobox.Option
                                                key={person.id}
                                                value={person}
                                                className={({ active }) =>
                                                    classNames(
                                                        'cursor-default select-none rounded-md px-4 py-2 flex justify-between items-center',
                                                        active ? 'bg-gray-300' : 'text-gray-900'
                                                    )
                                                }
                                            >
                                                <span >{person.name}</span>
                                                <span style={{wordBreak:'break-all'}}>@{person.username}</span>
                                                {!addClick[person.username] ? (
                                                    <button
                                                        type="button"
                                                        className="ml-4 inline-flex items-center rounded-md bg-indigo-600 px-2 py-2 text-xs sm:text-xs md:text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                        onClick={() => handleAdd(person)}
                                                    >
                                                        Add Peer
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="ml-4 inline-flex items-center rounded-md bg-red-600 px-2 py-2 text-xs sm:text-xs md:text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                        onClick={() => handleUnAdd(person.username)}
                                                    >
                                                        Unadd Peer
                                                    </button>
                                                )}
                                            </Combobox.Option>
                                        ))}



                                        {query !== '' && filteredPeople.length === 0 && (
                                            <div className="px-4 py-14 text-center sm:px-14">
                                                <UsersIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                                                <p className="mt-4 text-sm text-gray-900">No people found using that search term.</p>
                                            </div>
                                        )}
                                    </Combobox>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>}
            </div>
        </>
    )
}

// import React, { Fragment, useState, useEffect } from 'react';
// import { ChevronDownIcon, UsersIcon } from '@heroicons/react/24/outline';
// import { Dialog, Transition, Combobox } from '@headlessui/react';
// import api from '../../../config/axios'; // Assuming axios is set up for API calls

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ');
// }

// export default function Leaderboard() {
//     const [storedUser, setStoredUser] = useState('');
//     const [open, setOpen] = useState(false);
//     const [query, setQuery] = useState('');
//     const [people, setPeople] = useState([]);
//     const [peerJobs, setPeerJobs] = useState([]);

//     // Fetch stored user on component mount
//     useEffect(() => {
//         const storedUserData = JSON.parse(sessionStorage.getItem('User'));
//         if (storedUserData) {
//             setStoredUser(storedUserData.username);
//         }
//     }, []);

//     // Fetch users based on search query
//     useEffect(() => {
//         const fetchUsers = async () => {
//             if (query.length > 0) {
//                 try {
//                     const response = await api.get(`/searchPeer/${storedUser}/${query}`);
//                     setPeople(response.data);
//                 } catch (error) {
//                     console.error('Error fetching users:', error);
//                 }
//             }
//         };

//         fetchUsers();
//     }, [query, storedUser]);

//     // Fetch peer jobs
//     useEffect(() => {
//         const fetchPeers = async () => {
//             try {
//                 const response = await api.get(`/confirmedPeer/${storedUser}`);
//                 setPeerJobs(response.data);
//                 console.log(peerJobs);
//             } catch (error) {
//                 console.error('Error fetching peer jobs:', error);
//             }
//         };

//         if (storedUser) {
//             fetchPeers();
//         }
//     }, [storedUser]);

//     const handleAdd = async (person) => {
//         try {
//             await api.get(`/peerFollow/${storedUser}/${person.username}`);
//             // Optionally, fetch peers again to update the list
//             console.log(`Follow request sent to ${person.username}`);
//         } catch (error) {
//             console.error('Error sending follow request:', error);
//         }
//     };

//     return (
//         <div className="px-4 sm:px-6 lg:px-8">
//             <div className="sm:flex sm:items-center">
//                 <div className="sm:flex-auto">
//                     <h1 className="text-xl font-semibold text-gray-900">Leaderboard</h1>
//                 </div>
//                 <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//                     <button
//                         onClick={() => setOpen(true)}
//                         className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                         Add Peer
//                     </button>
//                 </div>
//             </div>

//             {/* Display peers */}
//             <ul className="divide-y divide-gray-200">
//                 {peerJobs.map((job) => (
//                     <li key={job.id} className="py-4">
//                         <h3 className="text-sm font-bold text-gray-900">{job.requestedPeer}</h3>
//                         <p className="text-sm text-gray-500">Total Jobs Applied: {job.requestedPeerLeaderBoard.numberOfJobs}</p>
//                         <p className="text-sm text-gray-500">Jobs applied in one day: {job.requestedPeerLeaderBoard.numberOfJobsDay}</p>
//                         <p className="text-sm text-gray-500">Jobs applied in one hour: {job.requestedPeerLeaderBoard.numberOfJobsHour}</p>
//                     </li>
//                 ))}
//             </ul>

//             {/* Search and add peers */}
//             <Transition.Root show={open} as={Fragment}>
//                 <Dialog as="div" className="relative z-10" onClose={setOpen}>
//                     <Transition.Child
//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//                     </Transition.Child>

//                     <div className="fixed inset-0 z-10 overflow-y-auto">
//                         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//                             <Transition.Child
//                                 as={Fragment}
//                                 enter="ease-out duration-300"
//                                 enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                                 enterTo="opacity-100 translate-y-0 sm:scale-100"
//                                 leave="ease-in duration-200"
//                                 leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                                 leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                             >
//                                 <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
//                                     <Combobox onChange={handleAdd}>
//                                         <Combobox.Input
//                                             className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
//                                             onChange={(e) => setQuery(e.target.value)}
//                                             placeholder="Search peers..."
//                                         />
//                                         {people.length > 0 && (
//                                             <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                                                 {people.map((person) => (
//                                                     <Combobox.Option
//                                                         key={person.id}
//                                                         value={person}
//                                                         className={({ active }) =>
//                                                             classNames('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900')
//                                                         }
//                                                     >
//                                                         {person.name}
//                                                     </Combobox.Option>
//                                                 ))}
//                                             </Combobox.Options>
//                                         )}
//                                     </Combobox>
//                                 </Dialog.Panel>
//                             </Transition.Child>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition.Root>
//         </div>
//     );
// }