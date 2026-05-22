import { useState, useEffect } from "react";
import {useAuth} from './auth/useAuth';

function Profile() {
    const { user } = useAuth();


    return (
        <div>
            <p>This is your profile: {user?.username}</p>
        </div>
    )
}

export default Profile;

