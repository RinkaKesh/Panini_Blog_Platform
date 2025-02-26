import React, { createContext, useState, useEffect } from 'react'
import { getUserData, getToken, isAuth } from '../fun'

export const ProfileContext = createContext()

const UserContext = ({ children }) => {
  const [profileData, setProfileData] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
   
    const handleStorageChange = () => {
      const storedAuth = isAuth()
      setIsLoggedIn(storedAuth)
      if (!storedAuth) {
        setProfileData(null)
      } else {
        const storedUserData = getUserData()
        setProfileData(storedUserData)
      }
    }
    
    // Initial check
    handleStorageChange()
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <ProfileContext.Provider value={{ 
      profileData, 
      setProfileData,
      isLoggedIn,
      setIsLoggedIn 
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export default UserContext
