import {Link, Outlet} from 'react-router-dom';
import { useState, useEffect } from "react";
//import {useAuth} from './auth/useAuth';
import { IoCloudUploadOutline } from "react-icons/io5";
import { HiOutlineFolderAdd } from "react-icons/hi";
import { RiTeamLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import { FcPicture } from "react-icons/fc";
import { FcVideoCall } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
import { HiDotsHorizontal } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
import { useTranslation } from "react-i18next";

function Home() {

const [error, setError] = useState(null);
const [processing, setProcessing] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [message, setMessage] = useState("");
const [status, setStatus] = useState("");
const [file, setFile] = useState([]);
const [checkedFiles, setCheckedFiles] = useState([]);
const [slectedCategory, setSelectedCategory] = useState();
const { t, i18n } = useTranslation();




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

// const fetchFiles = async (category) => {
//   try {
//     const response = await fetch('/api/files/list', {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: 'include'
//     });

//     const { data, status, message } = await response.json();

//     setMessage(message);
//     setStatus(status);

//     if (status === 'success') {
//       setFile(data);
//     } else {
//       setFile([]);
//     }

//   } catch (err) {
//     console.log(err);
//     setFile([]);
//   }

// };

//strādājošais bez kategorijām
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

useEffect(() => {
  fetchFiles();
}, []);


const handleFileSelect = async(event)=>{
  const checkedIds = event.target.value;
if(event.target.checked){
  setCheckedFiles([...checkedFiles, checkedIds])
}else{
  setCheckedFiles(checkedFiles.filter(id=>id!==checkedIds))
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

//Test for unchecking files. 
// useEffect(() => {
//   console.log("checkedFiles changed:", checkedFiles);
// }, [checkedFiles]);




return (
  <div className="container-fluid p-0" >
    <main className="col-12">
      <div className="row align-items-start mb-4 py-3">

        {/******************************************* KREISĀ PUSE UPLOAD ********************************************/}
        <div className="col-6 mt-1">
          <div className="row g-3">

            <div className='col-12 col-md-12 col-lg-6 col-xl-6 '>
              <div className="simple-box h-100 w-100 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center m-0 p-0" style={{ backgroundColor: '#e0a4f255' }}>
                <form onSubmit={onSubmit} className="w-100 flex-column align-items-center p-3" >
                  <label htmlFor="file-upload">
                    <IoCloudUploadOutline />
                    <h6>Upload file</h6>
                    <input
                      id="file-upload"
                      type="file"
                      className="file-input"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </label>
                  {selectedFile && (
                    <small>{selectedFile.name}</small>
                  )}
                  <button
                    type="submit"
                    className="upload-button w-100"
                    disabled={!selectedFile || processing}
                  >
                    {processing ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
            </div>

            <div className='col-12 col-md-12 col-lg-6 col-xl-6 '>
              <div className="simple-box h-100 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#e0a4f255' }}>
                <HiOutlineFolderAdd />
                <h6>New folder</h6>
              </div>
            </div>
          </div>
        </div>
        

        {/************************* LABĀ PUSE CATEGORIES **************************/}
        <div className="col-6">
          <h4>Categories</h4>

          <div className="row g-3 mt-2">
            <div className="col-12 col-md-12 col-lg-4 col-xxl-4">
              <div className="file-box py-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#ff7e3955' }} >
                <FcPicture className="fs-2 me-2" />
                <h6 className="mb-0 text-nowrap">Photos</h6>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4 col-xxl-4">
              <div className="file-box py-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#30cd0555' }}>
                <FcVideoCall className="fs-2 me-2" />
                <h6 className="mb-0 text-nowrap">Videos</h6>
              </div>
            </div>

                      
            <div className="col-12 col-md-12 col-lg-4 col-xxl-4">
              <div className="file-box py-4 rounded-4 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#39dbff55' }}>
                <FcDocument className="fs-2 me-2" />
                <h6 className="m-0 text-nowrap">Documents</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/****************************FAILU SARAKSTS******************************* */}

      <h4 className="pb-3 ">All files</h4>

      <div className="file-list shadow-sm ">
        <div className=" file-header-first row align-items-center px-4 py-2 border-bottom">
          <div className="col-auto">
            <input 
              type="checkbox"
              style={{ width: "20px", height: "20px" }}
              // onClick={() =>} 
              >
            </input>
          </div>
          {checkedFiles.length > 0 && (
            <>            
              <div className="col-auto">
                Move
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
          </>
          )}
        </div>
        <div className="file-header">
          <span></span>
          <span>Name</span>
          <span>Size</span>
          <span>Modified</span>
          <span>Actions</span>
          
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
            {/* <div
            className="collapse navbar-collapse justify-content-end"
           >
              <ul className="">
                <li className="nav-item dropdown">
                  <button
                    type="button"
                    className="btn btn-light">
                    <HiDotsHorizontal />
                  </button>
                </li>
              </ul>
            </div> */}
            <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <HiDotsHorizontal />
                </button>
                 <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item d-flex align-items-center gap-3"><HiOutlineDownload /> {t("Download")}</a></li>
                  <li><a 
                  type="button" 
                  className="dropdown-item d-flex align-items-center gap-3"
                  onClick={() => {
                  console.log("Deleted file:", val);
                  handleDelete(val._id);
                }}><RiDeleteBinLine />{t("Delete")}</a></li>
                <li><a class="dropdown-item" href="#">{t("Open in new tab")}</a></li>
                
                </ul>
            </div>
            

              {/* <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  console.log("Deleted file:", val);
                  handleDelete(val._id);
                }}>
                <RiDeleteBinLine />
              </button> */}

          </div>
        ))}
      </div> 
    </main>
  </div>
);
}
export default Home;