

import {Link, Outlet} from 'react-router-dom';
import { useState } from 'react';
//import {useAuth} from './auth/useAuth';

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  //const {user} = useAuth();
  return ( 
    <div className="content">
      <>
      <nav className="nav">
        
        <button onClick={() => setShowPopup(true)}>Add a file</button>

      </nav>
      <Outlet />
      </>
    
    </div>

   );
}

export default Home;

