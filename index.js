var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const OpenAI = require("openai");
const authRouter = require("./routes/auth"); // The file name of your routes
const profileRouter = require("./routes/profile");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporarily store files in an 'uploads' directory
require("dotenv").config(); // For loading environment variables
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors()); // This will enable CORS for all routes

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", authRouter);
app.use("/users", usersRouter);
app.use("/api/profile", profileRouter);

app.post("/createVictory", upload.single("image"), async (req, res) => {
  const { victoryText } = req.body;
  let imageURL = null;

  // Optional: Handle image upload to Supabase Storage or another cloud storage here
  if (req.file) {
    // Upload file to Supabase or your preferred cloud storage and get the URL
    // const { data, error } = await supabase.storage.from('your-bucket').upload('path/to/file', fileStream);
    // imageURL = data.publicURL || null;
  }

  // Call OpenAI's ChatGPT to process victoryText here
  // const response = await axios.post('https://api.openai.com/v4/completions', { ... }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });
  // const processedText = response.data.choices[0].text; // Simplified example

  // Return the processed text and imageURL as part of the response
  res.json({ victoryText: processedText, imageURL });
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/processToDoList", async (req, res) => {
  const { toDoList } = req.body;

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
          content: `Here's a to-do list that I've completed aka Victories: ${toDoList}. Separate out each Victory and put it in past tense. Then return json with array of objects with the key victoryText in each one to match each Victory.`,
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

app.post("/generateMiniVictories", async (req, res) => {
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
