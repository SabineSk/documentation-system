import { useState } from 'react';
import HolidayTable from './holidayTable.jsx'
import texts from './header.jsx'

function Holidays({language}) {
  const [showHolidays, setShowHolidays] = useState(false);
  const [showAddNewHoliday, setShowAddNewHoliday] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayType, setNewHolidayType] = useState('');
  const [newIgnoreForVacationYn, setNewIgnoreForVacationYn] = useState('');
  const [newIsWorkingDayYn, setNewIsWorkingDayYn ] = useState('');

  const [message, setMessage] = useState("")
  const [status, setStatus] =useState("")

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const texts = {
        lv: {
           BttnSearch: "Meklēt",
           BttnAdd: 'Pievienot',
           BttnClose: 'Aizvērt',
           tableName: 'Nosaukums*',
           tableCountry: 'Valsts*',
           tableDate: 'Datums*',
           tableType: 'Tips*',
           tableIgnore: 'Ignorēt atvaļinājumā',
           tableWorkDay: 'Darba diena',
           choose: 'Izvēlēties',
           LV: 'Latvija (LV)',
           LT: 'Lietuva (LT)',
           yes: 'Jā',
           no: 'Nē',
           celebrationDay: 'Svētku diena',
           special: 'Īpašā diena',
           postopnedHolid: 'Pārcelta brīvdiena',
           postponedWorking: 'Pārcelta darba diena',
           shortened: 'Saīsināta darba diena',
           create: 'Izveidot',
           close: 'Aizvērt'

        },
        en: {
           BttnSearch: "Search",
           BttnAdd: 'Add new',
           BttnClose: 'Close',
           tableName: 'Name',
           tableCountry: 'Country',
           tableDate: 'Date',
           tableType: 'Type',
           tableIgnore: 'Ignore on vacation',
           tableWorkDay: 'Work day',
           choose: 'Select',
           LV: 'Latvia (LV)',
           LT: 'Lithuania (LT)',
           yes: 'Yes',
           no: 'No',
           celebrationDay: 'Celebration day',
           special: 'Special day',
           postopnedHolid: 'Postponed holiday',
           postponedWorking: 'Postponed working day',
           shortened: 'Shortened working day',
           create: 'Create',
           close: 'Close'
        }
    };

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
          newHolidayType, 
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
      setNewHolidayType('');
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
          {texts[language].BttnSearch}
        </button>
        <button onClick={() => {
          setShowAddNewHoliday(true);
          setShowHolidays(false);
        }}>
          {texts[language].BttnAdd}
        </button>

        <hr></hr>  

      {showHolidays && (
        <div>
          <button onClick={() => setShowHolidays(false)}>{texts[language].BttnClose}</button>

          <HolidayTable language={language}/>
        </div>
      )}
      {showAddNewHoliday && (
        <div>

          
          <form onSubmit={onSubmit} id="addHolidayForm" className="form">
          <div className='row-holiday'>
            <div className="newHoliday-FormGroup">
              
                <label htmlFor="newName">{texts[language].tableName}</label>
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
                <label htmlFor="newCountry">{texts[language].tableCountry}</label>
                <select
                id='newCountry' 
                name='newCountry'
                value={newCountry} 
                required
                onChange={(e) => setNewCountry(e.target.value)}>
                  <option value="">{texts[language].choose}</option>
                  <option value="Latvia">{texts[language].LV}</option>
                  <option value="Lithuania">{texts[language].LT}</option>
                </select>
              </div>
            </div>
            <div className='row-holiday'> 
              <div className="newHoliday-FormGroup">
                <label htmlFor="newHolidayType">{texts[language].tableType}</label>
                <select
                id='newHolidayType' 
                name='newHolidayType'
                required
                value={newHolidayType} 
                onChange={(e) => setNewHolidayType(e.target.value)}>
                  <option value="">{texts[language].choose}</option>
                  <option value="DN">{texts[language].celebrationDay}</option>
                  <option value="DY">{texts[language].special}</option>
                  <option value="TNH">{texts[language].postopnedHolid}</option>
                  <option value="TWD">{texts[language].postponedWorking}</option>
                  <option value="WD"> {texts[language].shortened}</option>
                </select>
              </div>

              <div className="newHoliday-FormGroup">
                <label htmlFor="newDate">{texts[language].tableDate}</label>
                <input 
                aria-label="Date" 
                type="date" 
                required
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}/>
              </div >
            </div>

            <div className='row-holiday'>
              <div className="newHoliday-FormGroup">
                <label htmlFor="newIgnoreForVacationYn">{texts[language].tableIgnore}</label>
                <select 
                id='newIgnoreForVacationYn' 
                name='newIgnoreForVacationYn'
                value={newIgnoreForVacationYn} 
                onChange={(e) => setNewIgnoreForVacationYn(e.target.value)}>
                  <option value="">{texts[language].choose}</option>
                  <option value="yes">{texts[language].yes}</option>
                  <option value="no">{texts[language].no}</option>
                </select>
              </div>

              <div className="newHoliday-FormGroup">
                <label htmlFor="newIsWorkingDayYn">{texts[language].tableWorkDay}</label>
                <select 
                id='newIsWorkingDayYn' 
                name='newIsWorkingDayYn'
                value={newIsWorkingDayYn} 
                onChange={(e) => setNewIsWorkingDayYn(e.target.value)}>
                  <option value="">{texts[language].choose}</option>
                  <option value="yes">{texts[language].yes}</option>
                  <option value="no">{texts[language].no}</option>
                </select>
              </div>
            </div>
            <div id='holiday-form-bttn'>
            <button id='submit-button' type="submit">{texts[language].create}</button> 
            <button id='close-button' onClick={() => setShowAddNewHoliday(false)}>{texts[language].close}</button>
          </div>
          </form>
        </div>
      )}
      </div>
    </div>

   );
}



export default Holidays;