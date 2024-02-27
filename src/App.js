import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ShowDetails from './components/home/homeComponents/ShowDetails';
import Leaderboard from './components/Leaderboard';
import PageNotFound from './components/NotFound';
import ViewAllJobs from './components/Jobs';
import './App.css'
import About from './components/About';
import Peerchat from './components/Peerchat';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPass';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/home/:username' element={<Home/>}/>
        <Route path='/job_details/:username' element={<ShowDetails/>}/>
        <Route path='/leaderboard/:username' element={<Leaderboard/>}/>
        <Route path='/jobs/:username' element={<ViewAllJobs/>} />
        <Route path='/peerchat/:username' element={<Peerchat/>} />
        <Route path='/forget-password' element={<ForgetPassword />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />}/>
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;