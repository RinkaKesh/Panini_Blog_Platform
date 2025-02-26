
import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getToken } from '../fun';
import Modal from '../Components/Modal';
import CreatableSelect from 'react-select/creatable';

const defaultTags = [
  { label: "Technology", value: "Technology" },
  { label: "Business", value: "Business" },
  { label: "Health", value: "Health" },
  { label: "Education", value: "Education" },
  { label: "Lifestyle", value: "Lifestyle" }
];

const BlogModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingBlog = null,
  initialBlog = { title: '', content: '', tags: [] }
}) => {
  const [blog, setBlog] = useState(() => {
    const blogData = editingBlog || initialBlog;
    return {
      ...blogData,
      tagOptions: Array.isArray(blogData.tags) 
        ? blogData.tags.map(tag => ({ label: tag, value: tag }))
        : typeof blogData.tags === 'string' 
          ? blogData.tags.split(',').map(tag => ({ label: tag.trim(), value: tag.trim() }))
          : []
    };
  });

  const textareaRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      const blogData = editingBlog || initialBlog;
      const tagOptions = Array.isArray(blogData.tags) 
        ? blogData.tags.map(tag => ({ label: tag, value: tag }))
        : typeof blogData.tags === 'string' 
          ? blogData.tags.split(',').map(tag => ({ label: tag.trim(), value: tag.trim() }))
          : [];
          
      setBlog({
        ...blogData,
        tagOptions
      });
    }
  }, [isOpen, editingBlog?._id]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [blog.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagChange = (newValue) => {
    setBlog(prev => ({ 
      ...prev, 
      tagOptions: newValue || [],
      tags: newValue ? newValue.map(option => option.value) : []
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedBlog = {
        ...blog,
        tags: blog.tagOptions.map(option => option.value)
      };
      
      if (editingBlog) {
        const response = await axios.patch(
          `https://echoversecheenta.vercel.app/blogs/${editingBlog._id}`,
          formattedBlog,
          { headers: { Authorization: getToken() } }
        );
        
        if (response.status === 200) {
          toast.success("Blog updated successfully");
          onSuccess && onSuccess();
          onClose();
        }
      } else {
        const response = await axios.post(
          'https://echoversecheenta.vercel.app/blogs/create',
          formattedBlog,
          { headers: { Authorization: getToken() } }
        );
        
        if (response.status === 201) {
          toast.success("Blog created successfully");
          onSuccess && onSuccess();
          onClose();
        }
      }
    } catch (error) {
      toast.error(editingBlog ? "Error updating blog" : "Error creating blog");
    }
  };

  const selectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      borderColor: '#e2e8f0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#cbd5e0'
      }
    }),
    multiValue: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#EDF2F7', 
    }),
    multiValueLabel: (baseStyles) => ({
      ...baseStyles,
      color: '#4A5568',
    }),
    multiValueRemove: (baseStyles) => ({
      ...baseStyles,
      color: '#718096',
      '&:hover': {
        backgroundColor: '#E2E8F0',
        color: '#4A5568',
      },
    }),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={blog.title || ''}
        onChange={handleChange}
         className="w-full mt-4 p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
      />
      <textarea
        name="content"
        placeholder="Content"
        ref={textareaRef}
        value={blog.content || ''}
        onChange={handleChange}
         className="overflow-y-scroll min-h-[150px] max-h-[150px] w-full mt-4 p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#59B792] focus:border-[#59B792]"
      />
      
      <div className="my-4">
        <label className="block text-sm text-gray-600 mb-1">Tags</label>
        <CreatableSelect
          isMulti
          placeholder="Select or create tags..."
          options={defaultTags}
          value={blog.tagOptions}
          onChange={handleTagChange}
          styles={selectStyles}
          classNamePrefix="select"
          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="mt-6 bg-[#59B792] text-white px-4 py-2 rounded-md hover:bg-[#85a89a]"
      >
        {editingBlog ? 'Update' : 'Create'}
      </button>
    </Modal>
   
  );
};

export default BlogModal;
