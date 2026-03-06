import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { assets } from "../assets/assets";
import moment from "moment";
import toast from 'react-hot-toast';

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { 
        chats, setSelectedChats, theme, setTheme, 
        user, navigate, createNewChat, axios, 
        setChats, setToken, token 
    } = useAppContext();

    const [search, setSearch] = useState("");

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/");
    };

    const deleteChat = async (e, chatId) => {
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this chat?")) return;

        const loadingToast = toast.loading("Deleting...");
        try {
            const { data } = await axios.post("/api/chat/delete", { chatId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Chat deleted", { id: loadingToast });

                setChats(prev => prev.filter(chat => chat._id !== chatId));
            } else {
                toast.error(data.message || "Failed to delete chat", { id: loadingToast });
            }
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        }
    };

    return (
        <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-50 ${!isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"} md:translate-x-0`}>
            
            <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="Logo" className="w-full max-w-48" />

            <button 
                onClick={createNewChat} 
                className="flex justify-center items-center w-full py-2 mt-10 text-white bg-linear-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            >
                <span className="mr-2 text-xl">+</span> New Chat
            </button>

            <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
                <img src={assets.search_icon} className="w-4 not-dark:invert" alt="search" />
                <input 
                    onChange={(e) => setSearch(e.target.value)} 
                    value={search} 
                    type="text" 
                    placeholder="Search Conversation" 
                    className="text-xs bg-transparent dark:text-white placeholder:text-gray-400 outline-none w-full" 
                />
            </div>

            {chats?.length > 0 && <p className="mt-4 text-sm opacity-60">Recent Chats</p>}

            <div className='flex-1 overflow-y-auto mt-3 text-sm space-y-3 pr-2 custom-scrollbar'>
                {chats?.filter((chat) =>
                    chat.messages[0]?.content?.toLowerCase().includes(search.toLowerCase()) ||
                    chat.name?.toLowerCase().includes(search.toLowerCase())
                ).map((chat) => (
                    <div 
                        onClick={() => { navigate("/"); setSelectedChats(chat); setIsMenuOpen(false) }}
                        key={chat._id} 
                        className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-white/10 rounded-md flex justify-between items-center cursor-pointer group hover:border-[#80609F] transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate dark:text-white">
                                {chat.messages?.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                            </p>
                            <p className="text-[10px] opacity-50 mt-1 dark:text-gray-400">
                                {moment(chat.updatedAt).fromNow()}
                            </p>
                        </div>
                        <img 
                            onClick={(e) => deleteChat(e, chat._id)} 
                            src={assets.bin_icon} 
                            className="hidden group-hover:block w-4 cursor-pointer not-dark:invert opacity-60 hover:opacity-100 transition-opacity" 
                            alt="delete" 
                        />
                    </div>
                ))}
            </div>

            <div className="mt-auto space-y-2">
                <div onClick={() => { navigate("/community"); setIsMenuOpen(false) }}
                    className='flex items-center gap-2 p-3 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition-all bg-white/5'>
                    <img src={assets.gallery_icon} alt="gallery" className="w-4.5 not-dark:invert" />
                    <p className="text-xs dark:text-white">Community Images</p>
                </div>

                <div onClick={() => { navigate("/Credits"); setIsMenuOpen(false) }}
                    className='flex items-center gap-2 p-3 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition-all bg-white/5'>
                    <img src={assets.diamond_icon} alt="credits" className="w-4.5 dark:invert" />
                    <div className='text-xs'>
                        <p className="dark:text-white font-medium">Credits : {user?.credits}</p>
                        <p className='text-gray-400 text-[10px]'>Purchase more features</p>
                    </div>
                </div>

                <div className='flex items-center justify-between p-3 border border-gray-300 dark:border-white/15 rounded-md'>
                    <div className='flex items-center gap-2 text-sm'>
                        <img src={assets.theme_icon} alt="theme" className='w-4 not-dark:invert' />
                        <p className="text-xs dark:text-white">Dark Mode</p>
                    </div>
                    <label className='relative inline-flex cursor-pointer'>
                        <input 
                            type="checkbox" 
                            className='sr-only peer' 
                            checked={theme === "dark"} 
                            onChange={() => setTheme(theme === "dark" ? "light" : "dark")} 
                        />
                        <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-[#A456F7] transition-all duration-300"></div>
                        <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4"></span>
                    </label>
                </div>

                <div className='flex items-center gap-3 p-3 border border-gray-300 dark:border-white/15 rounded-md group relative'>
                    <img src={assets.user_icon} alt="user" className="w-7 h-7 rounded-full border border-[#80609F]/50" />
                    <p className='flex-1 text-sm dark:text-white truncate'>{user ? user.name : "Guest"}</p>
                    {user && (
                        <img 
                            onClick={logout} 
                            src={assets.logout_icon} 
                            alt="logout" 
                            className="h-4 w-4 opacity-0 group-hover:opacity-100 cursor-pointer not-dark:invert transition-opacity" 
                        />
                    )}
                </div>
            </div>

            <img 
                onClick={() => setIsMenuOpen(false)} 
                src={assets.close_icon} 
                alt="close" 
                className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' 
            />
        </div>
    );
}

export default SideBar;