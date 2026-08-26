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

function Home() {

const [error, setError] = useState(null);
const [processing, setProcessing] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [message, setMessage] = useState("");
const [status, setStatus] = useState("");
const [file, setFile] = useState([]);
const [checkedFiles, setCheckedFiles] = useState([]);
const [slectedCategory, setSelectedCategory] = useState();




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


const handleFileSelect = async()=>{

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
    }
};


return (
<div className="container-fluid p-0" >
    {/* Galvenais saturs */}
    <main className="col-12">
    
    <div className="d-flex align-items-start gap-5 mb-4 py-3 flex-wrap">

    
      {/* KREISĀ PUSE */}
      <div className="d-flex gap-4">

        <div className="simple-box">
          <form onSubmit={onSubmit}>
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
              className="upload-button"
              disabled={!selectedFile || processing}
            >
              {processing ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        <div className="simple-box">
          <HiOutlineFolderAdd />
          <h6>New folder</h6>
        </div>

      </div>


      {/* LABĀ PUSE */}
      <div className="categories-container">
        <h4>Categories</h4>

        <div className="d-flex gap-4 mt-4">

          <div className="file-box p-4 rounded-4 shadow-sm">
            <FcPicture className="fs-2 me-2" />
            <h6 className="d-inline-block">Photos</h6>
          </div>

          <div className="file-box p-4 rounded-4 shadow-sm">
            <FcVideoCall className="fs-2 me-2" />
            <h6 className="d-inline-block">Videos</h6>
          </div>

          <div className="file-box p-4 rounded-4 shadow-sm">
            <FcDocument className="fs-2 me-2" />
            <h6 className="d-inline-block">Documents</h6>
          </div>
        </div>
      </div>

    </div>

      <h4 className="pb-3 ">All files</h4>

      <div className="file-list shadow-sm ">
        <div className="file-header">
          <span>
            <input 
            type="checkbox">
            </input>
          </span>
          <span>Name</span>
          <span>Size</span>
          <span>Modified</span>
          <span>Actions</span>
        </div>

        {file?.map((val) => (
          <div className="file-row" key={val._id}>
            
            <input
              type="checkbox"
              checked={checkedFiles.includes(val._id)}
              onChange={() => handleFileSelect(val._id)}
            />
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

            <div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  console.log("Deleted file:", val);
                  handleDelete(val._id);
                }}
              >
                <RiDeleteBinLine />
              </button>
            </div>

          </div>
        ))}



      </div>




  {/* <div className="file-list">
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
        checked={checkedFiles.includes(val._id)}
        onChange={() => handleFileSelect(val._id)}
      />

      <span>{val.originalName}</span>

      <span>
        {(val.size / 1024).toFixed(1)} KB
      </span>

      <span>
        {new Date(val.createdAt).toLocaleDateString('en-EN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => handleDelete(val._id)}
      >
        <RiDeleteBinLine />
      </button>
    </div>
  ))}
</div> */}
          
    </main>
  </div>
);

}
export default Home;