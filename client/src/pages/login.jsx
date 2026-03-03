import React from 'react';
import { useState } from 'react';

const Login = () => {
    const [state, setState] = useState("login")
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form Submitted", formData)
    }

    return (
        <div className="flex items-center justify-center min-h-screen overflow-hidden relative">
            
            {/* Soft Backdrop Blurs - Matches your Sidebar/App style */}
            <div className='fixed inset-0 -z-0 pointer-events-none'>
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#80609F]/20 rounded-full blur-[120px]' />
                <div className='absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-indigo-900/30 rounded-full blur-[100px]' />
            </div>

            <form
                onSubmit={handleSubmit}
                // Updated to use your #80609F border and backdrop-blur
                className="relative z-10 w-full sm:w-[400px] text-center bg-[#242124]/40 border border-[#80609F]/30 backdrop-blur-3xl rounded-3xl px-10 py-12 shadow-2xl"
            >
                <h1 className="text-white text-3xl font-semibold tracking-tight">
                    {state === "login" ? "Welcome Back" : "Create Account"}
                </h1>

                <p className="text-[#B1A6C0] text-sm mt-3 mb-8">
                    {state === "login" ? "Please sign in to continue" : "Join the RootGPT community"}
                </p>

                {state !== "login" && (
                    <div className="flex items-center mt-4 w-full bg-white/5 border border-[#80609F]/20 focus-within:border-indigo-500/60 h-12 rounded-xl overflow-hidden pl-5 gap-3 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#B1A6C0]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /> </svg>
                        <input type="text" name="name" placeholder="Full Name" className="w-full bg-transparent text-white placeholder-white/30 border-none outline-none text-sm" value={formData.name} onChange={handleChange} required />
                    </div>
                )}

                <div className="flex items-center w-full mt-4 bg-white/5 border border-[#80609F]/20 focus-within:border-indigo-500/60 h-12 rounded-xl overflow-hidden pl-5 gap-3 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#B1A6C0]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
                    <input type="email" name="email" placeholder="Email Address" className="w-full bg-transparent text-white placeholder-white/30 border-none outline-none text-sm" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="flex items-center mt-4 w-full bg-white/5 border border-[#80609F]/20 focus-within:border-indigo-500/60 h-12 rounded-xl overflow-hidden pl-5 gap-3 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#B1A6C0]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
                    <input type="password" name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-white/30 border-none outline-none text-sm" value={formData.password} onChange={handleChange} required />
                </div>

                {state === "login" && (
                    <div className="mt-3 text-right">
                        <button className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                            Forgot password?
                        </button>
                    </div>
                )}

                <button type="submit" className="mt-8 w-full h-12 rounded-xl text-white font-medium bg-gradient-to-r from-[#A456F7] to-[#3D81F6] hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
                    {state === "login" ? "Login" : "Create Account"}
                </button>

                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-[#B1A6C0] text-sm mt-6 cursor-pointer" >
                    {state === "login" ? "Don't have an account?" : "Already have an account?"}
                    <span className="text-indigo-400 font-medium hover:underline ml-1">Click here</span>
                </p>
            </form>
        </div>
    )
}

export default Login;
