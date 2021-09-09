const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const short = require("short-uuid");
// define a schema
const StoreSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: function () {
      return short.generate();
    },
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },
  main_store: {
    type: String,
    enum: ["1", "0"], // 1: true , 0: false
    default: "0",
  },
  // store belongs to a company
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  // many to many
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// compile model
module.exports = mongoose.model("Store", StoreSchema);
