const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Adjust the path as necessary

// Middleware to extract and verify the user token
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

// Get profile information
router.get("/", async (req, res) => {
  const { user } = req;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

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
