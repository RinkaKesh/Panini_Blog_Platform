
import React from 'react'
import './Loader.css'
import { ImageConfig } from '../assets/ImageConfig'
const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50">
    <img
      src={ImageConfig.homepage.panini_logo} 
      alt="Loading"
      className="w-[100px] h-[100px] animate-bounce-heartbeat absolute"
     
    />
   
  </div>
  )
}

export default Loader



  