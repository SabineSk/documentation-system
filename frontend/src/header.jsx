import { Link, useLocation, useNavigate  } from 'react-router-dom';
import {useAuth} from './auth/useAuth';
import { useState } from "react";
import { MdOutlineLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";


// function Header({ language, setLanguage }) {
function Header(){
    const navigate = useNavigate();
    const location = useLocation();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const {isAuthenticated} = useAuth();
    
    const { t, i18n } = useTranslation();



    // const texts = {
    //     lv: {
    //        titleUsers: "Lietotāji",
    //        titleHoliday: 'Svētku dienas',
    //        titleHome: 'Sākums',
    //        titleLogin: "Failu glabāšanas sistēma",
    //        titleProfile: "Profils",
    //        navLogin: "Pieslēgties",
    //        navProfile: 'Profils',
    //        navLogout: "Atslēgties",

    //     },
    //     en: {
    //        titleUsers: 'Users',
    //        titleHoliday: 'Holidays',
    //        titleHome: 'Home',
    //        titleLogin: "Documentation system",
    //        titleProfile: 'Profile',
    //        navLogin: "Login",
    //        navProfile: 'Profile',
    //        navLogout: 'Logout',
    //     }
    // };

    // const changeLanguageEN = () => {
    //     setLanguage("en");
    // };

    // const changeLanguageLV = () => {
    //     setLanguage("lv");
    // };


    // let pageTitle = 'Documentation System';

    // if (location.pathname === "/home") {
    // pageTitle = texts[language].titleHome;
    // }else if(location.pathname === "/holidays") {
    // pageTitle = texts[language].titleHoliday;
    // } else if (location.pathname === "/users") {
    // pageTitle = texts[language].titleUsers;
    // } else if (location.pathname === "/profile") {
    // pageTitle = texts[language].titleProfile;
    // } else if (location.pathname === "/login") {
    // pageTitle = texts[language].titleLogin;
    // }

    //izveio mainīgo ar noklusējuma vērtību
    let pageTitle = t("titleLogin");

    //switch pārbauda vienu vērtību un salīdzina to ar vairākiem variantiem.
    switch (location.pathname.toLowerCase()) {
        case "/home":
            pageTitle = t("titleHome");
            break;

        case "/holidays":
            pageTitle = t("titleHoliday");
            break;

        case "/users":
            pageTitle = t("titleUsers");
            break;

        case "/profile":
            pageTitle = t("titleProfile");
            break;

        case "/login":
            pageTitle = t("titleLogin");
            break;
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
                            <Link to="/home">{t("titleHome")}</Link>
                            <Link to="/holidays">{t("titleHoliday")}</Link>
                            <Link to="/users">{t("titleUsers")}</Link>
                            <div className="dropdown">
                                <a className="dropdown-link">{t("titleProfile")}</a>
                                
                                <div className="dropdown-content">
                                    <Link to="/profile">{t("navProfile")}</Link>
                                    
                                    <Link onClick={logout}>{t("navLogout")}</Link>
                                </div>
                            </div>
                            <div className="dropdown">
                                <a className="dropdown-link"><MdOutlineLanguage /></a>
                                <div className="dropdown-content">
                                    {/* <a onClick={changeLanguageEN}>EN</a>
                                    <a onClick={changeLanguageLV}>LV</a> */}
                                    <a onClick={() => i18n.changeLanguage("lv")}>LV</a>
                                    <a onClick={() => i18n.changeLanguage("en")}>EN</a>

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
                            <Link to="/Home">{t("titleHome")}</Link>
                            <Link to="/Holidays">{t("titleHoliday")}</Link>
                            <Link to="/login">{t("navLogin")}</Link>
                            <div className="dropdown">
                                <a className="dropdown-link"><MdOutlineLanguage /></a>
                                <div className="dropdown-content">
                                    {/* <a onClick={changeLanguageEN}>EN</a>
                                    <a onClick={changeLanguageLV}>LV</a> */}
                                    <a onClick={() => i18n.changeLanguage("lv")}>LV</a>
                                    <a onClick={() => i18n.changeLanguage("en")}>EN</a>
                                </div>
                            </div>
                        </nav>
                    </div>
            </header>

        );
    }

    }



    

export default Header;

