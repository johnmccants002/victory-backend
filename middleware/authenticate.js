const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Expecting Bearer [token]
  console.log(token, "THIS IS THE TOKEN");
  if (!token) {
    return res
      .status(401)
      .send("A Bearer token is required for authentication");
  }

  // Note: Setting up Supabase client to include the Authorization header with the token

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("THIS IS THE user", JSON.stringify(user));

    // Attaching the user object to the request so it can be used in subsequent routes
    req.user = user;
    next();
  } catch (error) {
    console.log("IN THE CATCH BLOCK");
    return res.status(401).send(error.message || "Authentication failed");
  }
};

module.exports = authenticate;
