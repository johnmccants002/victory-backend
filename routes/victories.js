const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Adjust the path as necessary to your Supabase client setup

// Middleware to verify user token and attach user info to request
router.use(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  const { data: user, error } = await supabase.auth.api.getUser(token);
  if (error) return res.status(401).send("Invalid token");
  req.user = user;
  next();
});

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
router.post("/", async (req, res) => {
  const { victory_text, image_url, category } = req.body;
  const { data, error } = await supabase
    .from("victories")
    .insert([{ user_id: req.user.id, victory_text, image_url, category }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
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
