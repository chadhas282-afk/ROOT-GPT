import { createContext, use, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


const AppContext = createContext()

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
        setSelectedChats(dummyChats[0])
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
