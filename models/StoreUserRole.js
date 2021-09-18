const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define a schema
const StoreUserRoleSchema = new Schema(
  {
    // storeUserRole belongs to a store
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    // storeUserRole belongs to a user
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // storeUserRole belongs to a role
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    oauth: {
      type: Schema.Types.ObjectId,
      ref: "Oauth",
    },
    linkCode: {
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// compile model
module.exports = mongoose.model("StoreUserRole", StoreUserRoleSchema);
