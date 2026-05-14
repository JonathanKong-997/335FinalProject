// =========================================
//  Wordle Hint Widget — index.js
//  Express server setup
// =========================================

const express = require("express");
const path = require("path");
const app = express();
const router = require("./route.js");

const PORT = process.env.PORT || 3000;

// Set up view engine for EJS templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// Serve static files (CSS, client-side JavaScript, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
