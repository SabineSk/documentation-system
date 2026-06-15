import { Routes, Route } from 'react-router-dom';
import './App.css';
//import { useState } from "react";
import Header from './header.jsx';
import Holidays from './holidays.jsx';
import Login from './login.jsx';
import Home from './home.jsx';
import UserTable from './userTable.jsx';
// import AddFile from './addFile.jsx';
import Footer from './footer.jsx';
import Profile from './profile.jsx';
import Users from './users.jsx';
import UserEdit from './userEdit.jsx';

import ProtectedRoute from './components/protectedRoute.jsx';


function App() {

  return (
    
      <div className="app">
        <Header />
        <main className="main-app">
          <Routes>
            
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
            {/* :id nozīmē: “šajā URL vietā būs mainīga vērtība”. */}
            <Route path="/userEdit/:id" element={<UserEdit />} /> 
                       
            <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } 
            >  
            </Route>
            <Route path='/userTable' element={<UserTable/>}/>

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
