
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FaSort } from "react-icons/fa";

function UserTable() {
      const [users, setUsers ] = useState([])
      const [message, setMessage] = useState("")
      const [status, setStatus] =useState("")
      const [showPopup, setShowPopup] = useState({
        type: null,
        user: null
      });

      useEffect(() => { 
        async function getUsers() {
          const response = await fetch('/api/users/list', {
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
            setUsers(data);
          } else {
            setUsers([])
          }
        }
  
      getUsers();
    }, []);


    const handleDelete = async(userID) =>{

      //frontend sūta delete pieprasijumu ar id
      const response = await fetch(`/api/users/${userID}`, {
        method: "DELETE",
        credentials: 'include'
      });

      const data = await response.json();
      if(data.status === 'success'){
        //atjauno ekrānu ar filtru
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userID));
      }
      
      setShowPopup({type: null, user: null})
    };

    // const handleEdit = async(userID) => {
    //   // const response = await fetch(`/api/users/${userID}`)
    //   // method


    //   setShowPopup({type: null, user: null})
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    const sortedData = [...users].sort((a,b) => {
      if (!sortConfig.key) return 0

      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt' ){
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    });

    const handleSort = (key) => {
      setSortConfig({
        key,
        direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
      })
    }
  
  return (
    <div className='content'>
      <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p> 
        <tbody className="tbody">
          <tr>
              <th>
                <div className="th-content">
                  <span>ID</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('_id')} style={{ cursor: 'pointer', }} />
                </div>
              </th>

              <th>
                <div className="th-content">
                  <span>Username</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('username')}/>
                </div>
              </th>

              <th>
                 <div className="th-content">
                  <span>Role</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('role')}/>
                </div>
              </th>

              <th>
                <div className="th-content">
                  <span>Created at</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('createdAt')}/>
                </div>
              </th>

              <th>
                <div className="th-content">
                  <span>Updated at</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('updatedAt')}/>
                </div>
              </th>

              <th>Edit user</th>

              <th>Delete</th>
          </tr>

          {sortedData?.map((val, key) => (
              <tr key = {key}>
              <td>{val._id}</td>
              <td>{val.username}</td>
              <td>{val.role}</td>
              <td>{val.createdAt}</td>
              <td>{val.updatedAt}</td>
               <td>
                <button onClick={() => setShowPopup({type: "edit", user: val})}>
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => setShowPopup({type: "delete", user: val})}>
                  X
                </button>
              </td>
            </tr>
          ))}


          
        </tbody>
        {showPopup.type == "edit" && (
          <>
            <div className="overlay" onClick={() => setShowPopup({type: null, user: null})}></div>
              <form className="fileUploadForm" method="post" encType="multipart/form-data">
                <p>Edit this user?</p>

                <p>Username: {showPopup.user?.username}</p>
                <p>ID: {showPopup.user?._id}</p>
                {/* userParams() ļauj userEdit.jsx nolasīt id no URL  */}
                <Link className="clickable" to={`/userEdit/${showPopup.user._id}`}> YES </Link>
                {/* <button type="button" onClick={() => handleEdit(showPopup.user._id)}>
                  YES
                </button> */}
                <button type="button" onClick={() => setShowPopup({type: null, user: null})}>
                  NO
                </button>
              </form>
          </>
        )}

        {showPopup.type == "delete" && (
          <>
            <div className="overlay" onClick={() => setShowPopup({type: null, user: null})}></div>
            <form className="fileUploadForm" method="post" encType="multipart/form-data">
                <p>Delete this user?</p>
                <p>Username: {showPopup.user?.username}</p>
                <p>ID: {showPopup.user?._id}</p>
                <button type="button" onClick={() => handleDelete(showPopup.user._id)}>
                  YES
                </button>
                <button type="button" onClick={() => setShowPopup({type: null, user: null})}>
                  NO
                </button>
            </form>
          </>
        )}




      </div>
    

  );
}

export default UserTable ;