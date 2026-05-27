import { useState, useEffect } from "react";
import {useAuth} from './auth/useAuth';
//import { Link } from 'react-router-dom';


function Profile() {
    const { user } = useAuth();
    const {logout} = useAuth()

    return (
        <div className="content">
            <h2>Profile</h2>
            <nav>
                {/* <Link to="/">Home</Link> |{' '} */}
            </nav>
            <div>

                <p>This is your profile: {user?.username}</p>

                <button onClick={logout} className="logout-button">
                Log Out
                </button>
            </div>
        </div>
    )
}

export default Profile;

