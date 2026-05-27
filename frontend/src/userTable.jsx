
import { useState, useEffect } from "react";


function UserTable() {
      const [users, setUsers ] = useState([])
      const [message, setMessage] = useState("")
      const [status, setStatus] =useState("")
      useEffect(() => { 
        async function getUsers() {
          console.log('we should get users here')
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
            setUsers(null)
          }
        }
  
      getUsers();
      }, [])
  
  return (
    <div class='content'>
      <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p> //condition ? ifTrue : ifFalse
      <div class="usertable">
        <tbody class="tbody">
          <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created at</th>
              <th>Updated at</th>
          </tr>
          {users?.map((val, key) => (
              <tr key = {key}>
              <td>{val._id}</td>
              <td>{val.username}</td>
              <td>{val.role}</td>
              <td>{val.createdAt}</td>
              <td>{val.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>

  );
}

export default UserTable ;