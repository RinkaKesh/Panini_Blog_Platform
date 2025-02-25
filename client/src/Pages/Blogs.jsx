import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { getStatusColors, getToken, isAuth } from "../fun";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../Components/Modal";
import { MdFilterList, MdClose } from "react-icons/md";
import Select from "react-select";
import Header from "../Components/Header";
import { Check } from "lucide-react";
import './Blogs.css'
import styled from "styled-components";
import MyBlogs from "./MyBlogs";
import Loader from "../Components/Loader";
const FeedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const BlogCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    color: #555;
  }

  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
  }
`;

const TagsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #f1f1f1;
  color: #333;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-right: 5px;
`;

const Actions = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
`;

const CommentList = styled.div`
  margin-top: 5px;
  max-height: 100px;
  overflow-y: auto;
`;

const Comment = styled.div`
  background: #f9f9f9;
  padding: 5px;
  margin-top: 3px;
  border-radius: 5px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditButton = styled.button`
  background: #ffcc00;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: #ff4d4d;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
`;

const SaveButton = styled.button`
  background: #4caf50;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
`;



const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("https://panini-blog.vercel.app/blogs");
      setBlogs(response.data.data);
    } catch (error) {
      toast.error("Error fetching blogs");
    }
    finally{
      setIsLoading(false)
    }
  };

  const handleLike = async (id) => {
    console.log(id);
    
    try {
      await axios.post(`http://localhost:8000/blogs/${id}/like`);
      fetchBlogs();
    } catch (error) {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (id) => {
    if (!newComments[id]?.trim()) return; // Prevent empty comments
    try {
      await axios.post(`http://localhost:8000/blogs/${id}/comment`, {
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

  return (
    // <div className="relative w-full">
    //      {isLoading && 
    //      (
    //       <div className="fixed inset-0 bg-white opacity-30 flex justify-center items-center z-50">
    //         {/* <span className="loader"></span> */}
    //         <Loader/>
    //       </div>
    //     )
    //     }
    //  {!isLoading && 
    //    (<div className=" flex flex-col relative">
    //     <Header header_text={"All Blogs"}/>
    //    <div className="mt-[82px] h-[calc(100vh-82px)] overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6   md:mt-0  md:h-screen ">
    //    {blogs.map((blog) => (
    //     <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md ">
    //       <h2 className="text-lg font-bold">{blog.title}</h2>
    //       <p>{blog.content}</p>
    //       <div className="mt-2 flex gap-2">
    //         {blog.tags.map((tag) => (
    //           <span
    //             key={tag}
    //             className="bg-gray-200 px-2 py-1 rounded-md text-sm"
    //           >
    //             {tag}
    //           </span>
    //         ))}
    //       </div>
    //       <p>Creator: {blog?.author?.name}</p>
    //       <div className="mt-4">
    //         <button onClick={() => handleLike(blog._id)} className="text-blue-500">
    //           ❤️ {blog.likes.length}
    //         </button>
    //       </div>
    //       <div className="mt-4">
    //         <input
    //           type="text"
    //           className="border p-2 w-full rounded-md"
    //           placeholder="Add a comment..."
    //           value={newComments[blog._id] || ""} // Ensure each blog has its own comment input
    //           onChange={(e) =>
    //             setNewComments((prev) => ({ ...prev, [blog._id]: e.target.value }))
    //           }
    //         />
    //         <button
    //           onClick={() => handleComment(blog._id)}
    //           className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
    //         >
    //           Comment
    //         </button>
    //       </div>

    //       {/* Show Comments Section */}
    //       {blog.comments.length > 0 && (
    //         <div className="mt-4">
    //           {blog.comments.slice(0, visibleComments[blog._id] || 1).map((comment, index) => (
    //             <div key={index} className="border-b py-2">
    //               <p className="text-sm">{comment.content}</p>
    //             </div>
    //           ))}

    //           {blog.comments.length > (visibleComments[blog._id] || 1) && (
    //             <button
    //               onClick={() => handleShowMoreComments(blog._id)}
    //               className="text-blue-500 mt-2"
    //             >
    //               Show More Comments
    //             </button>
    //           )}
    //         </div>
    //       )}
    //     </div>
    //   ))} 
    //   </div>
    //   </div>)
    //  }
    // </div>
    <div className="relative w-full h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
          <Loader />
        </div>
      )}
      
      {!isLoading && (
        <div className="pt-[80px] flex flex-col relative h-full md:pt-0">
          <Header header_text={"All Blogs"} />
          
          <div className=" h-full overflow-y-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ]">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold">{blog.title}</h2>
                <p className="mt-2 text-gray-700">{blog.content}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 px-2 py-1 rounded-md text-sm"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
