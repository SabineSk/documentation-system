import { useEffect, useState } from 'react';

function App() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/documents')
      .then(res => res.json())
      .then(data => setDocuments(data));
  }, []);

  return (
    <>
      <h1>Documentation System</h1>

      <nav>
        <a href="#">Home</a>
        <a href="#">Documents</a>
        <a href="#">Login</a>
      </nav>

      <h2>Recent Documents</h2>

      {documents.map(doc => (
        <div key={doc.id}>
          <h3>{doc.title}</h3>
          <p>{doc.description}</p>
        </div>
      ))}
    </>
  );
}

export default App;