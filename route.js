const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load valid Wordle words once at startup
const validWordsPath = path.join(__dirname, "valid-wordle-words.txt");
const validWords = new Set(
  fs.readFileSync(validWordsPath, "utf-8")
    .split("\n")
    .map(word => word.trim().toUpperCase())
    .filter(word => word.length === 5)
);

router.get("/", (req, res) => {
  res.render("index");
});

// New route to handle guess submission
router.get("/hint", async (req, res) => {
  try {
    // Extract letters from query parameters
    const letters = [];
    const statuses = [];
    for (let i = 0; i < 5; i++) {
      const letter = req.query[`letter${i}`]?.toUpperCase() || "";
      const status = req.query[`status${i}`] || "wrong";
      letters.push(letter);
      statuses.push(status);
    }

    const guess = letters.join("");

    // Validate that guess is 5 letters and exists in valid words
    if (guess.length !== 5 || !validWords.has(guess)) {
      return res.status(400).json({
        error: "Invalid word",
        message: `"${guess}" is not a valid Wordle word. Please enter a 5-letter word from the word list.`
      });
    }

    // Fetch definition from Free Dictionary API
    const definitionResponse = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guess.toLowerCase()}`
    );

    let definition = "No definition found";
    if (definitionResponse.ok) {
      const defData = await definitionResponse.json();
      if (defData[0]?.meanings[0]?.definitions[0]?.definition) {
        definition = defData[0].meanings[0].definitions[0].definition;
      }
    }

    // Filter valid words based on Wordle rules
    const matchingWords = Array.from(validWords).filter(word => {
      for (let i = 0; i < 5; i++) {
        const status = statuses[i];
        const letter = letters[i];

        if (status === "correct") {
          // Letter must be in this exact position
          if (word[i] !== letter) return false;
        } else if (status === "inplace") {
          // Letter must be in the word but NOT in this position
          if (!word.includes(letter) || word[i] === letter) return false;
        } else if (status === "wrong") {
          // Letter must not be in the word at all (UNLESS it's marked as correct elsewhere)
          const isCorrectElsewhere = statuses.some((s, idx) => s === "correct" && letters[idx] === letter);
          if (word.includes(letter) && !isCorrectElsewhere) return false;
        }
      }
      return true;
    });

    res.json({
      success: true,
      guess: guess,
      definition: definition,
      matchingWords: matchingWords.slice(0, 50) // Return first 50 matches
    });
  } catch (error) {
    console.error("Error processing hint:", error);
    res.status(500).json({
      error: "Server error",
      message: "An error occurred while processing your request."
    });
  }
});

module.exports = router;
