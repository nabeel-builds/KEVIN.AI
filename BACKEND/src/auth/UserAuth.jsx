import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserAuth = ({ children }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [])

    if (!token) {
        return null
    }

    return <>{children}</>
}

export default UserAuth