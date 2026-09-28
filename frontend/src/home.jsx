import FileUpload from "./components/files/FileUpload";
// import Footer from "./footer.jsx";
import Sidebar from "./components/files/sidebar";
import { useParams } from "react-router-dom";

function Home() {
  const { id } = useParams();
  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100">

      <div className="d-flex flex-grow-1">
        <div>
          
          <Sidebar/>
          
        </div>
        <main className="flex-grow-1 px-4">
          <FileUpload folderId={id}/>
        </main>
      </div>
    </div>
  );
}

export default Home;



