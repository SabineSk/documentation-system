const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Holiday = require('../models/holidays.model');

router.get("/", async (req, res) => {
    try{
        const holidays = await Holiday.find();
        res.send({
            data: holidays,
            status: "success",
            message: "Holiday GET route works"
        });        
    }catch (err) {
    console.log(err);
    
    return res.send({
        data: null,
        status: 'error',
        message: "Couldn't fetch holidays"
    });

    }
});

//Create new holiday if not exists in db
router.post('/', authMiddleware, async (req, res) => {
    const {newName, newCountry, newHolidayDate, newHolidayType, newIgnoreForVacationYn, newIsWorkingDayYn, newPreHolidayHoursOff, newTransfferedForm} = req.body;

    try{
        const existingHoliday = await Holiday.findOne({name: newName});

        if (existingHoliday){
            console.log("This holiday already exists")
            return res.send({
                data: null,
                status: 'error',
                message: "Holiday already exists"
            });
        }

        const holiday = new Holiday ({
            name: newName,
            country: newCountry,
            holidayDate: newHolidayDate,
            holidayType: newHolidayType,
            ignoreForVacationYn: newIgnoreForVacationYn,
            isWorkingDayYn: newIsWorkingDayYn,
            preHolidayHoursOff: newPreHolidayHoursOff,
            transferredFrom: newTransfferedForm,

        });

        await holiday.save();
        return res.send({
            data:holiday,
            status: 'success',
            message: "Holiday created"
        });


    }catch (err) {
    console.log(err);
    }
});

module.exports = router;