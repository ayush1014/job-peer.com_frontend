import axios from 'axios'
// console.log("URL",process.env.REACT_APP_BASE_URL)
//setting the base url for ease
const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export default api;