// =========================================
//  Wordle Hint Widget — index.js
//  Responsibilities:
//    1. Render default letters "G" "U" "E" "S" "S" on load
//    2. Allow typing into tiles, auto-advancing focus
//    3. Cycle tile colors on click (empty → grey → yellow → green → empty)
//    4. Encode the current guess + colors into the Submit and History link URLs
// =========================================

const COLOR_CYCLE = ["", "grey", "yellow", "green"];
const DEFAULT_WORD = ["G", "U", "E", "S", "S"];

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const portNumber = 5001;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
// ── Grab DOM elements ──
const tiles = document.querySelectorAll(".guess-row .tile");
const submitLink = document.querySelector(".btn--submit");
const historyLink = document.querySelector(".btn--history");

// ── Set up tiles ──
tiles.forEach((tile, index) => {
  // Make tiles focusable
  tile.setAttribute("tabindex", "0");

  // ── Keyboard input ──
  tile.addEventListener("keydown", (e) => {
    if (/^[a-zA-Z]$/.test(e.key)) {
      // Type a letter into this tile
      setLetter(tile, e.key.toUpperCase());
      triggerPop(tile);
      focusTile(index + 1); // advance to next tile
      updateLinks();
    } else if (e.key === "Backspace") {
      if (getLetter(tile)) {
        // Clear current tile
        setLetter(tile, "");
      } else {
        // Already empty — step back and clear previous
        const prev = index - 1;
        if (prev >= 0) {
          setLetter(tiles[prev], "");
          focusTile(prev);
        }
      }
      updateLinks();
    }
  });

  // ── Click to cycle color ──
  tile.addEventListener("click", () => {
    const current = COLOR_CYCLE.indexOf(getCurrentColor(tile));
    const next = (current + 1) % COLOR_CYCLE.length;

    tile.classList.remove("grey", "yellow", "green");
    if (COLOR_CYCLE[next]) tile.classList.add(COLOR_CYCLE[next]);

    triggerPop(tile);
    updateLinks();
  });
});

// ── Default letters "G" "U" "E" "S" "S" ──
tiles.forEach((tile, i) => setLetter(tile, DEFAULT_WORD[i]));
updateLinks();

// ── Helpers ──

/**
 * Sets the visible letter inside a tile.
 * @param {HTMLElement} tile
 * @param {string} letter - single uppercase letter, or '' to clear
 */
function setLetter(tile, letter) {
  tile.textContent = letter;
}

/**
 * Gets the current letter from a tile.
 * @param {HTMLElement} tile
 * @returns {string}
 */
function getLetter(tile) {
  return tile.textContent.trim();
}

/**
 * Moves focus to a tile by index. Clamps to valid range.
 * @param {number} index
 */
function focusTile(index) {
  const clamped = Math.min(Math.max(index, 0), tiles.length - 1);
  tiles[clamped].focus();
}

/**
 * Returns the current color class of a tile, or '' if none.
 * @param {HTMLElement} tile
 * @returns {string}
 */
function getCurrentColor(tile) {
  for (const color of COLOR_CYCLE) {
    if (color && tile.classList.contains(color)) return color;
  }
  return "";
}

/**
 * Triggers the pop animation on a tile.
 * @param {HTMLElement} tile
 */
function triggerPop(tile) {
  tile.classList.remove("pop");
  void tile.offsetWidth; // reflow to restart animation
  tile.classList.add("pop");
  tile.addEventListener("animationend", () => tile.classList.remove("pop"), {
    once: true,
  });
}

/**
 * Reads the current state of all 5 tiles.
 * @returns {{ letter: string, color: string }[]}
 */
function getGuessState() {
  return Array.from(tiles).map((tile) => ({
    letter: getLetter(tile),
    color: getCurrentColor(tile),
  }));
}

/**
 * Encodes the guess state as URL query params and updates both nav links.
 * Format: ?guess=APPLE&colors=grey,yellow,green,empty,green
 */
function updateLinks() {
  const state = getGuessState();
  const letters = state.map((s) => s.letter).join("");
  const colors = state.map((s) => s.color || "empty").join(",");

  const params = new URLSearchParams({ guess: letters, colors });

  if (submitLink) submitLink.href = `/hint?${params}`;
  if (historyLink) historyLink.href = `/history?${params}`;
}

app.listen(portNumber);
