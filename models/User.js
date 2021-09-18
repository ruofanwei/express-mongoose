const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define a schema
const UserSchema = new Schema(
  {
    uuid: {
      type: Schema.Types.ObjectId,
      index: true,
      unique: true,
      required: [true, "uuid is required"],
      auto: true,
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
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    // each user have one storeUserRole
    storeUserRole: {
      type: Schema.Types.ObjectId,
      ref: "StoreUserRole",
    },
    // hasMany Oauth
    oauths: [
      {
        type: Schema.Types.ObjectId,
        ref: "Oauth",
      },
    ],
    // hasMany smsPointOrder
    smsPointOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "SmsPointOrder",
      },
    ],
    // hasMany notification
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
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
module.exports = mongoose.model("User", UserSchema);
