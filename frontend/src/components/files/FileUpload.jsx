import {Link, Outlet} from 'react-router-dom';
import { useState, useEffect } from "react";
//import {useAuth} from './auth/useAuth';
import { IoCloudUploadOutline } from "react-icons/io5";
import { HiOutlineFolderAdd } from "react-icons/hi";
// import { RiTeamLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import { FcPicture } from "react-icons/fc";
import { FcVideoCall } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
import { HiDotsHorizontal } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
// import { MdOutlineStarRate } from "react-icons/md";
// import { MdStarRate } from "react-icons/md";
import { ImStarEmpty } from "react-icons/im";
import { ImStarFull } from "react-icons/im";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowDownSLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { FcFolder } from "react-icons/fc";

function Home() {

const [error, setError] = useState(null);
const [processing, setProcessing] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [message, setMessage] = useState("");
const [status, setStatus] = useState("");
const [file, setFile] = useState([]);
const [checkedFiles, setCheckedFiles] = useState([]);
const [folderName, setFolderName] = useState("");
const [folders, setFolders] = useState([]);
const [isVisible, setIsVisible] = useState(false);
const [isExpanded, setIsExpanded] = useState({});
const [parentFolder, setParentFolder] = useState();
const [clickedFolder, setClickedFolder] = useState();

const [selectedCategory, setSelectedCategory] = useState();
const { t, i18n } = useTranslation();


//Folder expand/collapse toggle
//prev is callback function for the previous IsExpanded state (true or false).
//...prev copies all previous state values into the new state object
//[folderId]: takes the folderId 
//At first !prev[folderId] does not contain the specific folderId yet, it is undefined. !undefined is true. 
//Allows to toggle the state of each folder individually, without affecting the others.
// const toggleExpand = (folderId) => {
//   setIsExpanded((prev) => ({...prev, [folderId]: !prev[folderId]}))
// }

// const handleAdd = (parentId, isFpolder) => {
//   const name = prompt(`Enter ${isFolder ? "folder" : "file"} name:`);
//     if (name) onAdd(parentId, name, isFolder);
  
// }
const handleAddFolder = async (e) => {
  e.preventDefault();

  try{
    const response = await fetch('/api/folders/create', {
      method: "POST",
      headers:{
          "Content-Type": "application/json"
    },  
    credentials:'include',
    body: JSON.stringify({
      folderName: folderName,
      parent: parentFolder || null
    })
    });

    const {data, status, message} = await response.json();
    setMessage(message);
    setStatus(status);
    setFolderName("");

    }catch(err){
      console.log(err);
      setError("Kļūda, pievienojot mapi");
    }
}


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
  }, [folders]);

  // const handleFolderExpand = () => {
  //   setIsVisible(!isVisible);
  // }

  const toggleExpand = (folderId) => {
    setIsExpanded((prev) => ({...prev, [folderId]: !prev[folderId]}))
  }
  

const onSubmit =  async (e) => {
  e.preventDefault();

  if (!selectedFile){
    setError("Please choose a file");
    return;
  }

  setProcessing(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", selectedFile);

  try{
    const response = await fetch('/api/files/upload', {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const { status, message } = await response.json();
    setMessage(message);
    setStatus(status);


    if (status === 'error') {
    setError('Kļūda, pievienojot failu');
    return;
    }  
    
    if (status === 'success') {
      await fetchFiles();    
      console.log(message); 
      setSelectedFile();
    }

  }catch (err)
  {console.log(err);
    setError("Could not upload files");
  }finally{
    setProcessing(false);
  }
}



const fetchFiles = async () => {
  try {
    const response = await fetch('/api/files/list', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    });

    const { data, status, message } = await response.json();

    setMessage(message);
    setStatus(status);

    if (status === 'success') {
      setFile(data);
    } else {
      setFile([]);
    }

  } catch (err) {
    console.log(err);
    setFile([]);
  }
};



// useEffect(() => {
//   fetchFiles();
// }, []);

// const fetchFolders = async () => {
//   try{
//     const response = await fetch('/api/folders/list', {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: 'include' 
//     });
//     const { data, status, message } = await response.json();

//     setMessage(message);
//     setStatus(status);

//     if (status === 'success'){
//       setFolders(data);

//     }else{
//       setFolders([]);
//     }

//   }catch(error){
//     console.log(error);
//     setFolders([]);
//   }
// };

// useEffect(() => {
//    const loadData = async () => {
//     await Promise.all([fetchFiles(), fetchFolders()]);
//   };
//   loadData();
// }, []);


useEffect(() => {
   const loadData = async () => {
    await Promise.all([fetchFiles()]);
  };
  loadData();
}, []);

const handleFileSelect = async(event) => {
  const checkedIds = event.target.value; // Gets the value (ID) of the checkbox that was clicked
if(event.target.checked){ //If checkbox is checked(true), 
  setCheckedFiles([...checkedFiles, checkedIds]) //...checkedFiles is the previous state, and shecedIds is the new value to be added to the array
}else{
  setCheckedFiles(checkedFiles.filter(id=>id!==checkedIds)) //if checkbox is unchecked, remove the id from the checkedFiles array by filtering out the unchecked id
}
}

const handleDelete = async(fileID)=>{
    const response = await fetch(`/api/files/${fileID}`, {
      method: "DELETE",
      credentials: 'include'
    });
    const data= await response.json();
    if(data.status == 'success'){
      //atjauno ekrānu ar filtru
      setFile((prevUsers) => prevUsers.filter((file) =>file._id !== fileID));
      setCheckedFiles([])
    }
};


const [location, setLocation] = useState();

const handleMove = async(event, fileID, currentLocation) => {
  event.preventDefault();
  setProcessing(true);
  setError(null);

  const value = event.currentTarget.dataset.value;
  console.log(value); 

  try{
    console.log('fileID value for moving:', fileID);
    const response = await fetch(`/api/files/${fileID}`, {
      method: "PATCH",
      headers:{
          "Content-Type": "application/json"
      },
      credentials:'include',
      body: JSON.stringify({
        editLocation: !currentLocation
      })
    });
    const {data, status, message} = await response.json();
      setMessage(message);
      setStatus(status);
    
      if (status === 'success') {
        setLocation(!currentLocation);
        fetchFiles(); // Refresh the file list to show the updated starred status
        console.log(message); 
      }

    }catch(err){
      console.log(err);
      setError("Kļūda, atjauninot faila atrašanās vietu");
    }finally{
      setProcessing(false);
    }
}
const handleView = (id) => {
  window.open(`/api/files/view/${id}`, "_blank")
};


const handleDownload = (id) => {
  window.open(`/api/files/download/${id}`, "_blank")
}

const [starred, setStarred] = useState();
// const [starredFiles, setStarredFiles] = useState([]);


const handleStarred = async (event, fileID, currentStarredStatus) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    const value = event.currentTarget.dataset.value; 
    console.log(value); 

    try{
      console.log('fileID value:', fileID);
      const response = await fetch(`/api/files/${fileID}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        credentials:'include',
        body: JSON.stringify({
          editStarred: !currentStarredStatus
        })
      });

      const {data, status, message} = await response.json();
      setMessage(message);
      setStatus(status);
    
      if (status === 'success') {
        setStarred(!currentStarredStatus);
        fetchFiles(); // Refresh the file list to show the updated starred status
        console.log(message); 
      }

    }catch(err){
      console.log(err);
      setError("Kļūda, atjauninot failu");
    }finally{
      setProcessing(false);
    }
}

const RecursiveFolder = ({ folder, folders}) => {
  const children = folders.filter((parentFolder) => parentFolder.parent === folder._id);
  return (
    <div
      className="col-12 col-sm-6 col-md-4 col-lg-3 "
      key={folder._id}      
    >
      <div
        className=" d-flex align-items-center px-3 py-3 rounded-4 bg-light cursor-pointer"
      >
        <FcFolder size={30} onClick={() => {setClickedFolder(folder._id)}} />
        <span className="ms-3 flex-grow-1 text-start" >
          {folder.folderName}
        </span>
        <div className="dropdown">
          <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <HiDotsHorizontal />
          </button>

          <ul className="dropdown-menu" >
                <li>
                  <a className="dropdown-item d-flex align-items-center gap-3">
                    <HiOutlineDownload/> {t("Download")}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center gap-3">
                    <RiDeleteBinLine/> {t("Delete")}
                  </a>
                </li>
          </ul>
        </div>
      </div>
    
      {/* {children.map((child) => (
        <div key={child._id} style={{ marginLeft: "20px" }}>
          <RecursiveFolder
            folder={child}
            folders={folders}
          />
        </div>
      ))} */}
    </div>

  );
}

return (
  <div className="container-fluid p-0" >
    <main className="col-12">
      <div className="row align-items-start mb-4 py-3">

        {/******************************************* KREISĀ PUSE UPLOAD ********************************************/}
        <div className="col-6 mt-1">
          <div className="row g-3">
             {/******************************************* File UPLOAD ********************************************/}
            <div className='col-12 col-md-12 col-lg-6 col-xl-6 '>
              <div className="simple-box h-100 w-100 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center m-0 p-0" style={{ backgroundColor: '#e0a4f255' }}>
                <form onSubmit={onSubmit} className="w-100 flex-column align-items-center p-3" >
                  <label htmlFor="file-upload">
                    <IoCloudUploadOutline />
                    <h6>{t("Choose file")}</h6>
                    <input
                      id="file-upload"
                      type="file"
                      className="file-input"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </label>
                  {selectedFile && (
                    <div className="d-flex gap-3">                    
                      <small>{selectedFile.name}</small>
                      <small>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </small>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="upload-button w-100"
                    disabled={!selectedFile || processing}
                  >
                    {processing ? t("Uploading..."): t("Upload") }
                  </button>
                </form>
              </div>
            </div>
            {/******************************************* Create folder ********************************************/}
            <div className='col-12 col-md-12 col-lg-6 col-xl-6 '>
              <div className="simple-box h-100 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#e0a4f255' }}>
                <label 
                  type="button" 
                  className="btn h-100 w-100 d-flex flex-column align-items-center justify-content-center"
                  htmlFor="folder-name"
                  data-bs-toggle="modal"
                  data-bs-target="#newFolderModal"
                  style={{ cursor: "pointer" }}
                  >
                    <HiOutlineFolderAdd />
                    <h6>{t("New folder")}</h6>
                  </label>
              </div>
              <div className="modal fade" id="newFolderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          {/* parentFolder only stores filder _id. To get folderName, find folder object by ID */}
                          {/* parentFolder === null
                          ? "My Files"
                          : ... */}
                          {folders.find(folder => folder._id ===parentFolder)?.folderName} <RiArrowRightSLine />  New folder
                        </h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body col-12">
                      <div className=" col-12" >                    
                        
                        <div className="d-flex flex-column w-100"> 
                          <span className="folder-toggle align-items-center cursor-pointer text-nowrap" onClick={() => setParentFolder(null)}>
                            My files
                          </span> 
                        </div>

                        {folders?.filter((parentFolder) => parentFolder.parent === null).map((val) => (
                          // flex-column: Stacks elements vertically.align-items-start: Controls the horizontal alignment in a column layout, pushing your stacked items tightly to the left side.
                          <div className="d-flex flex-column w-100" key={val._id} > 
                            {val.parent === null &&(
                              <div className="d-flex justify-content-start w-100">
                                <span className="folder-toggle align-items-center" onClick={() => toggleExpand(val._id)}>
                                  {isExpanded[val._id] ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                                </span> 
                                {/*                                 
                                <span className="cursor-pointer mb-2" onClick={() => setParentFolder(val._id)}>
                                  {val.folderName}
                                </span> */}
                                {parentFolder!== val._id && (
                                <span className="cursor-pointer  text-nowrap" onClick={() => setParentFolder(val._id)}>
                                  {val.folderName}
                                </span>
                                )}
                                {parentFolder=== val._id && (
                                <span className="cursor-pointer fw-bold text-nowrap">
                                  {val.folderName}
                                </span>
                                )}
                              </div>
                            )
                            }

                            {isExpanded [val._id] && (
                              <div className="mb-3">
                                {folders?.filter((subFolder) => subFolder.parent === val._id).map((subFolder) => (
                                  <div key={subFolder._id} >
                                    <div className="d-flex align-items-center ms-4" >
                                      <span className="d-flex p-0 folder-toggle align-items-center"  onClick={() => toggleExpand(subFolder._id)}>{isExpanded[subFolder._id] ? <RiArrowDownSLine /> : <RiArrowRightSLine />} </span>
                                      {parentFolder!==subFolder._id && (
                                      <span className="cursor-pointer text-nowrap" onClick={() => setParentFolder(subFolder._id)}> {subFolder.folderName}
                                      </span>
                                      )}
                                      {parentFolder===subFolder._id && (
                                      <span className="cursor-pointer fw-bold text-nowrap"> {subFolder.folderName}
                                      </span>
                                      )}
                                    </div>
                                      {/* <div className="d-flex col-3 cursor-pointer" onClick={() => setParentFolder(subFolder._id)}>
                                        {subFolder.folderName}
                                      </div> */}
                                  </div>

                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                        <form onSubmit={handleAddFolder} className="w-100 d-flex flex-column align-items-center p-3" >
                          <input
                            type="text"
                            id="folder-name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value) }
                            placeholder={t("Enter folder name")}
                            className="form-control"
                            required
                          />
                        </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" className="btn btn-primary" onClick={handleAddFolder}>Create Folder</button>
                    </div>

                    
                    {/* Mēģinājums pārtaisīt par recursive function */}

                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          {/* parentFolder only stores filder _id. To get folderName, find folder object by ID */}
                          {/* parentFolder === null
                          ? "My Files"
                          : ... */}
                          {folders.find(folder => folder._id ===parentFolder)?.folderName} <RiArrowRightSLine />  New folder
                        </h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>



                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/************************* LABĀ PUSE CATEGORIES **************************/}
        <div className="col-6">
          <h4>{t("Categories")}</h4>

          <div className="row g-3 mt-2">
            <div className="col-12 col-md-12 col-lg-4 col-xxl-4">
              <div className="file-box py-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#ff7e3955' }} >
                <FcPicture className="fs-2 me-2" />
                <h6 className="mb-0 text-nowrap">{t("Photos")}</h6>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4 col-xxl-4">
              <div className="file-box py-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#30cd0555' }}>
                <FcVideoCall className="fs-2 me-2" />
                <h6 className="mb-0 text-nowrap">{t("Videos")}</h6>
              </div>
            </div>

                      
            <div className="col-12 col-md-12 col-lg-4 col-xxl-4">
              <div className="file-box py-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#39dbff55' }}>
                <FcDocument className="fs-2 me-2" />
                <h6 className="m-0 text-nowrap">{t("Documents")}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/****************************MAPJU KONTEINERI******************************* */}

      <div className=" container-fluid mb-4">
        <h5 className="mb-3">Mapes</h5>
        <div className="row g-3">

        {folders
          .filter((folder) => folder.parent === null)
          .map((folder) => (
            <RecursiveFolder
              key={folder._id}
              folder={folder}
              folders={folders}
            />
          ))}

          {/* {folders?.filter((parentFolder) => parentFolder.parent === null).map((val) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 "
              key={val._id}
            >
              <div
                className=" d-flex align-items-center px-3 py-3 rounded-4 bg-light cursor-pointer"
              >

                <FcFolder size={30} />

                <span className="ms-3 flex-grow-1 text-start">
                  {val.folderName}
                </span>
                <div className="dropdown">
                  <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <HiDotsHorizontal />
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li>
                          <a className="dropdown-item d-flex align-items-center gap-3">
                            <HiOutlineDownload/> {t("Download")}
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item d-flex align-items-center gap-3">
                            <RiDeleteBinLine/> {t("Delete")}
                          </a>
                        </li>
                  </ul>
                </div>

              </div>
            </div>
          ))} */}

        </div>
      </div>
{/* 
      <div className="container ms-0 me-auto text-center mb-5">
        <div className="row row-cols-6 justify-content-start " >

          <div className="col-2">
            <div className="card rounded-4 overflow-hidden">
              <div className="card-body d-flex align-items-center justify-content-center gap-3">
                <FcFolder size="44px"  />
                <span>Nosaukums</span>
              </div>
            </div>
          </div>

        </div>
      </div> */}

      {/****************************FAILU SARAKSTS******************************* */}

      <h4 className="pb-3 ">{t("All files")}</h4>

      <div className="file-list shadow-sm ">
        <div className=" file-header-first row align-items-center px-4 py-2 border-bottom">
          <div className="col-auto">
            <input 
              type="checkbox"
              style={{ width: "20px", height: "20px" }}
              checked={file.length > 0 && checkedFiles.length === file.length}
              onChange={(e) =>{
                if(e.target.checked) {
                  setCheckedFiles(file.map((val) => val._id))
                  //From files array  [  { _id: "123", originalName: "apple.webp" },  { _id: "456", originalName: "bird.jpg" }] makes["123", "456", "789"]
                }else {
                  setCheckedFiles([]);
                }
              }}
              >
            </input>
            
          </div>
          {checkedFiles.length > 0 && (
          <div className="col">
            <div className="">            
              <div className=""
              type="button"
              htmlFor="move-item"
              data-bs-toggle="modal"
              data-bs-target="#moveFolderModal"
              style={{ cursor: "pointer" }}
              onClick={() => 
                checkedFiles.forEach((id)=>{
                  handleMove(id);
                })              
              }
              >
                {t("Move")}
              </div>
            </div>
            

              <div className="modal fade" id="moveFolderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div  className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Šis ir parvietošanas logs
                  </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

              </div>

              <div 
                className="col-auto" 
                type="button" 
                //checkedFiles is an array. Need to iterate through each
                onClick={() => {
                  checkedFiles.forEach((id)=>{
                  handleDelete(id);
                  })
                  console.log("Deleted files:", checkedFiles);  
                  //  setCheckedFiles([]); nevajag, johandle delete jau noņem.
               
                }}>
                {t("Delete")}
              </div>
          </div>
          )}
        </div>
        <div className="file-header">
          <span></span>
          <span></span>
          <span>{t("tableName")}</span>
          <span>{t("Size")}</span>
          <span>{t("Modified")}</span>
          <span>{t("Actions")}</span>
        </div>

        {file?.map((val) => (
          <div className="file-row" key={val._id}>
            <input
              type="checkbox"
              value={val._id}
              checked={checkedFiles.includes(val._id)}
              onChange={(event) => {handleFileSelect(event)}}
              style={{ width: "20px", height: "20px" }}>
            </input>
            {val.starred ? (
              <ImStarFull size={20} onClick={(event) => handleStarred(event, val._id, val.starred)}/>
            ) : (
              <ImStarEmpty size={20}  onClick={(event) => handleStarred(event, val._id, val.starred)}/>
            )}
            <div>
              {val.originalName}
            </div>
            <span>
              {(val.size / 1024).toFixed(1)} KB
            </span>
            <span>
              {new Date(val.createdAt).toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <HiDotsHorizontal />
                </button>
                 <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a className="dropdown-item d-flex align-items-center gap-3" onClick={() => handleDownload(val._id)}><HiOutlineDownload/> {t("Download")}</a>
                  </li>
                  <li>
                  <a 
                  type="button" 
                  className="dropdown-item d-flex align-items-center gap-3"
                  onClick={() => {
                  console.log("Deleted file:", val);
                  handleDelete(val._id);
                  }}><RiDeleteBinLine />{t("Delete")}</a>
                  </li>
                  <li>
                    <a className="dropdown-item" type="button" onClick={() => handleView(val._id)}>
                      {t("Open here")}
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" type="button" onClick={() => handleView(val._id)}>
                      {t("Open in new tab")}
                    </a>
                  </li>
                </ul>
            </div>

          </div>
        ))}
      </div> 
    </main>
  </div>
);
}
export default Home;