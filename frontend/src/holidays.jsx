import { useState } from 'react';
import HolidayTable from './holidayTable.jsx'

function Holidays() {
  const [showHolidays, setShowHolidays] = useState(false);
  const [showAddNewHoliday, setShowAddNewHoliday] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newType, setNewType] = useState('');
  const [newIgnoreForVacationYn, setNewIgnoreForVacationYn] = useState('');
  const [newIsWorkingDayYn, setNewIsWorkingDayYn ] = useState('');

  const [message, setMessage] = useState("")
  const [status, setStatus] =useState("")

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try{

      const response = await fetch('api/holidays', {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          newName, 
          newCountry, 
          newHolidayDate,
          newType, 
          newIgnoreForVacationYn, 
          newIsWorkingDayYn
        })
      });

      const {data, status, message} = await response.json();
      setMessage(message);
      setStatus(status);
      console.log(message);

      if (status === 'error') {
            setError("Kļūda, pievienojot dienu");
            return;
      }
      
      setNewName('');
      setNewCountry('');
      setNewType('');
      setNewIgnoreForVacationYn('');
      setNewIsWorkingDayYn('');
      setError(null);
       

    }catch (err)
      {console.log(err);
      setError("Kļūda, pievienojot lietotāju");

      }finally{
      setProcessing(false);
      }
  };
  
    
  return ( 
    <div className="content">
      <div className="nav">
      
        <button onClick={() => {
          setShowHolidays(true);
          setShowAddNewHoliday(false);
        }}>
          Meklēt
        </button>
        <button onClick={() => {
          setShowAddNewHoliday(true);
          setShowHolidays(false);
        }}>
          Pievienot
        </button>

        <hr></hr>  

      {showHolidays && (
        <div>
          <button onClick={() => setShowHolidays(false)}>Aizvērt</button>

          <HolidayTable/>
        </div>
      )}

      {showAddNewHoliday && (
        <div>

          <button onClick={() => setShowAddNewHoliday(false)}>Aizvērt</button>
          <form onSubmit={onSubmit} id="addHolidayForm" className="form">

            <div className="newHoliday-FormGroup">
              <label htmlFor="newName">Nosaukums</label>
              <input
                type="text" 
                id="newName" 
                name="newName"
                value={newName}
                required
                maxLength={50}
                onChange={(e) => setNewName(e.target.value)}/>
            </div>

            <div className="newHoliday-FormGroup"> 
              <label htmlFor="newCountry">Valsts</label>
              <select
              id='newCountry' 
              name='newCountry'
              value={newCountry} 
              required
              onChange={(e) => setNewCountry(e.target.value)}>
                <option value="">Izvēlēties</option>
                <option value="Latvia">Latvija (LV) </option>
                <option value="Lithuania">Lietuva (LT) </option>
              </select>
            </div>

            <div className="newHoliday-FormGroup">
              <label htmlFor="newType">Tips</label>
              <select
              id='newType' 
              name='newType'
              value={newType} 
              onChange={(e) => setNewType(e.target.value)}>
                <option value="">Izvēlēties</option>
                <option value="DN">Svētku diena</option>
                <option value="DY">Īpašā diena</option>
                <option value="TNH">Pārcelta brīvdiena</option>
                <option value="TWD">Pārcelta darba diena</option>
                <option value="WD"> Saīsināta darba diena</option>

              </select>
            </div>

            <div className="newHoliday-FormGroup">
              <label htmlFor="newDate">Datums</label>
              <input 
              aria-label="Date" 
              type="date" 
              required
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}/>
            </div >

            <div className="newHoliday-FormGroup">
              <label htmlFor="newIgnoreForVacationYn">Ignorēt atvaļinājumā</label>
              <select 
              id='newIgnoreForVacationYn' 
              name='newIgnoreForVacationYn'
              value={newIgnoreForVacationYn} 
              onChange={(e) => setNewIgnoreForVacationYn(e.target.value)}>
                <option value="">Izvēlēties</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>

            <div className="newHoliday-FormGroup">
              <label htmlFor="newIsWorkingDayYn">Darba diena</label>
              <select 
              id='newIsWorkingDayYn' 
              name='newIsWorkingDayYn'
              value={newIsWorkingDayYn} 
              onChange={(e) => setNewIsWorkingDayYn(e.target.value)}>
                <option value="">Izvēlēties</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
            <button type="submit">Izveidot</button> 
          </form>

        </div>
      )}
      </div>
    </div>

   );
}



export default Holidays;