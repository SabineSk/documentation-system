import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowDownSLine } from "react-icons/ri";

function Sidebar() {
  const [folders, setFolders] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState({});


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

  // const handleFolderExpand = () => {
  //   setIsVisible(!isVisible);
  // }

//This shows error that it can trigger cascading renders
//   useEffect(() => {
//   fetchFolders();
// }, []);

  const toggleExpand = (folderId) => {
    setIsExpanded((prev) => ({...prev, [folderId]: !prev[folderId]}))
  }

const RecursiveFolderSide = ({ folder, folders}) => {
  const children = folders.filter((parentFolder) => parentFolder.parent === folder._id);
  return (
    
    <ul className="list-unstyled">
      <li className="">
        <div className="cursor-pointer">
            {/* <button className="bg-dark border-0  ">
                <RiArrowRightSLine className="text-white" />
            </button> */}

            <span className=" bg-dark border-0 folder-toggle align-items-center" onClick={() => toggleExpand(folder._id)}>
              {isExpanded[folder._id] ? <RiArrowDownSLine className="text-white"/> : <RiArrowRightSLine className="text-white"/>}
            </span>
            
           {folder.folderName}
        </div>
        {children?.map((child) => (
          <div key={child._id} className="ms-3">
            {isExpanded [folder._id] && (
            <RecursiveFolderSide
              folder={child}
              folders={folders}
            />
            )
            }

          </div>
        ))}
      </li>
    </ul>
  )
}

return (
    <aside
      className="sidebar p-3 h-100"
      style={{ width: "200px", flexShrink: 0 }}
    >
      <p className="small">Folders</p>
        {/* renders only highest level maps. then calls recursive function for child */}
        {folders
          .filter((folder) => folder.parent === null)
          .map((folder) => (
            <RecursiveFolderSide
              key={folder._id}
              folder={folder}
              folders={folders}
            />
          ))}

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