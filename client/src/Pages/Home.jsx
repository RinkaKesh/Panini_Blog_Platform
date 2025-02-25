
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageConfig } from "../assets/ImageConfig";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <motion.div 
        className="max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-gray-500 md:text-5xl"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Welcome to <span className="text-[#59B792]">Echoverse</span>
        </motion.h1>

        <motion.p 
          className="text-gray-600 text-lg mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
         Blogging made effortless, storytelling made powerful.
        </motion.p>
        {/* <motion.img
          src={ImageConfig.homepage.logo}
          alt="Note Taking"
          className="w-20 mx-auto mt-6"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        /> */}
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
          <Link to="/login">
            <button className="mt-6 bg-[#59B792] text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-[#8db0a2] transition transform hover:scale-[1.02]">
              Create Your First Blog
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
