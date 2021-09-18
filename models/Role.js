const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeaturesSchema = new Schema({
  calendar: {
    tabs: {
      type: [String],
    },
    utils: {
      type: [String],
    },
  },
  schedule: {
    tabs: {
      type: [String],
    },
    utils: {
      type: [String],
    },
  },
  service: {
    tabs: {
      type: [String],
    },
    utils: {
      type: [String],
    },
  },
  setting: {
    tabs: {
      type: [String],
    },
    utils: {
      type: [String],
    },
  },
});

// define a schema
const RoleSchema = new Schema(
  {
    name: {
      type: String,
    },
    isSuperAdmin: {
      type: Boolean,
    },
    isRoster: {
      type: Boolean,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    features: {
      type: FeaturesSchema,
    },
    // one role can have many storeUserRole
    storeUserRoles: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreUserRole",
      },
    ],
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
module.exports = mongoose.model("Role", RoleSchema);
