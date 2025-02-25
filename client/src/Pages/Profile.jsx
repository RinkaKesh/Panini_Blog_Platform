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

const Profile = () => {
    const { id } = useParams()
    const { profileData, setProfileData } = useContext(ProfileContext)
    const [isloading, setIsloading] = useState(false)
    const [activeTab, setActiveTab] = useState('myBlogs')

    const navigate = useNavigate()
       const [formData, setFormData] = useState({
        name: "", email: "", image: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const getProfileData = async () => {
        if (!id) return;

        try {
            setIsloading(true);
            const response = await axios.get(`http://localhost:8000/user/${id}`, {
                headers: { Authorization: getToken() }
            });

            if (response.status === 200) {
                const { name, email, image } = response.data.data;
                setFormData({ name, email, image });
                setProfileData({ name, email, image });
            }
        } catch (error) {
            console.error(error);
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

    // const handlesubmit = async (e) => {
    //     if (!id) { return }
    //     e.preventDefault()
    //     const url = `http://localhost:8000/user/edit/${id}`
    //     try {
    //         setIsloading(true)
    //         const response = await axios({
    //             method: "PATCH",
    //             data: formData,
    //             url: url,
    //             headers: {
    //                 Authorization: getToken()
    //             }
    //         })
    //         if (response.status == 201) {
    //             toast.success(response.data.message);
    //             const { name, email } = formData;
    //             const updatedProfileData = { ...profileData, name, email };

    //             setProfileData(updatedProfileData);
    //             localStorage.setItem("userdata", JSON.stringify(updatedProfileData));
    //         }
    //         else {
    //             toast.info(response.data.message)
    //         }
    //     } catch (error) {

    //         console.log(error);

    //     }
    //     finally {
    //         setIsloading(false)
    //     }
    // }
    useEffect(() => {
        console.log(profileData); // Log whenever profileData is updated
      }, [profileData]);
      const handlesubmit = async (e) => {
        e.preventDefault();
        if (!id) return;
        const url = `https://panini-blog.vercel.app/user/edit/${id}`;
        try {
            setIsloading(true);
            const response = await axios.patch(url, formData, {
                headers: {
                    Authorization: getToken(),
                },
            });
    
            if (response.status === 201) {
                toast.success(response.data.message);
    
                const { name, email, image } = formData;
                const updatedProfileData = { ...profileData, name, email, image };
    
                // Update context and localStorage
                setProfileData(updatedProfileData); // Ensure this is updating context state
                localStorage.setItem('userdata', JSON.stringify(updatedProfileData)); // Update localStorage
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            console.error(error);
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
                    <span className="loader"></span>
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
                                     {formData.image!=="" ? (
                                         <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                     ) : (
                                        <IoCloudUploadOutline className='text-6xl text-[#59B792]'/>
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

