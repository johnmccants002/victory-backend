const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate"); // Adjust path as needed

// Route to get current user
router.get("/current-user", authenticate, (req, res) => {
  console.log("IN THE CURRENT USER FUNCTION");
  if (!req.user) {
    return res.status(404).send("User not found");
  }

  // Return the authenticated user's details
  res.json({ user: req.user });
});

module.exports = router;
