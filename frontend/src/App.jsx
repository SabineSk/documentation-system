import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
//import { useState } from "react";
import Header from './header.jsx';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Home from './home.jsx';
import Footer from './footer.jsx';
import Profile from './profile.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';


function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } 
            />  
          </Routes>
        </main>
        <Footer />
      </div> 

    </BrowserRouter>
    
  );
}

export default App;