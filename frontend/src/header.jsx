import { Link } from 'react-router-dom';
import {useAuth} from './auth/useAuth';
import {useNavigate} from "react-router-dom";
import { useState } from "react";

function Header() {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const {isAuthenticated} = useAuth();

    const logout = async (e)=> {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                credentials: 'include'
            });
        
            const data = await response.json();
            console.log("Logout:", data);

            
            navigate("/login");
            
        } catch (err) 
        { setError(err.message);
        }
    }
    
    if (isAuthenticated){
        return (
            <header className="content">
                    <div className="navigation-bar">
                        <h1 > Documentation System</h1>  
                        <nav className="nav-links">        
                            <Link to="/Home">Home</Link>
                            <Link to="/About">About</Link>
                            <div className="dropdown">
                                <a className="dropdown-link">Profile</a>
                                
                                <div className="dropdown-content">
                                    <Link to="/Profile">Profile</Link>
                                    <Link onClick={logout}>Logout</Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                <hr /> 
            </header>
        );
    }else{
        return (
            <header className="content">
                    <div className="navigation-bar">
                        <h1 > Documentation System</h1>  
                        <nav className="nav-links">        
                            <Link to="/Home">Home</Link>
                            <Link to="/About">About</Link>
                            <Link to="/login">Login</Link>
                        </nav>
                    </div>
                <hr /> 
            </header>

        );
    }

    }



    

export default Header;

