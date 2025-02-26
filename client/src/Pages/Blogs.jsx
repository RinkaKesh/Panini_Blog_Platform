// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { getStatusColors, getToken, isAuth } from "../fun";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { CiEdit } from "react-icons/ci";
// import { MdDelete } from "react-icons/md";
// import Modal from "../Components/Modal";
// import { MdFilterList, MdClose } from "react-icons/md";
// import Select from "react-select";
// import Header from "../Components/Header";
// import { Check } from "lucide-react";
// import './Blogs.css'
// import styled from "styled-components";
// import MyBlogs from "./MyBlogs";
// import Loader from "../Components/Loader";

// import BlogModal from '../Components/BlogModal';  

// const Blogs = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState([]);
//   const [newComments, setNewComments] = useState({});
//   const [visibleComments, setVisibleComments] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("https://panini-blog.vercel.app/blogs");
//       setBlogs(response.data.data);
//     } catch (error) {
//       toast.error("Error fetching blogs");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLike = async (id) => {
//     try {
//       await axios.post(`http://localhost:8000/blogs/${id}/like`);
//       fetchBlogs();
//     } catch (error) {
//       toast.error("Error liking post");
//     }
//   };

//   const handleComment = async (id) => {
//     if (!newComments[id]?.trim()) return; // Prevent empty comments
//     try {
//       await axios.post(`http://localhost:8000/blogs/${id}/comment`, {
//         content: newComments[id],
//       });
//       setNewComments((prev) => ({ ...prev, [id]: "" })); // Clear input for that blog
//       fetchBlogs();
//     } catch (error) {
//       toast.error("Error adding comment");
//     }
//   };

//   const handleShowMoreComments = (id) => {
//     setVisibleComments((prev) => ({
//       ...prev,
//       [id]: (prev[id] || 5) + 5, // Increase visible count by 5
//     }));
//   };

//   return (
//     <div className="relative w-full h-screen">
//       {isLoading && (
//         <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
//           <Loader />
//         </div>
//       )}

//       {!isLoading && (
//         <div className="pt-[80px] flex flex-col relative h-full md:pt-0">
//           <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 -rotate-90 cursor-pointer">
//             <button
//               className="bg-[#59B792] text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-[#85a89a] transition duration-300 transform hover:scale-x-110"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <span>Create Blog</span>
//             </button>
//           </div>
//           <Header header_text={"All Blogs"} />

//           <div className="h-full overflow-y-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {blogs.map((blog) => (
//               <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                 <h2 className="text-lg font-bold">{blog.title}</h2>
//                 <p className="mt-2 text-gray-700">{blog.content}</p>

//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {blog.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="bg-gray-200 px-2 py-1 rounded-md text-sm"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>

//                 <p className="mt-2 text-sm text-gray-600">Creator: {blog?.author?.name}</p>

//                 <div className="mt-4">
//                   <button
//                     onClick={() => handleLike(blog._id)}
//                     className="text-blue-500 hover:text-blue-700 transition-colors"
//                   >
//                     ❤️ {blog.likes.length}
//                   </button>
//                 </div>

//                 <div className="mt-4">
//                   <input
//                     type="text"
//                     className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
//                     placeholder="Add a comment..."
//                     value={newComments[blog._id] || ""}
//                     onChange={(e) =>
//                       setNewComments((prev) => ({ ...prev, [blog._id]: e.target.value }))
//                     }
//                   />
//                   <button
//                     onClick={() => handleComment(blog._id)}
//                     className="mt-2 bg-[#59B792] text-white px-4 py-2 rounded-md hover:bg-[#91c9b2] transition-colors"
//                     disabled={!newComments[blog._id]?.trim()}
//                   >
//                     Comment
//                   </button>
//                 </div>

//                 {/* Show Comments Section */}
//                 {blog.comments.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-medium text-gray-800 mb-2">Comments</h3>
//                     {blog.comments.slice(0, visibleComments[blog._id] || 1).map((comment, index) => (
//                       <div key={index} className="border-b py-2 last:border-b-0">
//                         <p className="text-sm text-gray-600">{comment.content}</p>
//                       </div>
//                     ))}

//                     {blog.comments.length > (visibleComments[blog._id] || 1) && (
//                       <button
//                         onClick={() => handleShowMoreComments(blog._id)}
//                         className="text-blue-500 mt-2 text-sm hover:text-blue-700 transition-colors"
//                       >
//                         Show More Comments
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Use the shared BlogModal component */}
//       <BlogModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={fetchBlogs}
//       />
//     </div>
//   );
// };

// export default Blogs;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { getStatusColors, getToken, isAuth } from "../fun";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../Components/Modal";
import { MdFilterList, MdClose, MdSearch } from "react-icons/md";
import Select from "react-select";
import Header from "../Components/Header";
import { Check } from "lucide-react";
import './Blogs.css'
import styled from "styled-components";
import MyBlogs from "./MyBlogs";
import Loader from "../Components/Loader";

import BlogModal from '../Components/BlogModal';  

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Extract all unique tags from blogs
    if (blogs.length > 0) {
      const tags = new Set();
      blogs.forEach(blog => {
        if (Array.isArray(blog.tags)) {
          blog.tags.forEach(tag => tags.add(tag));
        }
      });
      setAvailableTags(Array.from(tags));
    }
  }, [blogs]);

  useEffect(() => {
    // Apply filters whenever search term or selected tags change
    filterBlogs();
  }, [searchTerm, selectedTags, blogs]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://panini-blog.vercel.app/blogs");
      setBlogs(response.data.data);
      setFilteredBlogs(response.data.data); // Initialize filtered blogs with all blogs
    } catch (error) {
      toast.error("Error fetching blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];
    
    // Filter by search term (author, title, or tags)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(term) || 
        (blog?.author?.name && blog.author.name.toLowerCase().includes(term)) ||
        (Array.isArray(blog.tags) && blog.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog => 
        Array.isArray(blog.tags) && 
        selectedTags.some(tag => blog.tags.includes(tag))
      );
    }
    
    setFilteredBlogs(filtered);
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`https://panini-blog.vercel.app/blogs/${id}/like`);
      fetchBlogs();
    } catch (error) {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (id) => {
    if (!newComments[id]?.trim()) return; // Prevent empty comments
    try {
      await axios.post(`https://panini-blog.vercel.app/blogs/${id}/comment`, {
        content: newComments[id],
      });
      setNewComments((prev) => ({ ...prev, [id]: "" })); // Clear input for that blog
      fetchBlogs();
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  const handleShowMoreComments = (id) => {
    setVisibleComments((prev) => ({
      ...prev,
      [id]: (prev[id] || 5) + 5, // Increase visible count by 5
    }));
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag); // Deselect if already selected
      } else {
        return [...prev, tag]; // Select if not already selected
      }
    });
  };

  return (
    <div className="relative w-full h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {!isLoading && (
        <div className="pt-[80px] flex flex-col relative h-full md:pt-0">
          <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 -rotate-90 cursor-pointer">
            <button
              className="bg-[#59B792] text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-[#85a89a] transition duration-300 transform hover:scale-x-110"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Create Blog</span>
            </button>
          </div>
          <Header header_text={"All Blogs"} />
          
          {/* Search and Filtering Section */}
          <div className="px-4 py-3 bg-white shadow-sm sticky top-0 z-20">
            <div className="flex flex-col md:flex-row gap-3 mb-3">
              {/* Search Input */}
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                  placeholder="Search by title, author, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <MdClose />
                  </button>
                )}
              </div>
            </div>
            
            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 pb-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag) 
                      ? 'bg-[#59B792] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <span className="ml-1">✓</span>}
                </button>
              ))}
              
              {selectedTags.length > 0 && (
                <button
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  onClick={() => setSelectedTags([])}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Blogs Grid */}
          <div className="h-full overflow-y-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
                <MdFilterList size={48} />
                <p className="mt-3 text-lg">No blogs match your filters</p>
                {(searchTerm || selectedTags.length > 0) && (
                  <button
                    className="mt-3 text-[#59B792] hover:underline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTags([]);
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-bold">{blog.title}</h2>
                  <p className="mt-2 text-gray-700">{blog.content}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-md text-sm cursor-pointer ${
                          selectedTags.includes(tag)
                            ? 'bg-[#59B792] text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-sm text-gray-600">Creator: {blog?.author?.name}</p>

                  <div className="mt-4">
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      ❤️ {blog.likes.length}
                    </button>
                  </div>

                  <div className="mt-4">
                    <input
                      type="text"
                      className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      placeholder="Add a comment..."
                      value={newComments[blog._id] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => ({ ...prev, [blog._id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => handleComment(blog._id)}
                      className="mt-2 bg-[#59B792] text-white px-4 py-2 rounded-md hover:bg-[#91c9b2] transition-colors"
                      disabled={!newComments[blog._id]?.trim()}
                    >
                      Comment
                    </button>
                  </div>

                  {/* Show Comments Section */}
                  {blog.comments.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-800 mb-2">Comments</h3>
                      {blog.comments.slice(0, visibleComments[blog._id] || 1).map((comment, index) => (
                        <div key={index} className="border-b py-2 last:border-b-0">
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      ))}

                      {blog.comments.length > (visibleComments[blog._id] || 1) && (
                        <button
                          onClick={() => handleShowMoreComments(blog._id)}
                          className="text-blue-500 mt-2 text-sm hover:text-blue-700 transition-colors"
                        >
                          Show More Comments
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Use the shared BlogModal component */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBlogs}
      />
    </div>
  );
};

export default Blogs;