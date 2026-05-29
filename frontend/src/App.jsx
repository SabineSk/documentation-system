import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
//import { useState } from "react";
import Header from './header.jsx';
import About from './about.jsx';
import Login from './login.jsx';
import Home from './home.jsx';
import UserTable from './userTable.jsx';
import AddFile from './addFile.jsx';
import Footer from './footer.jsx';
import Profile from './profile.jsx';

import ProtectedRoute from './components/protectedRoute.jsx';


function App() {

  return (
    
      <div className="app">
        <Header />
        <main className="main-app">
          <Routes>
            
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
                       
            <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } 
            >  
                {/* <Route path='/home/userTable' element={<UserTable/>}/> */}
            </Route>
            <Route path='/userTable' element={<UserTable/>}/>
            <Route path='/AddFile' element={<AddFile/>}/>
            <Route 
            path="/home" 
            element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } 
            />  



          </Routes>
        </main>
        <Footer />
      </div> 

  
    
  );
}

export default App;
