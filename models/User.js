const mongoose = require("mongoose");
const Schema = mongoose.Schema
const short = require("short-uuid");

// define a schema
const UserSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: function () {
      return short.generate();
    },
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  photo_url: {
    type: String,
  },
  intro: {
    type: String,
  },
  last_login_at: {
    type: Date,
    default: Date.now,
  },
  // many to many
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
});

// compile model
module.exports = mongoose.model("User", UserSchema);