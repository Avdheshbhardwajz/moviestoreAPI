const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");

// Create a new movie
router.post("/", async (req, res) => {
  try {
    const { title, rating, description, releaseDate } = req.body;
    const newMovie = new Movie({ title, rating, description, releaseDate });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all movies with filtering, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const { q, title, rating, sortBy, page = 1, limit = 10 } = req.query;
    const query = {};

    if (q) query.title = new RegExp(q, "i");
    if (title) query.title = title;
    if (rating) query.rating = rating;

    const movies = await Movie.find(query)
      .sort(sortBy ? { [sortBy]: 1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a movie by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, rating, description, releaseDate } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, rating, description, releaseDate },
      { new: true }
    );
    if (!updatedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
