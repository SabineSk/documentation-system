import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function UserEdit() {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("")
    const [processing, setProcessing] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
    const [editRole, setEditRole] = useState();

    const [user, setUser ] = useState(null)
    const [status, setStatus] =useState("")



    const handleGetUser = async(userID) => {
        const response = await fetch(`/api/users/${userID}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials:'include'
        }); 
    }

    
    const { id } = useParams();
    useEffect(() => { 
    
        async function getEditUsers() {
          const response = await fetch(`/api/users/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials:'include'
          });
          const {data, status} = await response.json();
            setStatus(status)

          if (status === 'success') {
            setUser(data);
          } else {
            setUser(null)
          }
        }
  
      getEditUsers();
    }, []);


    const onSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try{
            const response = await fetch(`/api/users/${id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials:'include',
                body: JSON.stringify({
                    editUsername,
                    editPassword,
                    editPasswordConfirm,
                    editRole
                })
            });
            const {data, status, message} = await response.json();
                setMessage(message);
                setStatus(status)

            if (status === 'error') {
                setError("Kļūda, labojot lietotāju");
                return;
            }


            setEditUsername(""); 
            setEditPassword("");
            setEditPasswordConfirm("");
            setEditRole("");
            setError(null);
            //setMessage(""); Šis neder, jo message vajag attēlot 

        }catch (err)
        {console.log(err);
        setError("Kļūda, labojot lietotāju");

        }finally{
        setProcessing(false);
        }
    };


    const [clickedUsername, setClickedUsername] = useState(false);
    const [showUsernameInput, setShowUsernameInput] = useState(false);

    const [clickedPassword, setClickedPassword] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const [clickedRole, setClickedRole] = useState(false);
    const [showRoleInput, setShowRoleInput] = useState(false);

    const handleClickUsername = () => {
        if (!clickedUsername) {
            setShowUsernameInput(true);
            setClickedUsername(true);
        } else {
            setShowUsernameInput(false);
            setClickedUsername(false);
        }
    };

    const handleClickPassword = () => {
        if (!clickedPassword) {
            setShowPasswordInput(true);
            setClickedPassword(true);
        } else {
            setShowPasswordInput(false);
            setClickedPassword(false);
        }
    };

    const handleClickRole = () => {
    if (!clickedRole) {
        setShowRoleInput(true);
        setClickedRole(true);
    } else {
        setShowRoleInput(false);
        setClickedRole(false);
    }
    };


    return(
        <div className="content">
            <h2>Edit user</h2>
            
            <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p>
            <form onSubmit={onSubmit} id="addUserForm" className="form" method="post">
                <div className="newUser-FormGroup">
                    <button onClick={handleClickUsername} type="button"> Change current username: {user?.username} </button>
                    { showUsernameInput && (
                        <input 
                        placeholder="Input here"
                        type="text" 
                        id="editUsername" 
                        name="editUsername"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)} />
                    )}
                </div>

                <div className="newUser-FormGroup">
                    <button onClick={handleClickPassword} type="button"> Change password </button>
                    {showPasswordInput && (
                    <>
                        <div className="newUser-FormGroup">
                            <label htmlFor="editPassword">Change password: </label>
                            <input 
                                type="text" 
                                id="editPassword" 
                                name="editPassword"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)} />

                        </div>
                        <div className="newUser-FormGroup">
                            <label htmlFor="editPasswordConfirm">Confirm changed password: </label>
                            <input 
                                type="text" 
                                id="editPasswordConfirm" 
                                name="editPasswordConfirm"
                                value={editPasswordConfirm} 
                                onChange={(e) => setEditPasswordConfirm(e.target.value)} />

                        </div>
                    </>
                    )}
                </div>

                <div className="newUser-FormGroup">
                    <button onClick={handleClickRole} type="button" >Change current role: {user?.role}</button>
                    { showRoleInput && (                        
                        <select name="newRole" id="newRole" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                            <option value="">Select an option</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>

                    )}
                </div>
                <button type="submit">Submit</button> 
            </form>
        </div>
    )

}    
export default UserEdit;