const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const short = require("short-uuid");
// define a schema
const CompanySchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: function () {
      return short.generate();
    },
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // one company can have many stores
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
});

// compile model
module.exports = mongoose.model("Company", CompanySchema);
