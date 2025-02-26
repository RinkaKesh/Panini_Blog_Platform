import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../fun'
import { toast } from 'react-toastify'
import { ProfileContext } from '../Context/UserContext'
import Header from '../Components/Header'
import MyBlogs from './MyBlogs'
import './Blogs.css'
import { IoCloudUploadOutline } from "react-icons/io5";
import Loader from '../Components/Loader'

const Profile = () => {
    const { id } = useParams()
    const { profileData, setProfileData } = useContext(ProfileContext)
    const [isloading, setIsloading] = useState(false)
    const [activeTab, setActiveTab] = useState('myBlogs')

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        bio: ""
    })
   

    useEffect(() => {
        if (!id && profileData?._id) {
            navigate(`/profile/${profileData._id}`);
        }
        else if (!id && !profileData?._id) {
            navigate('/login');
        }
    }, [id, profileData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const getProfileData = async () => {
        if (!id) return;

        try {
            setIsloading(true);
            const response = await axios.get(`https://panini-blog.vercel.app/user/${id}`, {
                headers: { Authorization: getToken() }
            });

            if (response.status === 200) {
                const userData = response.data.data;
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    image: userData.image || "",
                    bio: userData.bio || ""
                });
                setProfileData({
                    ...userData,
                    _id: id
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch profile data");
            if (profileData) {
                setFormData({
                    name: profileData.name || "",
                    email: profileData.email || "",
                    image: profileData.image || "",
                    bio: profileData.bio || ""
                });
            }
        } finally {
            setIsloading(false);
        }
    };

    useEffect(() => {
        getProfileData()
    }, [id])


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: URL.createObjectURL(file) });
        }
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setFormData({ ...formData, image: file });
    //     }
    // };
    // const handlesubmit = async (e) => {
    //     e.preventDefault();
    //     if (!id) return;
    //     const url = `https://panini-blog.vercel.app/user/edit/${id}`;
    //     try {
    //         setIsloading(true);
    //         const response = await axios.patch(url, formData, {
    //             headers: {
    //                 Authorization: getToken(),
    //             },
    //         });

    //         if (response.status === 200) {
    //             toast.success(response.data.message);


    //             const updatedProfileData = {
    //                 ...profileData,
    //                 name: formData.name,
    //                 email: formData.email,
    //                 image: formData.image,
    //                 bio: formData.bio
    //             };

    //             // Update both context and localStorage
    //             setProfileData(updatedProfileData);
    //             localStorage.setItem("userdata", JSON.stringify(updatedProfileData));
    //         } else {
    //             toast.info(response.data.message);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to update profile");
    //     } finally {
    //         setIsloading(false);
    //     }
    // };
    const handlesubmit = async (e) => {
        e.preventDefault();
        if (!id) return;
        
        const url = `https://panini-blog.vercel.app/user/edit/${id}`;
        
        try {
            setIsloading(true);
            
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("bio", formData.bio);
            
            if (formData.image instanceof File) {
                formDataToSend.append("image", formData.image);
            }
    
            const response = await axios.patch(url, formDataToSend, {
                headers: {
                    Authorization: getToken(),
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                toast.success(response.data.message);
    
                const updatedProfileData = {
                    ...profileData,
                    name: formData.name,
                    email: formData.email,
                    image: response.data.data.image, 
                    bio: formData.bio
                };
    
                setProfileData(updatedProfileData);
                localStorage.setItem("userdata", JSON.stringify(updatedProfileData));
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsloading(false);
        }
    };
    



    console.log(profileData);
    return (
        <div className='mt-[82px] h-[calc(100vh-82px)] flex flex-col relative md:mt-0 md:h-screen'>
            {/* Tab Navigation */}
            <div className='w-full h-[88px] gap-2 bg-gray-50 text-gray-500 text-2xl flex justify-around items-center p-4'>
                <div
                    className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${activeTab === 'myBlogs' ? 'bg-[#59B792] text-white' : 'hover:bg-[#dfece7]'}`}
                    onClick={() => setActiveTab('myBlogs')}
                >
                    My Blogs
                </div>
                <div
                    className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${activeTab === 'editProfile' ? 'bg-[#59B792] text-white' : 'hover:bg-[#dfece7]'}`}
                    onClick={() => setActiveTab('editProfile')}
                >
                    Edit Profile
                </div>
            </div>

            {isloading && (
                <div className="fixed inset-0 bg-white opacity-30 flex justify-center items-center z-50">
                    <Loader />
                </div>
            )}

            {/* Tab Content */}
            {!isloading && activeTab === 'myBlogs' && (
                <MyBlogs />
            )}

            {!isloading && activeTab === 'editProfile' && (
                <div className="flex items-center justify-center flex-1">
                    <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg border border-amber-100">
                        <p className="text-xl font-bold text-[#59B792] mb-6"><span className='text-gray-600 text-2xl'>Hi,</span> {formData.name}</p>
                        <form action="" onSubmit={handlesubmit} className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <label htmlFor="imageUpload" className="relative cursor-pointer">
                                    <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                                        {formData.image !== "" ? (
                                            <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <IoCloudUploadOutline className='text-6xl text-[#59B792]' />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        name="image"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full mt-1 p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your Email"
                                    className="w-full mt-1 p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                                />

                            </div>
                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bio
                                </label>
                                <div className="relative">
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        placeholder="Your Bio"
                                        maxLength={120}
                                        className="overflow-y-scroll min-h-[100px] max-h-[100px] w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                                    />
                                    <p className="text-right text-sm text-gray-500 mt-1">
                                        {formData.bio.length}/120
                                    </p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-[#59B792] text-white font-semibold rounded-md shadow hover:bg-[#87ac9e] transition duration-300"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
