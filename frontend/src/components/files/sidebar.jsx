import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


function Sidebar() {
  const [folders, setFolders] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(false);


  const fetchFolders = async () => {
    try{
      const response = await fetch('/api/folders/list', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include' 
      });
      const { data, status, message } = await response.json();
  
      setMessage(message);
      setStatus(status);
  
      if (status === 'success'){
        setFolders(data);
  
      }else{
        setFolders([]);
      }
  
    }catch(error){
      console.log(error);
      setFolders([]);
    }
  };
  
  useEffect(() => {
     const loadData = async () => {
      await Promise.all([fetchFolders()]);
    };
    loadData();
  }, []);

  const handleFolderExpand = () => {
    setIsVisible(!isVisible);
  }

//This shows error that it can trigger cascading renders
//   useEffect(() => {
//   fetchFolders();
// }, []);


  return (

    <aside
      className="sidebar p-3 h-100"
      style={{ width: "200px", flexShrink: 0 }}
    >
    
      <p className="small mb-2">Folders</p>

      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          {folders?.map((val) => (
            <Link key={val._id} className="nav-link"  onClick={() => handleFolderExpand(val._id)}>
              {val.folderName}
            </Link>
          ))}


          {/* <Link className="nav-link" to="/folders">
            Folders
          </Link> */}
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/recent">
            Recent
          </Link>
        </li>
      </ul>

      <p className=" small mb-2">SHARING</p>

      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <Link className="nav-link" to="/shared-with-me">
            Shared with me
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/shared-by-me">
            Shared by me
          </Link>
        </li>
      </ul>

      <p className=" small mb-2">ORGANIZE</p>

      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <Link className="nav-link" to="/starred">
            Starred
          </Link>
        </li>
        <li >
          <Link className="nav-link">
            Tags
          </Link>
        </li>
      </ul>

      <p className="small mb-2">OTHER</p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/trash">
            Trash
          </Link>
        </li>
      </ul>

    </aside>

  );
}

export default Sidebar;