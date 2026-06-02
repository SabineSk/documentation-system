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
      <nav className="home-nav">
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


