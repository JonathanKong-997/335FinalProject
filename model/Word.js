const mongoose = require("mongoose");

const wordsSchema = new mongoose.Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
});

const Word = mongoose.model("Word", wordsSchema);
module.exports = Word;
