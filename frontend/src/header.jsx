import { Link, useLocation, useNavigate  } from 'react-router-dom';
import {useAuth} from './auth/useAuth';
import { useState } from "react";
import { MdOutlineLanguage } from "react-icons/md";

function Header({ language, setLanguage }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const {isAuthenticated} = useAuth();


    const texts = {
        lv: {
           titleUsers: "Lietotāji",
           titleHoliday: 'Svētku dienas',
           titleHome: 'Sākums',
           titleLogin: "Failu glabāšanas sistēma",
           titleProfile: "Profils",
           navProfile: 'Profils',
           navLogout: "Atslēgties",

        },
        en: {
           titleUsers: 'Users',
           titleHoliday: 'Holidays',
           titleHome: 'Home',
           titleLogin: "Documentation system",
           titleProfile: 'Profile',
           navProfile: 'Profile',
           navLogout: 'Logout',
        }
    };

    const changeLanguageEN = () => {
        setLanguage("en");
    };

    const changeLanguageLV = () => {
        setLanguage("lv");
    };


    let pageTitle = 'Documentation System';

    if (location.pathname === "/home") {
    pageTitle = texts[language].titleHome;
    }else if(location.pathname === "/holidays") {
    pageTitle = texts[language].titleHoliday;
    } else if (location.pathname === "/users") {
    pageTitle = texts[language].titleUsers;
    } else if (location.pathname === "/profile") {
    pageTitle = texts[language].titleProfile;
    } else if (location.pathname === "/login") {
    pageTitle = texts[language].titleLogin;
    }

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
            <header className="nav-content">
                    <div className="navigation-bar">
                        <h1>{pageTitle}</h1>
                        <nav className="nav-links">        
                            <Link to="/home">{texts[language].titleHome}</Link>
                            <Link to="/holidays">{texts[language].titleHoliday}</Link>
                            <Link to="/users">{texts[language].titleUsers}</Link>
                            <div className="dropdown">
                                <a className="dropdown-link">{texts[language].titleProfile}</a>
                                
                                <div className="dropdown-content">
                                    <Link to="/profile">{texts[language].navProfile}</Link>
                                    
                                    <Link onClick={logout}>Logout</Link>
                                </div>
                            </div>
                            <div className="dropdown">
                                <a className="dropdown-link"><MdOutlineLanguage /></a>
                                <div className="dropdown-content">
                                    <a onClick={changeLanguageEN}>EN</a>
                                    <a onClick={changeLanguageLV}>LV</a>

                                </div>
                            </div>
                            
                        </nav>
                    </div>
            </header>
        );
    }else{
        return (
            <header className="nav-content">
                    <div className="navigation-bar">
                        <h1>{pageTitle}</h1>  
                        <nav className="nav-links">        
                            <Link to="/Home">{texts[language].titleHome}</Link>
                            <Link to="/Holidays">{texts[language].titleHoliday}</Link>
                            <Link to="/login">{texts[language].titleLgin}</Link>
                            <div className="dropdown">
                                <a className="dropdown-link"><MdOutlineLanguage /></a>
                                <div className="dropdown-content">
                                    <a onClick={changeLanguageEN}>EN</a>
                                    <a onClick={changeLanguageLV}>LV</a>
                                </div>
                            </div>
                        </nav>
                    </div>
            </header>

        );
    }

    }



    

export default Header;

