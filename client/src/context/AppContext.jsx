import { createContext, use, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { dummyUserData, dummyChats } from "../assets/assets";
import axios from "axios"
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

const AppContext = createContext()


export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChats, setSelectedChats] = useState(null)
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const [loadingUser, setLoadingUser] = useState(true)

   const fetchUser = async () => {
    try {
        // Corrected the header format
        const { data } = await axios.get("/api/user/data", {
            headers: { Authorization: `Bearer ${token}` } 
        });

        if (data.success) {
            setUser(data.user);
        } else {
            // If token is invalid, clear it
            setToken(null);
            localStorage.removeItem("token");
        }
    } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
            setToken(null);
            localStorage.removeItem("token");
        }
    } finally {
        setLoadingUser(false);
    }
}

    const createNewChat = async () => {
        try {
        if(!user) return toast("Login to create a chat");
        
        const { data } = await axios.post("/api/chat/create", {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if(data.success) {
            await fetchUserChats();
            navigate("/");
        }
    } catch (error) {
        toast.error(error.message);
    }
    }

    useEffect(() => {
        if(token) {
            fetchUser()
        }else{
            setUser(null)
            setLoadingUser(false)
        }
    }, [token])

    const fetchUserChats = async () => {
        try {
            const {data} = await axios.get("/api/chat/userchats", {headers:{Authorization: token}});
            if(data.success){
                setChats(data.chats);
                if(data.chats.length === 0) {
                    await createNewChat();
                    return fetchUserChats();
                }else{
                    setSelectedChats(data.chats[0]);
                }
            }else{
                toast.error(data.message || "Failed to fetch user chats");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if(theme === "dark"){
            document.documentElement.classList.add("dark")
        }else{
            document.documentElement.classList.remove("dark")
        }
    }, [theme])

    useEffect(() => {
        if(user){
            fetchUserChats()
        }
        else{
            setChats([])
            setSelectedChats(null)
        }
    }, [user])

    const value = {
        navigate, user, setUser, chats, setChats, selectedChats, setSelectedChats, theme, setTheme, loadingUser, createNewChat, fetchUserChats, token, setToken, axios
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
