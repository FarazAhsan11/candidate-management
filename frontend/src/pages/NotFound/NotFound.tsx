import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="bg-white h-screen flex justify-center items-center">
     <div className="text-white border rounded-md bg-black flex justify-center items-center flex-col  w-[30%] p-5 m-auto">
     <h1>404 - Page Not Found</h1>
     <p>Sorry, The page you are looking for does not exist</p>
     <Link to='/' className="text-gray-500" >Go to Homepage</Link>
    </div>
    </div>
  )
}

export default NotFound
