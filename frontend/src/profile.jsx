import { useState, useEffect } from "react";
import {useAuth} from './auth/useAuth';
import {useNavigate} from "react-router-dom";
//import { Link } from 'react-router-dom';


function Profile() {
    const { user } = useAuth();
    // const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('');
    const [userImage, setUserImage] = useState('');
    
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

    // const FetchProfilePicture = async () =>{
        
    //     setProcessing(true);
    //     setError(null);
    //     try{
    //         const response = await fetch("/api/users/profileImage", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             credentials: "include",
    //         });

    //         const data = await response.json();

    //         if (data.status === 'error') {
    //             setError('Kļūda, atgiežot bildi');
    //             return;
    //         }

    //         setUserImage(data.data);
    //         setError(null);

        
    //     }catch(error){
    //         setError(error.message);
    //     }finally{
    //         setProcessing(false);
    //     }
    // };

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
            <h2>Profile</h2>
            <img className="profile-img" src={userImage} alt="profile picture"></img>
            <div>

                <p>Your username: {user?.username}</p>
                <p>Your role: {user?.role}</p>                
            </div>
             <form onSubmit={onSubmit}>
                <div>
                    <label for="file">Choose file to upload</label>
                    <input type="file" id="fileID" name="file" accept=".jpeg, .png, .jpg"  onChange={HandleImageUpload}/>
                    {/* <div class="col">
                        <h6>Base64 Output</h6>
                        <textarea id="textArea" rows="30" cols="50"></textarea>
                    </div> */}
                </div>
                <div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type='submit' disabled={processing}>
                        {processing ? "Adding file..." : "Submit"} 
                    </button>
                </div>
            </form>

        </div>

        
    )
}

export default Profile;

