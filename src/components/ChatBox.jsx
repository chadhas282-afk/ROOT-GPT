import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext'
import { assets } from "../assets/assets";
import Message from './Message';

const ChatBox = () => {

  const { selectedChats, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    if (selectedChats) {
    setMessages(selectedChats.messages);
  }
}, [selectedChats]);

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      
    <div className='flex-1 mb-5 overflow-y-scroll'>
      {
        messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything</p>
          </div>
        )}
        {
          messages.map((message, index) => (
            <Message key={index} Message={message} />
          ))
        }
        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
    </div>

    <form>
        <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
          <option className='dark:bg-purple-900' value="text">Text</option>
          <option className='dark:bg-purple-900' value="image">Image</option>
        </select>
    </form>

    </div>
  );
}

export default ChatBox;
