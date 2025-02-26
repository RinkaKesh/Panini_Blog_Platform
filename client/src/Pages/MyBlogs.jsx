
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getToken } from '../fun';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { ProfileContext } from '../Context/UserContext';
import './Blogs.css';
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdSearch, MdClose, MdFilterList } from "react-icons/md";
import Loader from '../Components/Loader';
import BlogModal from '../Components/BlogModal';

const MyBlogs = () => {
  const { id } = useParams();
  const { profileData } = useContext(ProfileContext);
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    fetchUserBlogs();
  }, [id]);

  useEffect(() => {
    // Extract all unique tags from blogs
    if (blogs.length > 0) {
      const tags = new Set();
      blogs.forEach(blog => {
        if (Array.isArray(blog.tags)) {
          blog.tags.forEach(tag => tags.add(tag));
        } else if (typeof blog.tags === 'string' && blog.tags.trim()) {
          blog.tags.split(',').forEach(tag => tags.add(tag.trim()));
        }
      });
      setAvailableTags(Array.from(tags));
    }
  }, [blogs]);

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, selectedTags, blogs]);

  const fetchUserBlogs = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/blogs/user/${id}`, {
        headers: { Authorization: getToken() },
      });
      if (response.status === 200) {
        setBlogs(response.data.data);
        setFilteredBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching your blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];
    
    // Filter by search term (title or tags)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => {
        // Check title
        if (blog.title.toLowerCase().includes(term)) return true;
        
        // Check tags
        if (Array.isArray(blog.tags)) {
          if (blog.tags.some(tag => tag.toLowerCase().includes(term))) return true;
        } else if (typeof blog.tags === 'string') {
          if (blog.tags.toLowerCase().includes(term)) return true;
        }
        
        if (blog.content.toLowerCase().includes(term)) return true;
        
        return false;
      });
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog => {
        if (Array.isArray(blog.tags)) {
          return selectedTags.some(tag => blog.tags.includes(tag));
        } else if (typeof blog.tags === 'string') {
          const blogTagsArray = blog.tags.split(',').map(tag => tag.trim());
          return selectedTags.some(tag => blogTagsArray.includes(tag));
        }
        return false;
      });
    }
    
    setFilteredBlogs(filtered);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setDeleteInProgress(true);
      setDeletingBlogId(id);
      const response = await axios.delete(`https://panini-blog.vercel.app/blogs/${id}`, {
        headers: { Authorization: getToken() },
      });
      if (response.status === 200) {
        toast.success("Blog deleted successfully");
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeleteInProgress(false);
      setDeletingBlogId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag); 
      } else {
        return [...prev, tag]; 
      }
    });
  };

 
  const getBlogTags = (blog) => {
    if (Array.isArray(blog.tags)) {
      return blog.tags;
    } else if (typeof blog.tags === 'string') {
      return blog.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    return [];
  };

  return (
    <div className="flex-1 overflow-auto relative">
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 -rotate-90 cursor-pointer">
        <button
          className="bg-[#59B792] text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-[#85a89a] transition duration-300 transform hover:scale-x-110"
          onClick={() => setIsModalOpen(true)}
        >
          <span>Create Blog</span>
        </button>
      </div>

      {isLoading ? (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
          <Loader />
        </div>
      ) : (
        <>
          {/* Search and Filtering Section */}
          <div className="p-4 bg-white shadow-sm sticky top-0 z-20">
            <div className="flex flex-col md:flex-row gap-3 mb-3">
              {/* Search Input */}
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
                  placeholder="Search by title, content, or tags..."
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
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag) 
                        ? 'bg-[#8ec2ad] text-white' 
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
            )}
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-10 text-gray-500">
                {blogs.length === 0 ? (
                  <p>You haven't created any blogs yet.</p>
                ) : (
                  <>
                    <MdFilterList size={48} />
                    <p className="mt-3 text-lg">No blogs match your filters</p>
                    {(searchTerm || selectedTags.length > 0) && (
                      <button
                        className="mt-3 text-amber-500 hover:underline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedTags([]);
                        }}
                      >
                        Clear all filters
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <div key={blog._id} className="relative bg-white p-4 rounded-lg shadow-md border border-amber-100">
                    {deleteInProgress && deletingBlogId === blog._id && (
                        <div className="absolute inset-0 bg-white opacity-60 flex justify-center items-center z-10">
                         <span className="delete_loader">Deleting...</span>
                        </div>
                      )}
                  <h2 className="text-lg font-bold text-[#59B792]">{blog.title}</h2>
                  <p className="mt-2 text-gray-700">{blog.content}</p>
                  
                  {/* Display tags */}
                  {getBlogTags(blog).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getBlogTags(blog).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-md text-sm cursor-pointer ${
                            selectedTags.includes(tag)
                              ? 'bg-[#8ec2ad] text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-4">
                      <CiEdit
                        size={30}
                        className="cursor-pointer text-amber-500 hover:text-amber-700"
                        onClick={() => handleEdit(blog)}
                      />
                      <MdDelete
                        size={30}
                        className={`cursor-pointer ${deletingBlogId === blog._id ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`}
                        onClick={() => !deleteInProgress && handleDelete(blog._id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <BlogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchUserBlogs}
        editingBlog={editingBlog}
      />
    </div>
  );
};

export default MyBlogs;