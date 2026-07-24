const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filterSchema = new Schema(
  { 
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },

    name: {type:String, required: true, trim: true}, 
    filters: {
    username: { type: String, default: "",   trim: true},
    role: { type:String, default: "",   trim: true}, 
    },
  },
  {
    timestamps: true
  }
);
// unique: true novērš vienādu nosaukumu izveidi visā datbāzē visiem lietotājiem. 
// Lai vienam lietotājam nesakristu vairāki savi filtru nosaukumi, tad veido compound index.
//compound index skatās uz vairāku lauku kombināciju: unikāla ir kombinācija user + name nevis tikai name. 
filterSchema.index(
  { user: 1, name: 1 },
  { unique: true }
);

const UserFilter = mongoose.model("userFilter", filterSchema);


module.exports = UserFilter;

