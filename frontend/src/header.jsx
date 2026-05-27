import { Link } from 'react-router-dom';
//import {useAuth} from "./auth/useAuth";


function Header() {
    //const {isAuthenticate, isLoading} = useAuth();


    return (
        <header className="content">
            <h1>Documentation System</h1>  
                
                <nav style={{ marginBottom: '20px' }}>        
                    <Link to="/Home">Home</Link> | {' '}
                    <Link to="/About">About</Link> | {' '}
                    <Link to="/Profile">Profile</Link> | {' '}
                    <Link to="/login">Login</Link>
                    
                </nav>
            <hr /> 
        </header>

    );
}

export default Header;

