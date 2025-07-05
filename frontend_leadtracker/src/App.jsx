import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";

import ScrollToTop from "./ScrollToTop.jsx";

import Signup from "./components/userPortal/Signup.jsx";
import SignIn from "./components/userPortal/SignIn.jsx";

import ForgotPassword from "./components/userPortal/ForgotPassword.jsx";
import VerifyOtp from "./components/userPortal/VerifyOpt.jsx";
import ResetPassword from "./components/userPortal/ResetPassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import TotalLead from "./components/TotalLead.jsx";
import LeadForm from "./components/LeadForm.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound404 from "./NotFound404.jsx";



function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      {/* Main content area */}
      <div className="flex flex-col">
        <div className="flex-grow" style={{marginTop:"84px"}}>
          <Routes>

            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />}/>
            <Route path="*" element={<NotFound404/>}/>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
              } />
            <Route path="/total-leads" element={
              <ProtectedRoute>
                 <TotalLead/>
              </ProtectedRoute>
              }/>
            <Route path="/leadform" element={<LeadForm/>}/>

          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
