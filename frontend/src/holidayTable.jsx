import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";

// function HolidayTable({language}){
function HolidayTable(){
    const [holidays, setHolidays ] = useState([]);
    const [message, setMessage] = useState("");
    const [status, setStatus] =useState("");
    const currentlyShowing = holidays.length;
    const [rowLimit, setRowLimit] = useState(10);

    const { t, i18n } = useTranslation();


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState('');


    useEffect(() => {
    async function getHolidays() {
      const response = await fetch(`/api/holidays?page=${currentPage}&limit=${rowLimit}`, {
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
        });
        
        const {data, status, message} = await response.json();
        setMessage(message);
        setStatus(status)

        const {holidays, page, limit, totalCount, totalPages} = data;
        
        if (status === 'success') {
        setHolidays(holidays);
        setTotalPages(totalPages);
        setTotalCount(totalCount);
        } else {
        setHolidays([])
        }
        
    }
    getHolidays();
    }, [currentPage, rowLimit]);


    const handleLimitChange = (e) => {
        setRowLimit(Number(e.target.value));
    };

    return(
        <div className="content">
            <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p>
            <div className="table-wrapper">
                <table ID="holidayTable">
                    <thead className='thead'>
                        <tr>
                            <th>
                                <div className='th-content'>
                                    <span></span>
                                </div>
                            </th>
                            <th>
                                <div className='th-content'>
                                    <span>{t(`tableName`)}</span>
                                </div>
                            </th>
                            <th>
                                <div className='th-content'>
                                    <span>{t(`tableCountry`)}</span>
                                </div>
                            </th>
                            <th>
                                <div className='th-content'>
                                    <span>{t(`tableDate`)}</span>
                                </div>
                            </th>
                            <th>
                                <div className='th-content'>
                                    <span>{t(`tableType`)}</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='tbody'>
                        { holidays?.map((val, key) => (
                        <tr key = {key}>
                        <td> {key + 1}</td>
                        <td>{val.name}</td>
                        <td>{val.country}</td>
                        <td>{val.holidayDate}</td>
                        <td>{val.holidayType}</td>
                        </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            
            <div className='pagPages'>
                <div className="row-count-select">
                    <label htmlFor="row-select">{t('row-select')}:</label> 
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
                    className='pagArrow'
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
        </div>

    )

}
export default HolidayTable;
