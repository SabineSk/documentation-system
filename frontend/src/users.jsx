// import {Link} from 'react-router-dom';
import UserTable from './userTable.jsx';
import { useState } from 'react';
import {useAuth} from './auth/useAuth';


function Users() {
    const {user} = useAuth();

    const [showUserTable, setShowUserTable] = useState(false);
    const [showAddNewUser, setShowAddNewUser] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newRole, setNewRole] = useState("");
    const [message, setMessage] = useState("")
    const [status, setStatus] =useState("")

    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);


    const onSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);


        try {
            const response = await fetch ("/api/users/addUser", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({newUsername, newPassword, newPasswordConfirm, newRole})
        });

        const {data, status, message} = await response.json();
        setMessage(message);
        setStatus(status)


        if (data.status === 'error') {
            setError("Kļūda, pievienojot lietotāju");
            return;
        }
        console.log("User added successfully:", data);
        setNewPassword(""); 
        setNewPasswordConfirm("");
        setNewRole("");
        setError(null);
        setMessage("");

      }catch (err)
      {console.log(err);
        setError("Kļūda, pievienojot lietotāju");

        }finally{
        setProcessing(false);
        }
    }

    // const handleReset = () => {
    //     setNewUsername("");
    //     setNewPassword(""); 
    //     setNewPasswordConfirm("");
    //     // setNewRole("");
    // }

  return ( 
    <div className="content">
      <div>
        <h2>Users</h2>
        <nav className="nav">
            <button onClick={() => {
                setShowUserTable(true);
                setShowAddNewUser(false);
            }}> 
            Find users
            </button>

            {/* <button onClick={() => {
                setShowAddNewUser(true);
                setShowUserTable(false);
            }}>
                Add new user
            </button> */}

            {user?.role === "admin" && (
                <button onClick={() => {
                setShowAddNewUser(true);
                setShowUserTable(false);
                }}>
                    Add new user
                </button>
            )}
        

            <hr></hr>

            {showAddNewUser && (
                <div>
                    <button onClick={() => setShowAddNewUser(false)}>Close</button>
                    <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p> 
                    
                    <form onSubmit={onSubmit} id="addUserForm" className="form" method="post">
                        <div className="newUser-FormGroup">
                            <label htmlFor="newUsername">Username: </label>
                            <input 
                                type="text" 
                                id="newUsername" 
                                name="newUsername"
                                required 
                                onChange={(e) => setNewUsername(e.target.value)} />
                        </div>
                        <div className="newUser-FormGroup">
                            <label htmlFor="newPassword">Password: </label>
                            <input 
                                type="password" 
                                id="newPassword" 
                                name="newPassword" 
                                required 
                                onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="newUser-FormGroup">
                            <label htmlFor="newPasswordConfirm">Confirm password: </label>
                            <input 
                                type="password" 
                                id="newPasswordConfirm" 
                                name="newPasswordConfirm" 
                                required 
                                onChange={(e) => setNewPasswordConfirm(e.target.value)} />
                        </div>
                        <div className="newUser-FormGroup">
                            <label htmlFor="newRole">Role: </label>
                            <select name="newRole" id="newRole" value={newRole} required onChange={(e) => setNewRole(e.target.value)}>
                                <option value="">Select an option</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>

                        </div>

                        {/* <button type="submit" onClick={handleReset}>Submit</button> */}
                        <button type="submit">Submit</button> 
                    </form>

                </div>
            )

            }            
            {showUserTable && (
                <div>
                    <button onClick={() => setShowUserTable(false)}>Close</button>
                    <UserTable />
                </div>
            )}
        </nav>

        


      </div>
    
    </div>

   );
}

export default Users;