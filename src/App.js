import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import Home from './components/home/home';
import ShowDetails from './components/home/homeComponents/ShowDetails';
import Leaderboard from './components/home/homeComponents/leaderboard';
import PageNotFound from './components/NotFound';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/home/:username' element={<Home/>}/>
        <Route path='/job_details/:id' element={<ShowDetails/>}/>
        <Route path='/leaderboard/:id' element={<Leaderboard/>}/>
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
