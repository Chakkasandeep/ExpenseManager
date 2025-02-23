import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";  
import Register from "./pages/Register";  
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";

function App() {
    return (
        <Router>
            <MainContent />
        </Router>
    );
}

// Wrapper component to control Navbar visibility
function MainContent() {
    const location = useLocation();
    const hideNavbarOnPages = ["/", "/signup", "/register","/profile","/home"]; // ✅ Hide navbar on auth pages

    return (
        <>
           
            <Routes>
                <Route path="/" element={<Signup />} />  {/* ✅ Signup is default page */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Register />} />  
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/s" element={<s />} />
                <Route path="/profile" element={<Profile />} />


            </Routes>
        </>
    );
}

export default App;
