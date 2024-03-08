const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate"); // Ensure this path is correct
const supabase = require("../supabaseClient"); // Ensure this path is correct

// Endpoint to follow a user
router.post("/follow/:followedId", authenticate, async (req, res) => {
  const followerId = req.user.id; // Assuming authenticate middleware attaches user info
  const followedId = req.params.followedId;

  // Prevent users from following themselves
  if (followerId === followedId) {
    return res.status(400).json({ error: "Users cannot follow themselves." });
  }

  try {
    const { error } = await supabase
      .from("followers")
      .insert([{ follower_id: followerId, followed_id: followedId }]);

    if (error) throw error;

    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to unfollow a user
router.delete("/unfollow/:followedId", authenticate, async (req, res) => {
  const followerId = req.user.id;
  const followedId = req.params.followedId;

  try {
    const { error } = await supabase
      .from("followers")
      .delete()
      .match({ follower_id: followerId, followed_id: followedId });

    if (error) throw error;

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
