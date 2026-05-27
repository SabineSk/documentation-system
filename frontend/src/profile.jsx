import { useState, useEffect } from "react";
import {useAuth} from './auth/useAuth';
import {useNavigate} from "react-router-dom";
//import { Link } from 'react-router-dom';



function Profile() {
    const { user } = useAuth();
    // const navigate = useNavigate();
    // const [processing, setProcessing] = useState(false);
    // const [error, setError] = useState(null);

    return (
        <div className="content">
            <h2>Profile</h2>
            <nav>
                {/* <Link to="/">Home</Link> |{' '} */}
            </nav>
            <div>

                <p>Your username: {user?.username}</p>
                <p>Your role: {user?.role}</p>                
            </div>
        </div>
    )
}

export default Profile;

