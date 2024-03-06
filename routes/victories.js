const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Adjust the path as necessary to your Supabase client setup
const authenticate = require("../middleware/authenticate");

// Middleware to verify user token and attach user info to request

// Fetch all victories for the logged-in user
router.get("/", async (req, res) => {
  const { data: victories, error } = await supabase
    .from("victories")
    .select("*")
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(victories);
});

// Create a new victory
router.post("/", authenticate, async (req, res) => {
  console.log("POSTING VICTORY");
  console.log(req.user, "THIS IS THE USER");
  const { victory_text, image_url, category } = req.body;
  console.log("THIS IS THE REQ.BODY", req.body);
  const { error } = await supabase
    .from("victories")
    .insert([{ user_id: req.user.id, victory_text, image_url, category }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json();
});

// Update an existing victory
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { victory_text, image_url, category } = req.body;
  const { data, error } = await supabase
    .from("victories")
    .update({ victory_text, image_url, category })
    .eq("id", id)
    .eq("user_id", req.user.id); // Ensure user can only update their own victories

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
