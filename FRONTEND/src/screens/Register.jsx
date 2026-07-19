import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../config/axios.js"
import { UserContext } from "../context/user.context.jsx"


const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState('')

  const { setUser } = useContext(UserContext)


  const navigate = useNavigate()


  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, { username, email, password })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err) {
      console.log(err.response.data)
      console.log(data)
    }


  }

  return (
    <div className="relative min-h-screen bg-[#111111] flex items-center justify-center overflow-hidden font-[Inter,sans-serif]">

      {/* Radial glow top-right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#ffffff08] blur-3xl pointer-events-none" />
      {/* Radial glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#ffffff05] blur-3xl pointer-events-none" />

    

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition cursor-pointer"
      >
        ‹ Back
      </button>

      {/* Card */}
      <div className="w-full max-w-sm px-5 py-10 flex flex-col items-center">

        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-[#222222] border border-white/10 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="14" y1="4"
                x2="14" y2="8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={0.3 + (i / 12) * 0.7}
                transform={`rotate(${i * 30} 14 14)`}
              />
            ))}
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center tracking-tight">
          Create your account
        </h1>


        {/* Form */}
        <form onSubmit={submitHandler} className="w-full flex flex-col gap-3 mt-10">


          {/* Username */}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl text-white text-sm px-4 py-3.5 outline-none placeholder:text-white/30 focus:border-white/25 transition"
            />
          </div>
          {/* Email */}
          <div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl text-white text-sm px-4 py-3.5 outline-none placeholder:text-white/30 focus:border-white/25 transition"
            />
            
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl text-white text-sm px-4 py-3.5 outline-none placeholder:text-white/30 focus:border-white/25 transition"
            />
           
            <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              {
                showPassword?<i className="ri-eye-off-fill"></i>
                :<i className="ri-eye-fill"></i>
              }
              
            </button>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full bg-white hover:bg-white/90 hover:text-black active:scale-[0.98] text-black font-normal cursor-pointer text-sm py-3.5 rounded-xl transition-all duration-150 mt-1"
          >
            Sign up for free
          </button>


        </form>
        <p className="text-sm text-white/40 mb-8 mt-8 text-center">
          Already have one?{" "}
          <Link to="/login" className="text-white/70 font-semibold hover:text-white transition">
            Sign in
          </Link>
        </p>






      </div>
    </div>
  )
}

export default Register