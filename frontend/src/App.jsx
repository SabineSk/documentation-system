import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { useState } from "react";

function Home() {
  return ( 
    <div>
      <h1>Home</h1>
      <p>Welcome! Please sign up or log in to access your documentation.</p>
    </div>

   );
}

function Signup() {
  return ( <h1>Sign Up</h1> );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
      setProcessing(true);
      setError(null);

      try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);
      setUsername("");
      setPassword("");
      setError(null);
  
    // react router to home page or ex: props.history.push('/home');
    } catch (err) 
    { setError(err.message);
    }finally {
      setProcessing(false);
    }
  };
  
  return (
    <>
      <h2>Login</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={processing}>
          {processing ? "Logging in..." : "Login"}
        </button>
      </form>

    </>
  );
}


function App() {
  return (
    <BrowserRouter>
        <h1>Documentation System</h1>

        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/signup">Sign Up</Link> |{' '}
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;