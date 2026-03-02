import { createContext, use, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


const AppContext = createContext()
const dummyUserData = {
    _id: "user_123",
    name: "Sahil Chadha",
    email: "sahil@example.com",
    credits: 200,
    avatar: "" // Add a URL here if you have one
};

const dummyChats = [
    {
        _id: "chat_1",
        name: "Project Ideas",
        messages: [
            { content: "Let's build a GPT" }
        ],
        updatedAt: new Date().toISOString()
    },
    {
        _id: "chat_2",
        name: "Bug Fixes",
        messages: [
            { content: "The sidebar filter issue is finally resolved." }
        ],
        updatedAt: new Date().toISOString()
    },
    {
        _id: "chat_3",
        name: "Design Inspo",
        messages: [
            { content: "Check out the new dark mode palette." }
        ],
        updatedAt: new Date().toISOString()
    }
];
export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChats, setSelectedChats] = useState(null)
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")

    const fetchUser = async () => {
        setUser(dummyUserData)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUserChats = async () => {
        setChats(dummyChats)
        setSelectedChats()
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
        navigate, user, setUser, chats, setChats, selectedChats, setSelectedChats, theme, setTheme
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
