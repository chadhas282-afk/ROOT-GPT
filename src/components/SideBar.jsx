import React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { assets } from "../assets/assets";
import moment from "moment"

const SideBar = ({isMenuOpen, setIsMenuOpen}) => {
const { chats, setSelectedChats, theme, setTheme, user, navigate } = useAppContext();
  const [search, setSearch] = useState("");
  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"} md:translate-x-0`}>
      <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="" className="w-full max-w-48" />
    <button className = "flex justify-center items-center w-full py-2 mt-10 text-white bg-linear-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer">
      <span className="mr-2 text-xl">+</span> New Chat
    </button>
    <div className = "flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
      <img src={assets.search_icon} className = "w-4 not-dark:invert" alt="search image" />
      <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder = "Search Conversation" className = "text-xs placeholder:text-gray-400 outline-none"/>
     </div>

{
  chats?.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>
}
<div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
{chats?.filter((chat) => 
  chat.messages[0]?.content?.toLowerCase().includes(search.toLowerCase()) ||
  chat.name?.toLowerCase().includes(search.toLowerCase())
).map((chat) => (
  <div onClick={() => {navigate("/"); setSelectedChats(chat); setIsMenuOpen(false)}} 
  key={chat._id} className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 rounded-md flex justify-between cursor-pointer group">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">
        {chat.messages?.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
      </p>
      <p className="text-[10px] opacity-50 mt-1">
        {moment(chat.updatedAt).fromNow()}
      </p>
    </div>
    <img src={assets.bin_icon} className="hidden group-hover:block w-4 cursor-pointer not-dark:invert" alt="delete" />

  </div>
))}

    </div>

    <div onClick = {() => {navigate("/community"); setIsMenuOpen(false)}}
     className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
      <img src={assets.gallery_icon} alt="gallery" className = "w-4.5 not-dark:invert"/>
      <div className='text-xs flex flex-col'>
        <p>Community Images</p>
      </div>

    </div>
    <div onClick = {() => {navigate("/Credits"); setIsMenuOpen(false)}}
     className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
      <img src={assets.diamond_icon
      } alt="gallery" className = "w-4.5 dark:invert"/>
      <div className='text-xs flex flex-col'>
        <p>Credits : {user?.credits}</p>
        <p className='text-gray-400 text-xs'>Purchase Credits to use more features</p>
      </div>
    </div>

    <div className='flex items-center gap-20 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md '>
      <div className='flex items-center gap-2 text-sm'>
        <img src={assets.theme_icon} alt="" className='w-4 not-dark:invert'/>
        <p>Dark Mode</p>
      </div>
      <label className=' inline-flex  items-center cursor-pointer'>
        <input type="checkbox" className='hidden' checked={theme === "dark"} onChange={() => setTheme(theme === "dark" ? "light" : "dark")} />
        <div className='w-10 h-5 bg-gray-300 rounded-full relative'>
          <div className={`dot absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 ${theme === "dark" ? "translate-x-5" : ""}`}></div>
        </div>
      </label>
    </div>
      <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all group'>
      <img src={assets.user_icon} alt="gallery" className = "w-7 rounded-full"/>
      <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : "Login Your Account"}</p>
      {
        user && <img src={assets.logout_icon} alt="gallery" className = "h-5 hidden group-hover:block not-dark:invert cursor-pointer"/>
      }
    </div>
    <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} alt="" className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' />
  </div>
  );
}

export default SideBar;
