import { Link } from 'react-router-dom';

function Header() {
    return (
        <>
            <h1>Documentation System</h1>  
                <nav>        
                    <Link to="/">Home</Link> |{' '}
                    <Link to="/signup">Sign Up</Link> |{' '}
                    <Link to="/login">Login</Link>
                </nav>
            <hr /> 
        </>

    );
}

export default Header;