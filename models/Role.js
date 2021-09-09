const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// define a schema
const RoleSchema = new Schema({
  name: {
    type: String,
  },
  is_super_admin: {
    type: Boolean,
  },
  is_roster: {
    type: Boolean,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
  },
  // one role can have many storeUserRole
  storeUserRoles: [
    {
      type: Schema.Types.ObjectId,
      ref: "StoreUserRole",
    },
  ],
});

// compile model
module.exports = mongoose.model("Role", RoleSchema);
