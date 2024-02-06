import React, { useEffect, useState } from 'react';
import './home.css'
import { useParams, useNavigate } from 'react-router-dom';
import AddJobs from './homeComponents/addJobs';
import ViewJobs from './homeComponents/viewAllJobs';
import Piechar from './homeComponents/piechar';
import JobStatsBarChart from './homeComponents/barchat'
import HomeJobs from '../home/homeComponents/HomeJobs'
import Hamburger from 'hamburger-react';
import Leaderboard from './homeComponents/leaderboard';
import Navbar from '../Navbar/Navbar';
import SearchUser from './homeComponents/searchUser';
import PageNotFound from '../NotFound';

function Home() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [authenticate, setAuthenticate] = useState(false);
  const [home, setHome] = useState(true);
  const [addJob, setAddJob] = useState(false)
  const [viewAllJobs, setViewAllJobs] = useState(false);
  const [jobStats, setJobStats] = useState(true);
  const [appStats, setAppStats] = useState(false);
  const [leaderboard, setLeaderboard] = useState(false);

  useEffect(() => {
    const userCheckStr = sessionStorage.getItem('User');
    if (userCheckStr) {
      const userCheck = JSON.parse(userCheckStr);
      setStoredUser(userCheck);
    } else {
      console.log('Nothing in Storage');
    }

    // // Cleanup function with a delay to clear session storage
    // return () => {
    //   const timeoutId = setTimeout(() => {
    //     sessionStorage.clear();
    //     console.log('Session storage cleared after 5 minutes');
    //   }, 300000); // 300000 milliseconds = 5 minutes

    //   // Clear the timeout if the component remounts within the delay period
    //   return () => clearTimeout(timeoutId);
    // };
  }, []);

  useEffect(() => {
    if (storedUser && storedUser.username === username) {
      setAuthenticate(true);
      console.log('Authentication successful');
    } else {
      setAuthenticate(false);
      if (storedUser) {
        console.log('Invalid User !!');
        navigate('/login'); // Redirect to login page if authentication fails
      }
    }
  }, [storedUser, username, navigate]); // Include `navigate` in dependencies

  const handelAddJob = () => {
    setAddJob(!addJob);
  }

  const handleHome = () => {
    setLeaderboard(false)
    setHome(true)
    setAddJob(false)
    setViewAllJobs(false)
    setOpen(false)
  }

  const handleJobs = () => {
    setLeaderboard(false)
    setAddJob(false)
    setHome(false)
    setViewAllJobs(true)
    setOpen(false)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
    setOpen(false)
  }

  const handleJobStats = () => {
    setLeaderboard(false)
    setAppStats(false)
    setJobStats(true)
  }

  const handleAppStats = () => {
    setLeaderboard(false)
    setAppStats(true)
    setJobStats(false)
  }

  const handleLeaderboard = () => {
    setAppStats(false)
    setJobStats(false)
    setLeaderboard(true)
  }

  return (
    <>
      {authenticate && storedUser ? <div>
        {/* <nav className={`nav ${isaOpen ? 'open' : ''}`}>
          <div className='hamburger-menu'>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          {isOpen && (
            <>
              <button onClick={handleHome}>Home</button>
              <button onClick={handelAddJob}>Add Job</button>
              <button onClick={handleJobs}>View All Jobs</button>
              <button onClick={handleLeaderboard}>Leaderboard</button>
              <button className='logout-btn' onClick={handleLogout}>Log Out</button>
            </>
          )}
          {!isOpen && (
            <>
              <button onClick={handleHome}>Home</button>
              <button onClick={handelAddJob}>Add Job</button>
              <button onClick={handleJobs}>View All Jobs</button>
              <button onClick={handleJobs}>Leaderboard</button>
              <button className='logout-btn' onClick={handleLogout}>Log Out</button>
            </>
          )}
        </nav> */}
        <Navbar handleHome={handleHome} handelAddJob={handelAddJob} handleJobs={handleJobs} handleLeaderboard={handleLeaderboard} handleLogout={handleLogout} isOpen={isOpen} setOpen={setOpen} username={storedUser.name} userEmail={storedUser.email}/>
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Welcome <span className='user-welcome-span'>{`${storedUser.name}`}</span>!!</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{/* Your content */}</div>
          </main>
        </div>
        
        {home && <div className='home'>

          <div className='wrapper'>
            <div className='charts-container'>
              <div className='stats-btn'>
                <button onClick={handleJobStats}>Jobs Stats</button>
                <button onClick={handleAppStats}>Application Process Stats</button>
              </div>
              {jobStats && <div className='bar-chart-container'>
                <JobStatsBarChart />
              </div>}
              {appStats && <div className='pie-chart-container'>
                <Piechar />
              </div>}
            </div>
            <div className='layout-job'>
              <SearchUser></SearchUser>
              <span>Recently Applied Jobs</span>
              <HomeJobs />
            </div>

          </div>
        </div>}
        {addJob && <div>
          <AddJobs handelAddJob={handelAddJob} />
        </div>}
        {viewAllJobs && <div>
          <ViewJobs />
        </div>}
      </div> : <PageNotFound />}
    </>
  );
}

export default Home;

