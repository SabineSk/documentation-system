import { useState, useEffect } from "react";
import {useAuth} from './auth/useAuth';
import {useNavigate} from "react-router-dom";
//import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";


function Profile() {
    const { user } = useAuth();
    // const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('');
    const [userImage, setUserImage] = useState('');
    const { t, i18n } = useTranslation();
    
    const HandleImageUpload = (e) =>{
        const file = e.target.files[0];

        
        if(!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file)

        //Read file
        
        reader.onload = () => {
            setImage(reader.result); 
            
        };
    };

    
    const onSubmit = async (e) =>{
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try{
            const response = await fetch("/api/users/addImg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ image })
            });

        const data = await response.json();

        if (data.status === 'error') {
        setError('Kļūda, pievienojot bildi');
        return;
        }
        setUserImage(image);
        setImage("");
        setError(null);


        }catch(error){
            setError(error.message);
        }finally{
            setProcessing(false);
        }
          
    };


    useEffect (() =>{
        const FetchProfilePicture = async () =>{
        
        setProcessing(true);
        setError(null);
        try{
            const response = await fetch("/api/users/profileImage", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            const data = await response.json();

            if (data.status === 'error') {
                setError('Kļūda, atgiežot bildi');
                return;
            }

            setUserImage(data.data);
            setError(null);

        
        }catch(error){
            setError(error.message);
        }finally{
            setProcessing(false);
        }
    };
    FetchProfilePicture();
    }, []);

    return (
        <div className="content">
            <div className="profile-card">

                <img className="profile-img" src={userImage} alt="profile picture" />

                <div className="profile-info">
                    <p><strong>{t('username')}:</strong> {user?.username}</p>
                    <p><strong>{t('role')}:</strong> {user?.role}</p>

                </div>

                <form className="profile-form" onSubmit={onSubmit}>
                    <label htmlFor="fileID">{t('ChooseFile')}</label>

                    <input
                        type="file"
                        id="fileID"
                        name="file"
                        accept=".jpeg, .png, .jpg"
                        onChange={HandleImageUpload}
                    />

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={processing}>
                        {processing ? t('Adding file...') : t('Submit')}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Profile;

