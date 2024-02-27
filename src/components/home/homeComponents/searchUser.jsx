import React, { useState, useEffect } from "react";
import api from '../../../config/axios';

function SearchUser() {
    const [searchQuery, setSearchQuery] = useState('');
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = sessionStorage.getItem('User');
        if (user) {
            const loggedUser = JSON.parse(user);
            setUsername(loggedUser.username);
        }
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            fetchMatchingUsers(query);
        } else {
            setMatchingUsers([]);
        }
    };

    const fetchMatchingUsers = async (query) => {
        try {
            const response = await api.get(`/searchPeer/${username}/${query}`);
            setMatchingUsers(response.data);
        } catch (error) {
            // console.error('Error fetching matching users:', error);
            setMatchingUsers([]);
        }
    };
    

    return (
        <div>
            <input
                type="text"
                placeholder="Search User"
                style={{ width: '50%', margin: 'auto' }}
                value={searchQuery}
                onChange={handleSearchChange}
                list="users-datalist"
            />
            <datalist id="users-datalist">
                {matchingUsers.map((user, index) => (
                    <option key={index} value={user.username} /> 
                ))}
            </datalist>
        </div>
    );
}

export default SearchUser;
