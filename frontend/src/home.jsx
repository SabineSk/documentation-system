import {Link, Outlet} from 'react-router-dom'
//import {useAuth} from './auth/useAuth';

function Home() {
  //const {user} = useAuth();
  return ( 
    <div className="content">
      <>
      <h2> Home Page </h2>
      <nav className="home-nav">
        <Link to="/userTable"> Find users</Link>
        <Link to= "/addFile">Add a file</Link>
      </nav>
      <Outlet />
      </>
    
    </div>

   );
}

export default Home;


