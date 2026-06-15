// const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const schema = new Schema({
const holidaySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  holidayDate: {
    type: String,
    required: true,
  },
  holidayType: {
    type: String,
    default: null,
  },
  ignoreForVacationYn: {
    type: Boolean,
    default: null,
  },
  isWorkingDayYn: {
    type: Boolean,
    default: null,
  },
  preHolidayHoursOff: {
    type: String,
    default: null,
  },
  transferredFrom: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// module.exports = model('holidays', schema, 'holidays');
const Holiday = mongoose.model("holiday", holidaySchema );
module.exports = Holiday;



