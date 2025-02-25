import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../Components/Header'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
const Register = () => {
    const navigate = useNavigate()
    const [showPassword,setShowPassword]=useState(false)
    const initialState = {
        name: "", email: "", password: ""
    }
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handlesubmit = async (e) => {
        e.preventDefault()
            const missingField = Object.keys(formData).find((key) => formData[key].trim() == "");
              if (missingField) {
                return toast.error(
                  `${missingField.charAt(0).toUpperCase() + missingField.slice(1)} is required.`
                );
              }
        try {
            const response = await axios({
                method: "POST",
                data: formData,
                url: "http://localhost:8000/user/register"
            })
            if (response.status == 201) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
            else if (response.status >= 400 && response.status < 500) {
                toast.info(response.data.message)
            }


        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }

        }
    }
    return (
        <div className="mt-[82px] h-[calc(100vh-82px)] flex flex-col relative md:mt-0 md:h-screen">
            <Header header_text={"Registration"} />
            <div className='w-full flex flex-1 items-center justify-center -mt-[200px]'>
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg  border border-amber-100">
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#59B792] to-[#2d9470] bg-clip-text text-transparent mb-6 text-center">Create Your Account</p>
                    <p className='my-4 mb-4 text-center text-base text-[#4B5563]'>Register and start blogging</p>
                    <form action="" onSubmit={handlesubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm  text-[#616051]"
                            >
                                Fullname *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm  text-[#616051]"
                            >
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm text-[#616051]"
                            >
                                Password *
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full p-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                                />
                                <button
                                    type="button"
                                    onClick={()=>setShowPassword(!showPassword)}
                                    className="text-2xl absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#59B792] focus:outline-none"
                                >
                                    {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                            </div>
                        </div>


                <button type="submit" className='cursor-pointer inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 hover:bg-black h-10 px-4 py-2 w-full rounded-full bg-[#59B792] text-white text-base font-semibold'>
                    Register
                </button>
            </form>
            <p className='mt-4 text-[#59B792]'>Existing User? <Link to="/login">Go to Login Page!</Link></p>
        </div>
            </div >
        </div >
    )
}

export default Register
