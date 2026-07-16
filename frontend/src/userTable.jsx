
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

      const [filters, setFilters] = useState([{ field: "", search: "" }]); //glabā visus filtrus ko lietoājs ievada sākotnēji
      const [submittedFilters, setSubmittedFilters] = useState([]); //glabā apstipriātos filtrus pēc submit pogas nospiešanas => setSubmittedFilters(filters);

      const { t, i18n } = useTranslation();


      useEffect(() => { 
        async function getUsers() {
          // const response = await fetch(`/api/users/list?page=${currentPage}&limit=${rowLimit}&search=${submitSearch}&filter=${filterBy}`, {
          //pārvērš filter masīvu par JSON stringu, lai varētu nosūtīt kā query parametru
          const filtersString = encodeURIComponent(JSON.stringify(submittedFilters));
          const response = await fetch(`/api/users/list?page=${currentPage}&limit=${rowLimit}&filters=${filtersString}`, {  
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
    }, [currentPage, rowLimit, submittedFilters]);

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

    //Apskata katru lietotāju
    // const filteredData = users.filter((user) => {
    //   //ja nav izvēlēts filtrs
    //   if (filterBy === "" || searchTable === ""){
    //     return true;
    //   }
    //   //Izvēlētais lauks no user: ID, username, role
    //   const value = user[filterBy];
    //   //Pārvērš user info uz lowercase
    //   const valueText = value.toLowerCase();
    //   //Pārvērš ievadi uz lovercase
    //   const searchText = searchTable.toLowerCase();

    //   return valueText.includes(searchText);
    // });

    //Sākumā useState({ key: null, direction: 'asc' })
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    //veido sakārtotu kopiju
    // const sortedData = [...filteredData].sort((a,b) => {
    const sortedData = [...users].sort((a,b) => {

      //ja vēl nav sortēšanas konfigurācija, tad nerosto vēl
      if (!sortConfig.key) return 0

      //paņem divu lietotāju vērtību
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      //CreatedAt un Updated at tekstu pārvērš par datumu
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
    }

    const handleLimitChange = (e) => {
      setRowLimit(Number(e.target.value));
    };


    const handleFilterChange = (e, index) => { //Index norāda kurš filtrs tiek mainīts, jo var būt vairāki
      const fieldName = e.target.name; //Target norāda uz konkrēto input lauku, name ir vai nu "field" vai "search"
      const fieldValue = e.target.value; //Tiek iegūta lietotāja izvēlētā vai ievadītā vērtība.
      const newFilters = [...filters]; //Izveido jaunu masīvu, lai saglabātu izmaiņas.
      newFilters[index][fieldName] = fieldValue; //Atjauno konkrētā filtra lauku ar jauno vērtību.
      setFilters(newFilters);
    };

    const handleAddFilter = () => {
      // ...filters saglabā visas esošās rindas, bet jaunais objekts pievieno vēl vienu.
      setFilters([
        ...filters, 
        { field: "", search: "" }
      ]);
    }

    const handleRemoveFilter = (index) => {
      const newFilters = [...filters];
      newFilters.splice(index, 1); //splice(no_kura_indeksa, cik_elementus_dzēst)
      setFilters(newFilters);
    }

    //izsauc, kad tiek iesniegta forma
    const handleSearchSubmit = (e) => {
      e.preventDefault();  //aptur lpas pārlādi, lai varētu saglabāt filtrus un izsaukt API pieprasījumu
      setSubmittedFilters(filters); //submittedFilters ir useEffect atkarība, tādēļ izsauksies getUsers() un izsauks API pieprasījumu ar jaunajiem filtriem. 
      // Ja izmantotu tkai filters, pieprasījums notiktu pēc katras rakstzīmes ievadīšanas.
      console.log("Filters submitted:", filters);
      // setSubmitSearch(searchTable);
      setCurrentPage(1); // Reseto uz pirmo lapu kad iesniegts
    }

    const allFilterOptions = [
      { value: "_id", label: t('ID') },
      { value: "username", label: t('username') },
      { value: "role", label: t('role') },
      { value: "createdAt", label: t('Created at') },
      { value: "updatedAt", label: t('Updated at') }
    ];

  
  return (
    <div className='content'>


      <form onSubmit={handleSearchSubmit} className="filter-form">
        {filters.map((filter, index) => (
          <div key={index} className="filter-group">


            <select name="field" value={filter.field} onChange={(e) => handleFilterChange(e, index)}>
              {allFilterOptions.map(eachFilter => {
                const isFilterSelected = false; //Te PIEVNIENOT RINDAAS TURPINĀJUMU: 
                if (!isFilterSelected) {
                  return (
                    <option key={eachFilter.value} value={eachFilter.value}>
                      {eachFilter.label}
                    </option>
                  )
            }
              })
              }
              {/* <option value="">{t('Filter')}</option>
              <option value="_id">ID</option>
              <option value="username">{t('username')}</option>
              <option value="role" disabled={filters.some(f => f.field === "role")}>
                {t('role')}
              </option>
              <option value="createdAt">{t('Created at')}</option>
              <option value="updatedAt">{t('Updated at')}</option> */}
            </select>



            {filter.field !== "createdAt" && filter.field !== "updatedAt" ? (            
              <input
                type="text"
                name="search"
                id="filter"
                placeholder={t('BttnSearch')}
                value={filter.search}
                onChange={(e) => handleFilterChange(e, index)}
              />
            ) : null}

            {filter.field === "createdAt" || filter.field === "updatedAt" ? (
              <input
                type="date"
                name="search"
                id="filter"
                placeholder={t('BttnSearch')}
                value={filter.search}
                onChange={(e) => handleFilterChange(e, index)}
              />
            ) : null}


            {/* passing an inde­x parameter to specify which todo's information needs updating. */}
            <button type="button" onClick={() => handleRemoveFilter(index)}>{t('Remove Filter')}</button> 
          </div>
        ))}
  
        <button type="button" onClick={handleAddFilter}>{t('Add Filter')}</button>
        <button type="submit">{t('Submit')}</button>
      </form>

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
                classname="selectPagination"
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

