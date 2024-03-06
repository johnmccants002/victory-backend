const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// User signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ message: "Signup successful", user });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  // Check if the sign-in was successful and we have session data
  if (data && data.session) {
    return res.status(200).json({
      message: "Signin successful",
      accessToken: data.session.access_token, // Sending back the access token explicitly
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      user: data.user, // You can choose to send back the entire user object or just specific fields
    });
  } else {
    // Handle the case where sign-in was somehow successful but no session was created
    return res.status(500).json({
      error: "Authentication succeeded but failed to create a session.",
    });
  }
});

module.exports = router;
