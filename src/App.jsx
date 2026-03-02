import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import ChatBox from './components/ChatBox';
import Credits from './pages/Credits';
import Community from './pages/community';
import { AppContextProvider } from './context/AppContext'; // 1. Import the Provider

const App = () => {
  return (
    <AppContextProvider> 
      <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
          <div className='flex h-screen w-screen'>
          <SideBar />
          <Routes>
            <Route path='/' element={<ChatBox />} />
            <Route path='/community' element={<Community />} />
            <Route path='/credits' element={<Credits />} />
          </Routes>
        </div>
      </div>
    </AppContextProvider>
  );
}

export default App;