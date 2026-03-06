import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from "../assets/assets";
import Message from './Message';
import toast from 'react-hot-toast';

const ChatBox = () => {
  const containerRef = useRef(null);
  const { selectedChats, theme, user, axios, token, setUser } = useAppContext();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to continue");
    if (!selectedChats?._id) return toast.error("Please select or create a chat first");

    try {
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");

      setMessages(prev => [...prev, { role: "user", content: promptCopy, timestamp: Date.now(), isImage: false }]);

      const {data} = await axios.post(`/api/message/${mode}`, {
        chatId: selectedChats._id,
        prompt: promptCopy,
        isPublished
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setMessages(prev => [...prev, data.reply]);
        setUser(prev => ({ 
            ...prev, 
            credits: mode === "image" ? prev.credits - 2 : prev.credits - 1 
        }));
      } else {
        toast.error(data.message || "Failed to get response");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChats) {
      setMessages(selectedChats.messages || []);
    }
  }, [selectedChats]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-auto scroll-smooth custom-scrollbar'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2'>
            <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="Logo" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything</p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} Message={message} />
        ))}
        {loading && (
          <div className='loader flex items-center gap-1.5 ml-2 mt-4'>
            <div className='w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-white animate-bounce [animation-delay:-0.3s]'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-white animate-bounce [animation-delay:-0.5s]'></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className='inline-flex items-center gap-2 text-sm mx-auto mb-3 cursor-pointer group'>
          <p className='text-xs text-gray-500 group-hover:text-purple-500 transition-colors'>
            Publish Generated Image to Community
          </p>
          <input type="checkbox" className='accent-purple-600' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}

      <form onSubmit={onSubmit} className='bg-white dark:bg-[#583C79]/30 border border-purple-200 dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-2 pl-4 mx-auto flex gap-4 items-center shadow-lg transition-all focus-within:border-purple-400'>
        <select 
          onChange={(e) => setMode(e.target.value)} 
          value={mode} 
          className='text-sm bg-transparent outline-none cursor-pointer dark:text-white font-medium'
        >
          <option value="text" className="text-black">Text</option>
          <option value="image" className="text-black">Image</option>
        </select>
        
        <input 
          onChange={(e) => setPrompt(e.target.value)} 
          value={prompt} 
          type="text" 
          placeholder='Type your prompt here...' 
          className='flex-1 bg-transparent text-sm outline-none dark:text-white placeholder:text-gray-400' 
          required
        />
        
        <button type="submit" disabled={loading} className='hover:scale-110 active:scale-95 transition-transform disabled:opacity-50'>
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-9' alt="Action" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;