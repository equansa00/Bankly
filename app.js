/** Application for bank.ly */

const express = require('express');
const app = express();
const ExpressError = require("./helpers/expressError");

app.use(express.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

require('dotenv').config();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bankly API!' });
});


/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  // Pass the error to the next error handling middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  console.log("Error caught in middleware:", err); // Log the error object
  console.log("Error status:", err.status);       // Log the status of the error
  console.log("Error message:", err.message);     // Log the error message

  res.status(err.status || 500); // Use error status, default to 500 if not available

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;

//suggestions
//1. There's a duplicated module.exports = app; at the end of the file. It's redundant, and only one instance is needed.
