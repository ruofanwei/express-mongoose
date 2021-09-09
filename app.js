const express = require("express");
const mongoose = require("mongoose");
const {MONGO_URL} = require('./config.js')

// Routes
const userRoutes = require('./routes/user')
// set up our express app
const app = express();

// BodyParser Middleware
app.use(express.json())

// connect to mongodb
mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))
mongoose.Promise = global.Promise;

app.use("/", userRoutes);

// error handling middleware
app.use(function (err, req, res, next) {
  //console.log(err);
  res.status(422).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
  console.log("Ready to Go!");
});
