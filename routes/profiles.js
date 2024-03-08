const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Adjust the path as necessary
const authenticate = require("../middleware/authenticate");

// Middleware to extract and verify the user token

// Get profile information
router.get("/", authenticate, async (req, res) => {
  console.log("In profile get function");
  const { user } = req;
  console.log("🚀 ~ router.get ~ user:", user);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  console.log("🚀 ~ router.get ~ data:", data);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create or Update profile information
router.post("/", async (req, res) => {
  const { user } = req;
  const { firstName, lastName, aboutMe, photoUrl } = req.body;
  const { data, error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    about_me: aboutMe,
    photo_url: photoUrl,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
