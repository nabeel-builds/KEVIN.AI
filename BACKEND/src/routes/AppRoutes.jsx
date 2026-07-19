import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../screens/Home'
import LoginPage from '../screens/Login'
import Register from '../screens/Register'
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'
import KevinLandingPage from '../screens/KevinLandingPage'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<KevinLandingPage/>} />
                <Route path='/home' element={<UserAuth><Home /></UserAuth>} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/project' element={<UserAuth><Project /></UserAuth>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes