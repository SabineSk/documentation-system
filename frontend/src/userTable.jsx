
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import {useTranslation} from "react-i18next";
import {useAuth} from './auth/useAuth';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";


function UserTable() {
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

      const [newFilterName, setNewFilterName] = useState("");
      const [savedFilters, setSavedFilters] = useState([]);

      const [error, setError] = useState(null);
      const [processing, setProcessing] = useState(false);

      const [showAddFilterName, setShowAddFilterName] = useState(false);
      const [hideFilterName, setHideFilterName] = useState(false);

      const { t, i18n } = useTranslation();


      


      // *********************************** FILTERS **********************************************

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
          }
        }

      useEffect(() => {
        getFilters();
      }, []);

      const handleClearFilter = () => {
        setUsernameInput("");
        setRoleInput("");
        setSubmittedUsername("");
        setSubmittedRole("");
        setCurrentPage(1);
      };
        
      const handleUseSavedFilter = (savedFilter) => {
        setSubmittedUsername(savedFilter.filters?.username);
        setSubmittedRole(savedFilter.filters?.role);
        setCurrentPage(1);
      };

      const handleRemoveSavedFilter = async(filterID) => {
        try {
          const response = await fetch(`/api/filters/removeFilter/${filterID}`, { //frontend sūta delete pieprasijumu ar id
            method: "DELETE",
            credentials: 'include'
        });

        const { status, message } = await response.json();
        setMessage(message);
        setStatus(status);

        if(status === 'success'){
          //atjauno ekrānu ar filtru
          setSavedFilters((prevFilters) => prevFilters.filter((savedFilter) => savedFilter._id !== filterID));
        }
      
        }catch(error) {
          console.error("Neizdevās izdzēst filtru:", error);
          setError("Neizdevās izdzēst saglabāto filtru");
        }
      };

      //izsauc, kad tiek iesniegta forma
      const handleSearchSubmit = (e) => {
        e.preventDefault();  //aptur lapas pārlādi, lai varētu saglabāt filtrus un izsaukt API pieprasījumu
        
        setSubmittedUsername(usernameInput);
        setSubmittedRole(roleInput);
        setCurrentPage(1);

      };


// ****************************************USERS*************************************************************************
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
    }, [currentPage, rowLimit, submittedUsername, submittedRole, ]);


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
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  // ***************************************Add user****************************************************

    const [type, setType] = useState('password');
    
    const [showAddNewUser, setShowAddNewUser] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newRole, setNewRole] = useState("");
    
     const onSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch ("/api/users/addUser", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({newUsername, newPassword, newPasswordConfirm, newRole})
        });

        const {data, status, message} = await response.json();
        setMessage(message);
        setStatus(status);
        console.log(message);

        if (status === 'error') {
            setError(t("errorAddingUser"));
            return;
        }
        console.log(t("UserAdded"), data);
        setNewUsername("");
        setNewPassword(""); 
        setNewPasswordConfirm("");
        setNewRole("");
        setError(null);

        }catch (err)
        {console.log(err);
          setError(t("errorAddingUser"));
        }finally{
          setProcessing(false);
        }
      }

    const handleToggle = () => {    //Paslpēpt/atklāt paroli
        setType(type ==='password' ? 'text': "password" );
    };

    if(processing){
        return <div></div>
    }
    


    const handleShowAddUser = () => {
      setShowAddNewUser((previousValue) => !previousValue);
    };


    const handleShowFilterName = () => {
      setShowAddFilterName(true);
    };

    // mouseout

    const handleHideFilterName = () => {
      setShowAddFilterName(false);
    };




  
  return (
    <div className='user-content'>
      <div id="usertable-forms">

        <form onSubmit={handleSearchSubmit} className="usertable-form">
            <div className="saved-filter-container">
              {savedFilters.map((savedFilter) => (
                <div key={savedFilter._id} className="saved-filter">
                 
                  <div onClick={() => handleUseSavedFilter(savedFilter)}>
                    {savedFilter.name}
                    
                  </div>
                  <button  type="button" onClick={() => handleRemoveSavedFilter(savedFilter._id)}>
                    <RiDeleteBinLine id="filteDeleteBttn"/>
                  </button>
                </div>

              ))}
            </div>

            <div className="filter-fields">             
              <div className="filter-field">
                <label htmlFor="username-filter">{t('username')}: </label>
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
                <label htmlFor="role-filter">{t('role')}: </label>
                <input
                    type="text"
                    name="role"
                    id="role-filter"
                    value={roleInput}
                    placeholder={t('BttnSearch')}
                    onChange={(e) => setRoleInput(e.target.value)}
                  />
              </div>
              <div className="filter-actions">
                <div    
                  onMouseOver={handleShowFilterName} 
                  onMouseOut={handleHideFilterName}
                  classname="filter-container"
                  > 
                  <button 
                    id="saveFilterButton" 
                    type="button" 
                    onClick={handleAddFilter}
                  >
                    {t('Save Filter')}
                  </button>                 

                  {showAddFilterName && (
                    <div className="input-wrapper">
                      <input
                        type="text"
                        maxLength={100}
                        name="filterName"
                        id="filterNameID"
                        placeholder={t('Filter name')}
                        value={newFilterName}
                        onChange={(e) => setNewFilterName(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <button type="button" onClick={handleClearFilter}>{t('Clear Filter')}</button>
                <button type="submit">{t('Submit')}</button>
              </div>

            </div>
        </form>          
        
        <button 
          type="button" 
          id="addUserButton" 
          onClick={handleShowAddUser}>
          + {t('Add user')}
        </button>

        {showAddNewUser && (
          <form onSubmit={onSubmit} id="addUserForm" className="form">
            <div className="addUserFormPairs">
              <div className="newUser-FormGroup">
                <label htmlFor="newUsername">{t("username")}:</label>
                <input
                  type="text"
                  id="newUsername"
                  maxLength={25}
                  name="newUsername"
                  value={newUsername}
                  required
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>

              <div className="newUser-FormGroup">
                <label htmlFor="newRole">{t("role")}:</label>
                <select
                  name="newRole"
                  id="newRole"
                  value={newRole}
                  required
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="">{t("SelectOption")}</option>
                  <option value="admin">{t("admin")}</option>
                  <option value="user">{t("user")}</option>
                </select>
              </div>
            </div>

            <div className="addUserFormPairs">
              <div className="newUser-FormGroup">
                <label htmlFor="newPassword">{t("password")}:</label>
                <input
                  type={type}
                  id="newPassword"
                  minLength="4"
                  name="newPassword"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="newUser-FormGroup">
                <label htmlFor="newPasswordConfirm">
                  {t("confirmPassword")}:
                </label>
                <input
                  type={type}
                  id="newPasswordConfirm"
                  minLength="4"
                  name="newPasswordConfirm"
                  required
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </div>
            </div>

            <span onClick={handleToggle}>
              {type === "password"
                ? <FaEyeSlash size={20} />
                : <FaEye size={20} />}
            </span>

            <button type="submit">{t("Submit")}</button>
          </form>
      )}
    
      </div>


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
        <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p>
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

