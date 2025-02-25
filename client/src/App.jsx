import AllRoutes from "./AllRoutes/AllRoutes"
import { ToastContainer } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import './App.css'
import Navbar from "./Components/Navbar"
import Layout from "./Components/Layout"
function App() {

  return (
    <div className="app w-[100vw] h-[100vh] overflow-y-auto m-0 p-0 flex">
      <Navbar/>
      <div className="ml-0 md:ml-[270px] flex-1 h-[100vh] overflow-y-auto">
      <AllRoutes />
      </div>
      <ToastContainer autoClose={1700} hideProgressBar={true}/>
    </div>
    // <Layout>
    //   <AllRoutes />
    //   <ToastContainer autoClose={1700} hideProgressBar />
    // </Layout>
  )
}

export default App
