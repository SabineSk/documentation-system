import {Link, Outlet} from 'react-router-dom'
//import {useAuth} from './auth/useAuth';

function Home() {
  //const {user} = useAuth();
  return ( 
    <div class="content">
      <>
      <h2> Home Page </h2>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/userTable"> Find users</Link> | {' '}
        <Link to= "/addDocument">Add document</Link>
      </nav>
      <Outlet />
      <ul>
        <li>
          Some text for user
        </li>
      </ul>
      </>
    
    </div>

   );
}

export default Home;


