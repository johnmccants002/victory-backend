const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const authenticate = require("../middleware/authenticate");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware for OpenAI API configuration or other shared setup could go here

// Process a to-do list into victories
router.post("/processToDoList", async (req, res) => {
  const { toDoList } = req.body;
  console.log("🚀 ~ router.post ~ toDoList:", toDoList);

  if (!toDoList) {
    return res
      .status(400)
      .json({ error: "Please provide a to-do list to process." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Here's a to-do list that I've completed aka Victories: ${toDoList}. 
          Separate out each Victory and put it in past tense. Then return json with array of objects with the key victoryText in each one to match each Victory.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log(completion.choices[0].message.content);

    const victories = completion.choices[0].message.content;

    if (!victories) {
      return res
        .status(500)
        .json({ error: "Failed to generate victories from the to-do list." });
    }

    // Send generated victories back to the frontend
    res.json({ victories });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the to-do list." });
  }
});

// Generate mini victories related to a specific victory
router.post("/generateMiniVictories", async (req, res) => {
  const { victoryText } = req.body;

  if (!victoryText) {
    return res
      .status(400)
      .json({ error: "Please provide victory text to process." });
  }

  try {
    // Adjust the prompt to ask for mini victories related to the main victory
    const prompt = `Given this array of victories: "${victoryText}", list out mini victories related to it in detail. Update the current json array of victories to include another key called miniVictories. In there come up with array of mini victories that each of the victories can be broken down into. If you feel the victory can't be broken down into mini victories then leave an empty array for the miniVictories value`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const miniVictories = completion.choices[0].message.content;

    if (!miniVictories) {
      return res
        .status(500)
        .json({ error: "Failed to generate mini victories." });
    }

    // Send generated mini victories back to the frontend
    res.json({ miniVictories });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating mini victories." });
  }
});

module.exports = router;
