import { createContext, useContext, useState } from "react";

// Create the UserContext
export const UserContext = createContext()

// Create a provider component
export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )

}

