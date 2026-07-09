const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Holiday = require('../models/holidays.model');

router.get("/", authMiddleware, async (req, res) => {
    try{
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 10;
        const skip = (page - 1) * limit;
        // For page 1: skip = (1–1) * 10 = 0 (show first 10 items)
        // For page 2: skip = (2–1) * 10 = 10 (skip first 10, show next 10)
        // For page 3: skip = (3–1) * 10 = 20 (skip first 20, show next 10)

        const holidays = await Holiday.find({}).skip(skip).limit(limit);
        const totalCount = await Holiday.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
  
        console.log(totalCount);
        console.log(totalPages);

        res.send({
            data: { holidays, page, limit, totalCount, totalPages},
            status: "success",
            message: "Data retrieved"
        });        
    }catch (err) {
    console.log(err);
     res.send({
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