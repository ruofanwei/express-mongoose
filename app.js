require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// set up our express app
const app = express();

// BodyParser Middleware
app.use(express.json());

// * connect to mongodb
mongoose
  .connect(process.env.MONGO_DATABASE_URL, { autoIndex: false })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`${err}`))
mongoose.Promise = global.Promise
mongoose.set("debug", true)

// Routes
const storeRouter = require("./routes/stores");
app.use("/", storeRouter);

// error handling middleware
app.use(function (err, req, res, next) {
  //console.log(err);
  res.status(422).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
  console.log("Ready to Go!");
});
