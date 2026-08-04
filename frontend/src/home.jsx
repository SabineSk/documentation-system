

import {Link, Outlet} from 'react-router-dom';
import { useState } from 'react';
//import {useAuth} from './auth/useAuth';

function Home() {

const [error, setError] = useState(null);
const [processing, setProcessing] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [message, setMessage] = useState("");
const [status, setStatus] = useState("");



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
    
    console.log(message); 

  }catch (err)
  {console.log(err);
    setError("Could not upload files");
  }finally{
    setProcessing(false);
  }
  }

  //const {user} = useAuth();
 return (
  <div className="file-content">
    <div className="file-container">
      <form onSubmit={onSubmit} id="form" method="post" enctype="multipart/form-data">

        <div className="input-group">
          <label htmlFor="files">Select files</label>

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          multiple
        />
        </div>

        <button type="submit" disabled={processing}>
          {processing ? "Uploading..." : "Upload"}
        </button>

      </form>
    </div>
  </div>
);}


export default Home;

