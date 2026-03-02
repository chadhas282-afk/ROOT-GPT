import React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from "../assets/assets";

const SideBar = () => {
const { chats, setSelectedChats, theme, setTheme, user } = useAppContext();
  const [search, setSearch] = useState("");
  return (
    <div className = "flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1">
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
  <div key={chat._id} className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 rounded-md flex justify-between cursor-pointer group" onClick={() => setSelectedChats(chat)}>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">
        {chat.messages?.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
      </p>
      <p className="text-[10px] opacity-50 mt-1">
        {chat.updatedAt}
      </p>
    </div>
    <img src={assets.bin_icon} className="hidden group-hover:block w-4 cursor-pointer not-dark:invert" alt="delete" />

  </div>
))}

    </div>
    </div>
  );
}

export default SideBar;
