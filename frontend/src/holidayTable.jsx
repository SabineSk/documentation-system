import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function HolidayTable({language}){
    const [holidays, setHolidays ] = useState([])
    const [message, setMessage] = useState("")
    const [status, setStatus] =useState("")

    const texts = {
        lv: {
            tableName: 'Nosaukums',
            tableCountry: 'Valsts',
            tableDate: 'Datums',
            tableType: 'Tips'
        },
        en: {
            tableName: 'Name',
            tableCountry: 'Country',
            tableDate: 'Date',
            tableType: 'Type'
        }
    };
    useEffect(() => {
    async function getHolidays() {
      const response = await fetch('/api/holidays', {
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
        });
        
        const {data, status, message} = await response.json();
        console.log("HOLIDAYS RESPONSE:", data, status, message);

        setMessage(message);
        setStatus(status)

        if (status === 'success') {
        setHolidays(data);
        } else {
        setHolidays([])
        }
    }


    getHolidays();
    }, []);


    return(
        <div className="content">
            <p style={{ color: status === 'success' ? 'green': 'red' }}> {message} </p>
            <table>
                <thead className='thead'>
                    <tr>
                        <th>
                            <div className='th-content'>
                                <span></span>
                            </div>
                        </th>
                        <th>
                            <div className='th-content'>
                                <span>{texts[language].tableName}</span>
                            </div>
                        </th>
                        <th>
                            <div className='th-content'>
                                <span>{texts[language].tableCountry}</span>
                            </div>
                        </th>
                        <th>
                            <div className='th-content'>
                                <span>{texts[language].tableDate}</span>
                            </div>
                        </th>
                        <th>
                            <div className='th-content'>
                                <span>{texts[language].tableType}</span>
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

    )

}
export default HolidayTable;
