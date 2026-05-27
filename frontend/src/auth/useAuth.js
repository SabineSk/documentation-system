import { useState, useEffect} from "react";
import { useLocation } from 'react-router-dom'
export function useAuth() {
    const [user, setUser] = useState(null); //Pieslēgtais lietotājs vai null, ja nav peslēgts
    const [isLoading, setIsLoading] = useState(true); //Vai tiek ielādēta autentifikācijas informācija
    const location = useLocation();

    useEffect(() => { 
    async function checkAuth() {
        setIsLoading(true)
        const response = await fetch("/api/me", {
            method: "GET",
            headers: {
            "Content-Type": "application/json"
            },
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data?.user) {
            setUser(data.user);
        } else {
            setUser(null)
        }
        setIsLoading(false); //Pārbaude pabeigta

    }

    checkAuth();
    }, [location])

    return  { user, isAuthenticated: user !== null, isLoading };
}

