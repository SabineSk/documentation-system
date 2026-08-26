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

    <header>
        <nav className="navbar navbar-expand-lg px-3 bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
            {/* Lapas nosaukums */}
            <span className="navbar-brand mb-0 h1" style={{ fontSize: '2rem' }}>
            {pageTitle}
            </span>

            {/* Poga mazākiem ekrāniem */}
            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navigācija */}
            <div
            className="collapse navbar-collapse justify-content-end"
            id="mainNavbar"
            >
            <ul className="navbar-nav align-items-lg-center gap-lg-2">

                <li className="nav-item">
                <Link className="nav-link" to="/home">
                    {t("titleHome")}
                </Link>
                </li>

                <li className="nav-item">
                <Link className="nav-link" to="/holidays">
                    {t("titleHoliday")}
                </Link>
                </li>

                <li className="nav-item">
                <Link className="nav-link" to="/users">
                    {t("titleUsers")}
                </Link>
                </li>

                {/* Profils */}
                <li className="nav-item dropdown">
                <button
                    className="nav-link dropdown-toggle btn btn-link"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    {t("titleProfile")}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                    <Link className="dropdown-item" to="/profile">
                        {t("navProfile")}
                    </Link>
                    </li>

                    <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        onClick={logout}
                    >
                        {t("navLogout")}
                    </button>
                    </li>
                </ul>
                </li>

                {/* Valoda */}
                <li className="nav-item dropdown">
                <button
                    className="nav-link dropdown-toggle btn btn-link"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <MdOutlineLanguage size={20} />
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                    <button
                        className="dropdown-item"
                        onClick={() => i18n.changeLanguage("lv")}
                    >
                        LV
                    </button>
                    </li>

                    <li>
                    <button
                        className="dropdown-item"
                        onClick={() => i18n.changeLanguage("en")}
                    >
                        EN
                    </button>
                    </li>
                </ul>
                </li>

            </ul>
            </div>
        </div>
        </nav>
    </header>

        );
    }else{
        return (
        <header>
        <nav className="navbar navbar-expand-lg px-3 bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
            {/* Lapas nosaukums */}
            <span className="navbar-brand mb-0 h1" style={{ fontSize: '2rem' }}>
            {pageTitle}
            </span>

            {/* Poga mazākiem ekrāniem */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbar"
                aria-controls="mainNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon"></span>
            </button>



            {/* Navigācija */}
            <div
            className="collapse navbar-collapse justify-content-end"
            id="mainNavbar"
            >
            <ul className="navbar-nav align-items-lg-center gap-lg-2">
                <ul className="navbar-nav align-items-lg-end gap-lg-2">
                    <li className="nav-item">
                    <Link className="nav-link" to="/login">
                        {t("Login")}
                    </Link>
                    </li>
                </ul>
                    

                {/* Valoda */}
                <li className="nav-item dropdown">
                <button
                    className="nav-link dropdown-toggle btn btn-link"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <MdOutlineLanguage size={20} />
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                    <button
                        className="dropdown-item"
                        onClick={() => i18n.changeLanguage("lv")}
                    >
                        LV
                    </button>
                    </li>

                    <li>
                    <button
                        className="dropdown-item"
                        onClick={() => i18n.changeLanguage("en")}
                    >
                        EN
                    </button>
                    </li>
                </ul>
                </li>

            </ul>
            </div>
        </div>
        </nav>
    </header>






            // <header className="nav-content">
            //         <div className="navigation-bar">
            //             <h1>{pageTitle}</h1>  
            //             <nav className="nav-links">        
            //                 <Link to="/Home">{t("titleHome")}</Link>
            //                 <Link to="/Holidays">{t("titleHoliday")}</Link>
            //                 <Link to="/login">{t("navLogin")}</Link>
            //                 <div className="dropdown">
            //                     <a className="dropdown-link"><MdOutlineLanguage /></a>
            //                     <div className="dropdown-content">
            //                         {/* <a onClick={changeLanguageEN}>EN</a>
            //                         <a onClick={changeLanguageLV}>LV</a> */}
            //                         <a onClick={() => i18n.changeLanguage("lv")}>LV</a>
            //                         <a onClick={() => i18n.changeLanguage("en")}>EN</a>
            //                     </div>
            //                 </div>
            //             </nav>
            //         </div>
            // </header>

        );
    }

    }



    

export default Header;

