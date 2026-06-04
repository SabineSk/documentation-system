

import {Link, Outlet} from 'react-router-dom';
import { useState } from 'react';
//import {useAuth} from './auth/useAuth';

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  //const {user} = useAuth();
  return ( 
    <div className="content">
      <>
      <h2> Home Page </h2>
      <nav className="nav">
        <Link to="/userTable"> Find users</Link>
        <button onClick={() => setShowPopup(true)}>Add a file</button>

        {showPopup && (
          <>
            <div className="overlay" onClick={() => setShowPopup(false)}></div>
              <form className="fileUploadForm" method="post" encType="multipart/form-data">
                <div>
                    <label htmlFor="file">Choose file to upload </label>
                    <input type="file" id="file" name="file" multiple />
                </div>
                <button>Submit</button>
              </form>
          </>
        )}

      </nav>
      <Outlet />
      </>
    
    </div>

   );
}

export default Home;


// import {Link, Outlet} from 'react-router-dom';
// import { useState } from 'react';

// function Home() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");
//   const [processing, setProcessing] = useState(false);
  
  // const uploadFile = async (e) => {
  //   e.preventDefault();
  //   setStatus("");
  //   setProcessing(true);

  // if (!file) {
  //     setStatus("Please select a file.");
  //     return;
  //   }
  
  //  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  //   if (file.size > maxSize) {
  //       setStatus('File too large.');
  //       return;
  //   }

  //   // FormData sagatavo datus tādā formātā, 
  //   // kādu izmanto failu sūtīšanai no formas.
  //   const formData = new FormData();
  //   formData.append("file", file);  // JO backend upload.single('file') gaida formā laiku ar nosaukumu 'file'
  //    try {
  //       setProcessing(true);
  //       setStatus("Uploading...");
  //       const response = await fetch(
  //           "api/users/upload",
  //           {
  //               method: "POST",
  //               body: formData,
  //           },
  //       );

  //       const data = await response.json();

  //       if (!response.ok) {
  //           const result = await response.json();
  //           setStatus(`Upload failed: ${result.message}`);
  //       } else {
  //           setStatus("Upload successful!");
  //       }
  //       } catch (error) {
  //       setStatus(`Network error: ${error.message}`);
  //       } finally {
  //           setProcessing(false);
  //       }
  // };  


//   return ( 
//     <div className="content">
//       <>
//       <h2> Home Page </h2>
//       <nav className="home-nav">
//         <Link to="/userTable"> Find users</Link>
//         <button onClick={() => setShowPopup(true)}>Add a file</button>

//         {showPopup && (
//           <>
//             <div className="overlay" onClick={() => setShowPopup(false)}></div>
//               <form className="fileUploadForm" method="post" encType="multipart/form-data">
//                 <div>
//                     <label htmlFor="fileInput">Choose file to upload </label>
//                     <input type="file" id="fileInput" name="file" multiple />
                    
//                 </div>
//                 <button id="uploadBtn" onClick={uploadFile}>Upload</button>
//                 <progress id="progressBar" value="0" max="100" style="display: none"></progress>
//               </form>
//           </>
//         )}

//       </nav>
//       <Outlet />
//       </>
    
//     </div>

//    );
// }

// export default Home;
