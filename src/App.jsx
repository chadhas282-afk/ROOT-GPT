import React from 'react';
import SideBar from './components/SideBar';
import ChatBox from './components/ChatBox';
import Credits from './pages/Credits';
import Community from './pages/community';

const App = () => {
  return (
    <>
    <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
        <SideBar />
        <Routes>
          <Routes path="/" element={<ChatBox />} />
          <Routes path="/Credits" element={<Credits />} />
          <Routes path="/Community" element={<Community />} />
        </Routes>
      </div>
    </div>
    </>
  );
}

export default App;
