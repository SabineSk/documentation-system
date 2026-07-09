import { useState } from 'react';
import HolidayTable from './holidayTable.jsx';
import { useTranslation } from "react-i18next";

function Holidays() {
  const { t, i18n } = useTranslation();
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

  console.log("language:", i18n.language);
  console.log("BttnSearch:", t("BttnSearch"));
  console.log("choose:", t("choose"));
  console.log("postopnedHolid:", t("postopnedHolid"));

  
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
          {t('BttnSearch')}
        </button>
        <button onClick={() => {
          setShowAddNewHoliday(true);
          setShowHolidays(false);
        }}>
          {t('BttnAdd')}
        </button>

        <hr></hr>  

      {showHolidays && (
        <div>
          <button onClick={() => setShowHolidays(false)}>{t('BttnClose')}</button>

          <HolidayTable/>
        </div>
      )}
      {showAddNewHoliday && (
        <div>

          
          <form onSubmit={onSubmit} id="addHolidayForm" className="form">
          <div className='row-holiday'>
            <div className="newHoliday-FormGroup">
              
                <label htmlFor="newName">{t('tableName')}</label>
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
                <label htmlFor="newCountry">{t('tableCountry')}</label>
                <select
                id='newCountry' 
                name='newCountry'
                value={newCountry} 
                required
                onChange={(e) => setNewCountry(e.target.value)}>
                  <option value="">{t('choose')}</option>
                  <option value="Latvia">{t('LV')}</option>
                  <option value="Lithuania">{t('LT')}</option>
                </select>
              </div>
            </div>
            <div className='row-holiday'> 
              <div className="newHoliday-FormGroup">
                <label htmlFor="newHolidayType">{t('tableType')}</label>
                <select
                id='newHolidayType' 
                name='newHolidayType'
                required
                value={newHolidayType} 
                onChange={(e) => setNewHolidayType(e.target.value)}>
                  <option value="">{t('choose')}</option>
                  <option value="DN">{t('celebrationDay')}</option>
                  <option value="DY">{t('special')}</option>
                  <option value="TNH">{t('postopnedHolid')}</option>
                  <option value="TWD">{t('postponedWorking')}</option>
                  <option value="WD"> {t('shortened')}</option>
                </select>
              </div>

              <div className="newHoliday-FormGroup">
                <label htmlFor="newDate">{t('tableDate')}</label>
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
                <label htmlFor="newIgnoreForVacationYn">{t('tableIgnore')}</label>
                <select 
                id='newIgnoreForVacationYn' 
                name='newIgnoreForVacationYn'
                value={newIgnoreForVacationYn} 
                onChange={(e) => setNewIgnoreForVacationYn(e.target.value)}>
                  <option value="">{t('choose')}</option>
                  <option value="yes">{t('yes')}</option>
                  <option value="no">{t('no')}</option>
                </select>
              </div>

              <div className="newHoliday-FormGroup">
                <label htmlFor="newIsWorkingDayYn">{t('tableWorkDay')}</label>
                <select 
                id='newIsWorkingDayYn' 
                name='newIsWorkingDayYn'
                value={newIsWorkingDayYn} 
                onChange={(e) => setNewIsWorkingDayYn(e.target.value)}>
                  <option value="">{t('choose')}</option>
                  <option value="yes">{t('yes')}</option>
                  <option value="no">{t('no')}</option>
                </select>
              </div>
            </div>
            <div id='holiday-form-bttn'>
            <button id='submit-button' type="submit">{t('create')}</button> 
            <button id='close-button' onClick={() => setShowAddNewHoliday(false)}>{t('close')}</button>
          </div>
          </form>
        </div>
      )}
      </div>
    </div>

   );
}

export default Holidays;