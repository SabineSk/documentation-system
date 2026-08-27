import FileUpload from "./components/files/FileUpload";
// import Footer from "./footer.jsx";
import Sidebar from "./components/files/sidebar";

function Home() {
  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100">

      <div className="d-flex flex-grow-1">
        <div>
          
          <Sidebar/>
          
        </div>
        <main className="flex-grow-1 px-4">
          <FileUpload />
        </main>
      </div>
    </div>
  );
}

export default Home;



