import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function UserEdit() {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("")
    const [processing, setProcessing] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
    const [editRole, setEditRole] = useState("");

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
          const {data, status, message} = await response.json();
            setMessage(message);
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
            setMessage("");

        }catch (err)
        {console.log(err);
        setError("Kļūda, labojot lietotāju");

        }finally{
        setProcessing(false);
        }
    };


    const [showInput, setShowInput] = useState(false);

    const handleClick = async (e) =>{
         e.preventDefault(); // Novērš formas iesniegšanu, jo poga atrodas <form> iekšienē
            setShowInput(true);  // Parāda ievades lauku
    }


    return(
        <div className="content">
            <h2>Edit user</h2>
            <form onSubmit={onSubmit} id="addUserForm" className="form" method="post">
                <div className="newUser-FormGroup">
                    <label htmlFor="editUsername">Username: </label>
                    <button onClick={handleClick}> Change </button>
                    { showInput && (
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
                <div className="newUser-FormGroup">
                    <label htmlFor="newRole">Change role: </label>
                        <select name="newRole" id="newRole" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                            <option value="">Select an option</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        
                </div>
                <button type="submit">Submit</button> 
            </form>
        </div>
    )
}
export default UserEdit;