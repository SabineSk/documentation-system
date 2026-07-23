
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import {useTranslation} from "react-i18next";


function UserTable() {

      // const [filterBy, setFilterBy] = useState("");
      // const [searchTable, setSearchTable] = useState(""); //mainās pēc katra ievadītā simbola
      // const [submitSearch, setSubmitSearch] = useState(false); //mainīsies pēc pogas nospiešanas
      const [users, setUsers ] = useState([]);
  
      const [message, setMessage] = useState("");
      const [status, setStatus] = useState("");
      const [showPopup, setShowPopup] = useState({
        type: null,
        user: null
      });

      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [totalCount, setTotalCount] = useState('');
      const [rowLimit, setRowLimit] = useState(10);
      const currentlyShowing = users.length;

      const [usernameInput, setUsernameInput] = useState("");
      const [roleInput, setRoleInput] = useState("");

      const [submittedUsername, setSubmittedUsername] = useState("");
      const [submittedRole, setSubmittedRole] = useState("");

      // const [newFilter, setNewFilter] = useState({
      //   username: "",
      //   role: ""
      // });
      const [newFilterName, setNewFilterName] = useState("");
      const [savedFilters, setSavedFilters] = useState([]);


      const [error, setError] = useState(null);
      const [processing, setProcessing] = useState(false);




      const { t, i18n } = useTranslation();


      const handleAddFilter = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try{
          const response = await fetch("/api/users/addFilter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                  newFilterName,
                  newFilter: {
                    username: usernameInput,
                    role: roleInput
                  }
                })
            });


          const {data, status, message} = await response.json();

          setMessage(message);
          setStatus(status);
          console.log(message);

          if (status === 'error') {
          setError('Kļūda, pievienojot filtru');
          return;
          }   
          
          setUsernameInput("");
          setRoleInput("");
          setNewFilterName("");
          setError(null);

          await getFilters();

    

          }catch(err)
          {console.log(err);

          }finally{
            setProcessing(false);
          }
          }
      
        async function getFilters(){
          try{
          const response = await fetch(`/api/users/listFilters`, {
          //Content-Type nav vajadzīgs, jo nesūta JSON body
          method: "GET",
          credentials:'include'
          });

          const {data, status, message} = await response.json();
          setMessage(message);
          setStatus(status);

          if (status === 'success') {
            setSavedFilters(data)
          } else {
            setSavedFilters([])
          }
        }catch (error) {
      console.log(error);
      setSavedFilters([]);
      setError("Neizdevās ielādēt saglabātos filtrus");
    }}

    useEffect(() => {
    
      getFilters();
    }, []);


      useEffect(() => { 
        async function getUsers() {
          // const response = await fetch(`/api/users/list?page=${currentPage}&limit=${rowLimit}&search=${submitSearch}&filter=${filterBy}`, {
          //pārvērš filter masīvu par JSON stringu, lai varētu nosūtīt kā query parametru
          // const filtersString = encodeURIComponent(JSON.stringify(submittedFilters));
          const response = await fetch(`/api/users/list?page=${currentPage}&limit=${rowLimit}&username=${encodeURIComponent(submittedUsername)}&role=${encodeURIComponent(submittedRole)}`, {  
          method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials:'include'
          });
          const {data, status, message} = await response.json();
            setMessage(message);
            setStatus(status)
  
          const {users, page, limit, totalCount, totalPages} = data;
          if (status === 'success') {
            setUsers(users);
            setTotalPages(totalPages);
            setTotalCount(totalCount);
          } else {
            setUsers([])
          }
        }
    
      getUsers();
    }, [currentPage, rowLimit, submittedUsername, submittedRole]);


    const handleDelete = async(userID) =>{
      //frontend sūta delete pieprasijumu ar id
      const response = await fetch(`/api/users/${userID}`, {
        method: "DELETE",
        credentials: 'include'
      });

      const data = await response.json();
      if(data.status === 'success'){
        //atjauno ekrānu ar filtru
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userID));
      }
      
      setShowPopup({type: null, user: null})
    };


    //Sākumā useState({ key: null, direction: 'asc' })
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    //Creating sorted copy
    // const sortedData = [...filteredData].sort((a,b) => {
    const sortedData = [...users].sort((a,b) => {

      if (!sortConfig.key) return 0

      //paņem divu lietotāju vērtību
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      //CreatedAt and UpdatedAt text to date
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt' ){
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      //salīdzina kura vērtība lielāka/mazāka , tad atbilstoši pievieno augstāk, zemāk.
      if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }

      //neko nemaina, ja abas vērtības vienādas.
      return 0
    });

    //Pirmo reizi spiežot sort username, tad handleSort("username")
    const handleSort = (key) => {
      //ja pirmajā reizē null === "username" ir false, tad direction kļūst 'asc'
      //otro reizi, sortConfig = { key: "username", direction: "asc" } un "username" === "username" && "asc" === "asc" tādēļ kļūst 'desc'
      setSortConfig({
        key,
        direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
      })
    };

    const handleLimitChange = (e) => {
      setRowLimit(Number(e.target.value));
    };


    const handleClearFilter = () => {
        setUsernameInput("");
        setRoleInput("");

        setSubmittedUsername("");
        setSubmittedRole("");

        setCurrentPage(1);
      };

    //izsauc, kad tiek iesniegta forma
    const handleSearchSubmit = (e) => {
      e.preventDefault();  //aptur lpas pārlādi, lai varētu saglabāt filtrus un izsaukt API pieprasījumu
      
      setSubmittedUsername(usernameInput);
      setSubmittedRole(roleInput);
      setCurrentPage(1);

    };

    // *********************************** PABEIGT **********************************************
    const handleUseSavedFilter = (name) => {
      alert(`Jūs uzklikšķinājāt uz: ${name}`);

    }

  
  return (
    <div className='content'>
      <div id="usertable-forms">
      
        <form onSubmit={handleSearchSubmit} className="usertable-form">
            <div>
              
            </div>

            <div className="filter-fields">             
              <div className="filter-field">
                <label htmlFor="username-filter">Lietotājvārds:  </label>
                <input
                  type="text"
                  name="username"
                  id="username-filter"
                  value={usernameInput}
                  placeholder={t('BttnSearch')}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>

              <div className="filter-field">
                <label htmlFor="role-filter">Loma: </label>
                <input
                    type="text"
                    name="role"
                    id="role-filter"
                    value={roleInput}
                    placeholder={t('BttnSearch')}
                    onChange={(e) => setRoleInput(e.target.value)}
                  />
              </div>
            </div>
            <div > 
              <div className="filter-field">
                <label>Filtra nosaukums: </label>
                <input
                    type="text"
                    name="filterName"
                    id="filterNameID"
                    value={newFilterName}
                    onChange={(e) => setNewFilterName(e.target.value)}
                />
              </div>
              

              <div className="filter-actions">
                <button type="button" onClick={handleAddFilter}>Saglabāt filtru</button> 
                <button type="button" onClick={handleClearFilter}>{t('Clear Filter')}</button>
                <button type="submit">{t('Submit')}</button>
              </div>

              
            </div>
        </form>
 
        {/* <div className="usertable-form" >
            <h3>Saglabātie filtri</h3>
            <table>
              <thead>
                <tr>
                  <th>
                    Nosaukums
                  </th>
                  <th>
                    Lietotājvārds
                  </th>                
                  <th>
                    Loma
                  </th>
                </tr>
              </thead>
              <tbody>
                {savedFilters.map((savedFilter, index) => (
                  <tr key={index} className="saved-filter" onClick={() => handleUseSavedFilter(savedFilter)}>
                    <td>{savedFilter.name}</td>
                    <td>{savedFilter.filters?.username}</td>
                    <td>{savedFilter.filters?.role}</td>
                  </tr>
                )
              )}
              </tbody>
            </table>
        </div>
         */}
      </div>

      <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p>
      <div className="table-wrapper">
      <table id="userTable">
        <thead className='thead'>
            <tr>
              <th>
                <div className="th-content">
                  <span>ID</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('_id')} style={{ cursor: 'pointer', }} />
                  {/* <CiFilter className="sort-icon"/> */}
                </div>
              </th>

              <th>
                <div className="th-content">
                  <span>{t('username')}</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('username')}/>
                  {/* <CiFilter className="sort-icon" id="dropdown-filter" /> */}
                  
                </div>
              </th>

              <th>
                  <div className="th-content">
                  <span>{t('role')}</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('role')}/>
                  {/* <CiFilter className="sort-icon"/> */}
                </div>
              </th>

              <th>
                <div className="th-content">
                  <span>{t('Created at')}</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('createdAt')}/>
                </div>
              </th>

              <th>
                <div className="th-content">
                  <span>{t('Updated at')}</span>
                  <FaSort className="sort-icon" onClick={() => handleSort('updatedAt')}/>
                </div>
              </th>

              <th>{t('Edit')}</th>

              <th>{t('Delete')}</th>
          </tr>          
        </thead>
        <tbody className="tbody">    
          {sortedData?.map((val, key) => (
              <tr key = {key}>
              <td>{val._id}</td>
              <td>{val.username}</td>
              <td>{val.role}</td>
              <td>{val.createdAt}</td>
              <td>{val.updatedAt}</td>
                <td>
                <button onClick={() => setShowPopup({type: "edit", user: val})}>
                  {t('Edit')}
                </button>
              </td>
              <td>
                <button onClick={() => setShowPopup({type: "delete", user: val})}>
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="pagPages">
        <div className="row-count-select">
            <label htmlFor="row-select"> {t('row-select')}</label>
            <select 
                className="selectPagination"
                value={rowLimit}
                onChange={(e) => {
                  setRowLimit(e.target.value);
                  setCurrentPage(1);
                }}
            > 
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </div>
        <span className="totalCount">{t('totalRows', { currentlyShowing, totalCount })}</span>
        <button
          className="pagArrow"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>

        <span>{currentPage} / {totalPages}</span>

        <button
          className="pagArrow"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>


      {showPopup.type == "edit" && (
        <>
          <div className="overlay" onClick={() => setShowPopup({type: null, user: null})}></div>
            <form className="fileUploadForm" method="post" encType="multipart/form-data">
              <p>{t('Edit')} {showPopup.user?.username} ?</p>
              <p>ID: {showPopup.user?._id}</p>
              {/* userParams() ļauj userEdit.jsx nolasīt id no URL  */}
              <Link className="button-yes" to={`/userEdit/${showPopup.user._id}`}> YES </Link>

              <Link className="button-no" type="button" onClick={() => setShowPopup({type: null, user: null})}>
                {t('no')}
              </Link>
            </form>
        </>
      )}

      {showPopup.type == "delete" && (
        <>
          <div className="overlay" onClick={() => setShowPopup({type: null, user: null})}></div>
          <form className="fileUploadForm" method="post" encType="multipart/form-data">
              <p>{t('Delete')} {t('username')}?</p>
              <p>{t('username')}: {showPopup.user?.username}</p>
              <p>ID: {showPopup.user?._id}</p>
              <button type="button" onClick={() => handleDelete(showPopup.user._id)}>
                {t('yes')}
              </button>
              <button type="button" onClick={() => setShowPopup({type: null, user: null})}>
                {t('no')}
              </button>
          </form>
        </>
      )}
    </div>
  );
}

export default UserTable ;

