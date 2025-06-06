
import "./App.css";
import { Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import About from "./pages/About";
import Signup from "./pages/Signup";
import MyProfile from "./components/core/Dashboard/MyProfile";
import OpenRoute from "./components/core/Auth/OpenRoute"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/DashBoard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import Cart from "./components/core/Dashboard/Cart";
import AddCourse from "./components/core/Dashboard/Add Course";
function App() {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>}/>
        <Route
            path="contact"
            element={
                <ContactPage />
            }
          />  
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        /> 
        <Route 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
            
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings/>} />
          <Route path="dashboard/cart" element={<Cart />} />
          {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                </>
              )
          }
          {
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
                <Route path="dashboard/add-course" element={<AddCourse />} />
                {/* <Route path="dashboard/my-courses" element={<MyCourses />} /> */}
                {/* <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} /> */}
                </>
              )
          }
        </Route>
        <Route path="*" element={<h1 className="text-richblack-5">404 Not Found</h1>} />
        
      </Routes>
    </div>
  );
}

export default App;
