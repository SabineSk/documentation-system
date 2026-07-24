// import {Link} from 'react-router-dom';
import UserTable from './userTable.jsx';
import { useState } from 'react';
import {useAuth} from './auth/useAuth';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {useTranslation} from "react-i18next";

function Users() {
    const [type, setType] = useState('password');

    const {user} = useAuth();

    const [showUserTable, setShowUserTable] = useState(true);
    const [showAddNewUser, setShowAddNewUser] = useState(false);

    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newRole, setNewRole] = useState("");

    const [message, setMessage] = useState("")
    const [status, setStatus] =useState("")

    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { t, i18n } = useTranslation();

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
        setStatus(status);
        console.log(message);


        if (status === 'error') {
            setError(t("errorAddingUser"));
            return;
        }
        console.log(t("UserAdded"), data);
        setNewUsername("");
        setNewPassword(""); 
        setNewPasswordConfirm("");
        setNewRole("");
        setError(null);


      }catch (err)
      {console.log(err);
        setError(t("errorAddingUser"));

        }finally{
        setProcessing(false);
        }
    }



    const handleToggle = () => {    //Paslpēpt/atklāt paroli
        setType(type ==='password' ? 'text': "password" );
    };

    if(processing){
        return <div></div>
    }

return ( 
    <div className="content">
        <div>
            <UserTable />
        </div>
    </div>
    
   );
}

//   return ( 
//     <div className="content">

//         <div className="nav">
//             {/* //Atverot vienu button, otra aizveras */}
//             <button onClick={() => {
//                 setShowUserTable(true);
//                 setShowAddNewUser(false);
//             }}> 
//             {t('BttnSearch')}
//             </button>

//             {/* //Tikai admin redz addNewUSer pogu */}
//             {user?.role === "admin" && (
//                 <button onClick={() => {
//                 setShowAddNewUser(true);
//                 setShowUserTable(false);
//                 }}>
//                     {t('BttnAdd')}
//                 </button>
//             )}

            
        

//             {/* <hr></hr> */}

//             {showAddNewUser && (
//                 <div>
//                     <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p> 
                    
//                     <form onSubmit={onSubmit} id="addUserForm" className="form" method="post">
//                         <div className="newUser-FormGroup">
//                             <label htmlFor="newUsername">{t('username')}: </label>
//                             <input 
//                                 type="text" 
//                                 id="newUsername" 
//                                 maxLength={25}
//                                 name="newUsername"
//                                 value={newUsername}
//                                 required 
//                                 onChange={(e) => setNewUsername(e.target.value)} />
//                         </div>
//                         <div className="newUser-FormGroup">
//                             <label htmlFor="newPassword">{t('password')}: </label>
//                             <input 
//                                 type={type} 
//                                 id="newPassword" 
//                                 minlength="4"
//                                 name="newPassword" 
//                                 required 
//                                 onChange={(e) => setNewPassword(e.target.value)} />
//                         </div>
//                         <div className="newUser-FormGroup">
//                             <label htmlFor="newPasswordConfirm">{t('confirmPassword')}: </label>
//                             <input 
//                                 type={type}
//                                 id="newPasswordConfirm" 
//                                 minlength="4"
//                                 name="newPasswordConfirm" 
//                                 required 
//                                 onChange={(e) => setNewPasswordConfirm(e.target.value)} />
//                         </div>
//                         <span onClick={handleToggle}>
//                             {type === "password" ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                         </span>                           
//                         <div className="newUser-FormGroup">
//                             <label htmlFor="newRole">{t('role')}: </label>
//                             <select name="newRole" id="newRole" value={newRole} required onChange={(e) => setNewRole(e.target.value)}>
//                                 <option value="">{t('SelectOption')}</option>
//                                 <option value="admin">{t('admin')}</option>
//                                 <option value="user">{t('user')}</option>
//                             </select>

//                         </div>

//                         {/* <button type="submit" onClick={handleReset}>Submit</button> */}
//                         <button type="submit">{t('Submit')}</button> 
//                     </form>

//                 </div>
//             )

//             }            
//             {showUserTable && (
//                 <div>
//                     <UserTable />
//                 </div>

//             )}
//         </div>
//       </div>
    
//    );
// }

export default Users;


