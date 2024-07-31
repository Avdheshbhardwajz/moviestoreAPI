const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.URL; // replace with your MongoDB connection string
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const movieRoutes = require("./routes/movieRoutes");
app.use("/movies", movieRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
