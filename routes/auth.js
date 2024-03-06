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

// User signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { user, session, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ message: "Signin successful", user, session });
});

module.exports = router;
