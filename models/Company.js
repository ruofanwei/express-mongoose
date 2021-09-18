const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// * company schema
const CompanySchema = new Schema(
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
module.exports = mongoose.model("Company", CompanySchema);
