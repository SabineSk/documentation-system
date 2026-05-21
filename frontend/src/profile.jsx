
import { useState, useEffect } from "react";
function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const getMe = async (e) => {
      const response = await fetch("/api/me", {
        method: "GET",
        credentials: "include" // Include cookies in the request
      });

      const data = await response.json();
      // ja nesanak iegut datus, novirzam uz /login
    //   if (data.status === 'error') {
    //     setError('nepareiza parole vai lietotājvārds');
    //     return;
    //   }
      console.log("Got my info successful:", data);
      setUsername(data.user.username);
      setLoading(false);
    // react router to home page or ex: props.history.push('/home');
  };
  
   useEffect(() => {
    getMe();
   }, []);

   if (loading) {
    return <p>Loading...</p>;
   }

    return (
        <div>
            <p>This is your profile: {username}</p>
        </div>
    )
}

export default Profile;