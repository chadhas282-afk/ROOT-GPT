import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/appContext';
import assets from '../assets';

const ChatBox = () => {

  const {selectedChat, theme} = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      
    <div className='flex-1 mb-5 overflow-y-scroll'>
      {
        messages.length === 0 && (
          <div>
            <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p></p>
          </div>
        )
      }
    </div>

    <form>

    </form>

    </div>
  );
}

export default ChatBox;
