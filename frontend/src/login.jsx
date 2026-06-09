import { useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {Navigate} from "react-router-dom";
import {useAuth} from './auth/useAuth';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const {isAuthenticated} = useAuth();
  const [type, setType] = useState('password');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
      setProcessing(true);
      setError(null);

      try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password})
      });

      const data = await response.json();

      if (data.status === 'error') {
        setError('nepareiza parole vai lietotājvārds');
        return;
      }

      console.log("Login successful:", data);
      setUsername("");
      setPassword("");
      setError(null);

    navigate("/profile");
  
    // react router to home page or ex: props.history.push('/home');
    } catch (err) 
    { setError(err.message);
    }finally {
      setProcessing(false);
    }
  };
  
  if (isAuthenticated){
    return <Navigate to="/Home" replace/>
  }

  const handleToggle = () => {
    setType(type ==='password' ? 'text': "password" );
  };

  

  return (
    <div className="login">
      
        <div className="login-form">
          <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div className="login-form-group">
                <label htmlFor="username">Username: </label>
                <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                </div>
                
                <div className="login-form-group">
                <label htmlFor="password">Password: </label>
                <input 
                    type={type}
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <span onClick={handleToggle}>
                  {type === "password" ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>   
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <button type="submit" disabled={processing}>
                {processing ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    </div>
  );
}

export default Login;