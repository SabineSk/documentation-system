import { Link } from "react-router-dom";

function Sidebar() {
  return (

    <aside
      className="sidebar p-3 h-100"
      style={{ width: "200px", flexShrink: 0 }}
    >
    
      <p className="small mb-2">FILES</p>

      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <Link className="nav-link">
            My Files
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/folders">
            Folders
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/recent">
            Recent
          </Link>
        </li>
      </ul>

      <p className=" small mb-2">SHARING</p>

      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <Link className="nav-link" to="/shared-with-me">
            Shared with me
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/shared-by-me">
            Shared by me
          </Link>
        </li>
      </ul>

      <p className=" small mb-2">ORGANIZE</p>

      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <Link className="nav-link" to="/starred">
            Starred
          </Link>
        </li>
        <li >
          <Link className="nav-link">
            Tags
          </Link>
        </li>
      </ul>

      <p className="small mb-2">OTHER</p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/trash">
            Trash
          </Link>
        </li>
      </ul>

    </aside>

  );
}

export default Sidebar;