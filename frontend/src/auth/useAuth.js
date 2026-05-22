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
        setIsLoading(false); //Pārbaude pabeita

    }

    checkAuth();
    }, [location])
    // useEffect(() => {
    //     //Izpildās vienu reizi, kad komponents ielādējas
    //     //Jautā backend, vai šim pārlūkam ir derīga sesija
    //     fetch("/api/me", {
    //         credentials: 'include', //Liek pārlūkam iekļaut cookies pieprasījumā, lai backend varētu pārbaudīt sesiju
    // })
    // .then((response) => {
    //     if (response.ok) {
    //         return response.json(); //Pārveido atbildi par JSON, ja status ir 200-299   
    //     }
    //     return null; //Ja nav derīga sesija, atgriež null
    // })
    // .then((userData) => {
    //     setUser(userData); //saglabā user vai null
    //     setIsLoading(false); //Pārbaude pabeita
    // })
    // .catch(() => {
    //     //ja kļūda
    //     setIsLoading(false);
    // });

    // }, [])

    return  { user, isAuthenticated: user !== null, isLoading };
}

