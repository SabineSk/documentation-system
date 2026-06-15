const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Holiday = require('../models/holidays.model');

router.get("/", authMiddleware, async (req, res) => {
  res.send({
    status: "success",
    message: "Holiday GET route works"
  });
});

//Create new holiday if not exists in db
router.post('/', authMiddleware, async (req, res) => {
    const {newName, newCountry, newHolidayDate, newHolidayType, newIgnoreForVacation, newIsWorkingDayYn, newPreHolidayHoursOff, newTransfferedForm} = req.body;

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
            ignoreForVacationYn: newIgnoreForVacation,
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