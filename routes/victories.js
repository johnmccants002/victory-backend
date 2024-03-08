const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // Adjust the path as necessary to your Supabase client setup
const authenticate = require("../middleware/authenticate");

// Middleware to verify user token and attach user info to request

// Fetch all victories for the logged-in user
router.get("/", authenticate, async (req, res) => {
  const { data: victories, error } = await supabase
    .from("victories")
    .select("*")
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(victories);
});

// Route to get victories from followed users
// router.get("/followed-victories", authenticate, async (req, res) => {
//   const currentUserId = req.user.id; // Assuming 'authenticate' middleware sets this

//   try {
//     const { data: victories, error } = await supabase
//       .from("victories")
//       .select(
//         `
//         *,
//         profiles:user_id (
//           first_name,
//           last_name,
//           photo_url
//         )
//       `
//       )
//       .in(
//         "user_id",
//         supabase
//           .from("followers")
//           .select("followed_id")
//           .eq("follower_id", currentUserId)
//           .then((res) => res.data.map((following) => following.followed_id))
//       );

//     if (error) throw error;
//     res.status(200).json(victories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;

// Create a new victory
// router.post("/", authenticate, async (req, res) => {
//   console.log("POSTING VICTORY");
//   console.log(req.user, "THIS IS THE USER");
//   const { victory_text, image_url, category } = req.body;
//   console.log("THIS IS THE REQ.BODY", req.body);
//   const { error } = await supabase
//     .from("victories")
//     .insert([{ user_id: req.user.id, victory_text, image_url, category }]);
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json({ message: "Victory created successfully" });
// });

router.post("/", authenticate, async (req, res) => {
  console.log("POSTING VICTORIES");
  console.log(req.user, "THIS IS THE USER");

  // Expect req.body to be an array of victory objects
  const victories = req.body.map((victory) => ({
    victory_text: victory.victoryText,
    image_url: null,
    category: "Standard",
    user_id: req.user.id, // Add user_id to each victory object
  }));

  console.log("THIS IS THE REQ.BODY", req.body);

  const { error } = await supabase.from("victories").insert(victories); // Insert the array of victories

  if (error) return res.status(400).json({ error: error.message });

  res
    .status(201)
    .json({ message: `${victories.length} Victories created successfully` });
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
