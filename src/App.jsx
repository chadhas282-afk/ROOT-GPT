import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import ChatBox from './components/ChatBox';
import Credits from './pages/Credits';
import Community from './pages/community';
import { AppContextProvider } from './context/AppContext';
import { useState } from 'react';
import { assets } from './assets/assets';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <AppContextProvider> 
      {
        !isMenuOpen && <img src={assets.menu_icon} alt="menu" className='w-8 h-8 absolute top-3 left-3 cursor-pointer md:hidden not-dark:invert' onClick={() => setIsMenuOpen(true)} />
      }
      <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
          <div className='flex h-screen w-screen'>
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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