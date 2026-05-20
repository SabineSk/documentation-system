import { useState } from "react";

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
      const response = await fetch("http://localhost:3000/api/auth/login", {
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
        <div className="login">
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
        </div>
    </>
  );
}

export default Login;