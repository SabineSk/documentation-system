import {Navigate} from "react-router-dom";
import {useAuth} from '../auth/useAuth';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, user, isLoading } = useAuth();
    console.log('lietotājs ', user)
    //kamēr vēl tiek parbaudīts sesija, nerāda neko
    //bez šī lietotās uz sekundi redzētu /login, pat ja ir pieslēdzies
    if(isLoading){
        return <div>Lādējas...</div>;
    }

    if(!isAuthenticated){
        console.log('nav autorizets')
        return <Navigate to="/login" replace/>; //"Replace" tiek izdzēsts /profile no vēstures, lai lietotājs nevarētu atgriezties ar "Back" pogu
    }
    return children;
}