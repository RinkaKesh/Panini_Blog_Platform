// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { getToken } from '../fun';
// import { toast } from 'react-toastify';
// import { useParams } from 'react-router-dom';
// import { ProfileContext } from '../Context/UserContext';
// import './Notes.css';
// import Modal from '../Components/Modal';
// import { CiEdit } from "react-icons/ci";
// import { MdDelete } from "react-icons/md";
// const MyBlogs = () => {
//   const { id } = useParams();
//   const { profileData } = useContext(ProfileContext);
//   const [isLoading, setIsLoading] = useState(false);
//   const [blogs, setBlogs] = useState([]);
//   const [newComments, setNewComments] = useState({});
//   const [visibleComments, setVisibleComments] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newBlog, setNewBlog] = useState({ title: '', content: '', tags: '' });
//   const [deleteInProgress, setDeleteInProgress] = useState(false);
//   const [deletingBlogId, setDeletingBlogId] = useState(null);

//   useEffect(() => {
//     fetchUserBlogs();
//   }, [id]);

//   const fetchUserBlogs = async () => {
//     if (!id) return;
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`http://localhost:8000/blogs/user/${id}`, {
//         headers: { Authorization: getToken() },
//       });
//       if (response.status === 200) {
//         setBlogs(response.data.data);
//       }
//     } catch (error) {
//       toast.error("Error fetching your blogs");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateBlog = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/blogs/create',
//         { ...newBlog, tags: newBlog.tags.split(',').map(tag => tag.trim()) },
//         { headers: { Authorization: getToken() } }
//       );
//       if (response.status === 201) {
//         toast.success("Blog created successfully");
//         setIsModalOpen(false);
//         fetchUserBlogs();
//       }
//     } catch (error) {
//       toast.error("Error creating blog");
//     }
//   };
//   const handleDelete = async (id) => {
//     try {
//       setDeleteInProgress(true);
//       setDeletingBlogId(id);

//       const response = await axios({
//         method: "DELETE",
//         url: `http://localhost:8000/blogs/${id}`,
//         headers: { Authorization: getToken() },
//       });

//       if (response.status === 200) {
//         toast.success("Blog deleted successfully");
//         // Update the filtered notes immediately to remove the deleted note
//         // setFilteredNotes(prevNotes => prevNotes.filter(note => note._id !== id));
//         setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
//       } else {
//         toast.info(response.data.message);
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setDeleteInProgress(false);
//       setDeletingBlogId(null);
//     }
//   };
//   return (
//     <div className="flex-1 overflow-auto relative">
//       {/* <button onClick={() => setIsModalOpen(true)} className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-amber-400 transition duration-300 transform hover:scale-x-110">
//         Create Blog
//       </button> */}
//       <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 -rotate-90 cursor-pointer">
//         <button
//           className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-amber-400 transition duration-300 transform hover:scale-x-110"
//           onClick={() => setIsModalOpen(true)}
//         >

//           <span>Create Blog</span>
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="fixed inset-0 bg-white opacity-30 flex justify-center items-center z-50">
//           <span className="loader"></span>
//         </div>
//       ) : (
//         <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {blogs.length === 0 ? (
//             <div className="col-span-2 text-center py-10 text-gray-500">
//               You haven't created any blogs yet.
//             </div>
//           ) : (
//             blogs.map((blog) => (
//               <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md border border-amber-100">
//                 <h2 className="text-lg font-bold text-amber-500">{blog.title}</h2>
//                 <p className="mt-2 text-gray-700">{blog.content}</p>
//                 <div className="mt-4 flex justify-between">
//                   <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
//                 </div>
//                 <div
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (!deleteInProgress) {
//                       handleDelete(blog._id);
//                     }
//                   }}
//                   className={`cursor-pointer text-red-500 rounded-md hover:text-red-700 transition duration-300 
//                           ${deleteInProgress && deletingBlogId === blog._id ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   <MdDelete size={40} />
//                 </div>
//                 {deleteInProgress && deletingBlogId === blog._id && (
//                         <div className="absolute inset-0 bg-white opacity-60 flex justify-center items-center z-10">
//                          <span className="delete_loader">Deleting...</span>
//                         </div>
//                       )}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <h2 className="text-lg font-bold mb-4">Create New Blog</h2>
//         <input type="text" placeholder="Title" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} className="border p-2 w-full mb-2" />
//         <textarea placeholder="Content" value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} className="border p-2 w-full mb-2" />
//         <input type="text" placeholder="Tags (comma separated)" value={newBlog.tags} onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })} className="border p-2 w-full mb-2" />
//         <button onClick={handleCreateBlog} className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-400">Create</button>
//       </Modal>
      
//     </div>
//   );
// };

// export default MyBlogs;
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { getToken } from '../fun';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { ProfileContext } from '../Context/UserContext';
import './Blogs.css';
import Modal from '../Components/Modal';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";


const MyBlogs = () => {
  const { id } = useParams();
  const { profileData } = useContext(ProfileContext);
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', tags: '' });
  const [editingBlog, setEditingBlog] = useState(null); // For storing blog to edit
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  // useRef for auto-growing textarea
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchUserBlogs();
  }, [id]);

  const fetchUserBlogs = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/blogs/user/${id}`, {
        headers: { Authorization: getToken() },
      });
      if (response.status === 200) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching your blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/blogs/create',
        { ...newBlog, tags: newBlog.tags.split(',').map(tag => tag.trim()) },
        { headers: { Authorization: getToken() } }
      );
      if (response.status === 201) {
        toast.success("Blog created successfully");
        setIsModalOpen(false);
        fetchUserBlogs();
      }
    } catch (error) {
      toast.error("Error creating blog");
    }
  };

  // Handle Blog Edit
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };
  const handleEditBlog = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/blogs/${editingBlog._id}`,
        { ...editingBlog, tags: editingBlog.tags.split(',').map(tag => tag.trim()) },
        { headers: { Authorization: getToken() } }
      );
      if (response.status === 200) {
        toast.success("Blog updated successfully");
        setEditingBlog(null);
        fetchUserBlogs();
      }
    } catch (error) {
      toast.error("Error updating blog");
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteInProgress(true);
      setDeletingBlogId(id);
      const response = await axios.delete(`http://localhost:8000/blogs/${id}`, {
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

  // Dynamically resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  }, [newBlog.content, editingBlog?.content]); // Trigger on content change

  return (
    <div className="flex-1 overflow-auto relative">
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 -rotate-90 cursor-pointer">
        <button
          className="bg-[#59B792] text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-[#507767] transition duration-300 transform hover:scale-x-110"
          onClick={() => setIsModalOpen(true)}
        >
          <span>Create Blog</span>
        </button>
      </div>

      {isLoading ? (
        <div className="fixed inset-0 bg-white opacity-30 flex justify-center items-center z-50">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-gray-500">
              You haven't created any blogs yet.
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md border border-amber-100">
                <h2 className="text-lg font-bold text-amber-500">{blog.title}</h2>
                <p className="mt-2 text-gray-700">{blog.content}</p>
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
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(blog._id)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={editingBlog ? editingBlog.title : newBlog.title}
          onChange={(e) => editingBlog ? setEditingBlog({ ...editingBlog, title: e.target.value }) : setNewBlog({ ...newBlog, title: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <textarea
          placeholder="Content"
          ref={textareaRef}
          value={editingBlog ? editingBlog.content : newBlog.content}
          onChange={(e) => editingBlog ? setEditingBlog({ ...editingBlog, content: e.target.value }) : setNewBlog({ ...newBlog, content: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={editingBlog ? editingBlog.tags : newBlog.tags}
          onChange={(e) => editingBlog ? setEditingBlog({ ...editingBlog, tags: e.target.value }) : setNewBlog({ ...newBlog, tags: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={editingBlog ? handleEditBlog : handleCreateBlog}
          className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-400"
        >
          {editingBlog ? 'Update' : 'Create'}
        </button>
      </Modal>
    </div>
  );
};

export default MyBlogs;
