// =========================================
//  Wordle Hint Widget — client.js
//  Client-side behaviour:
//    1. Letter input — replace current letter, advance on filled box
//    2. Dropdown — update column accent color on change
// =========================================

const form = document.querySelector(".guess-form");
const inputs = form.querySelectorAll(".letter-input");
const selects = form.querySelectorAll(".status-select");

// ── Letter inputs ──
inputs.forEach((input, i) => {
  input.addEventListener("keydown", (e) => {
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault(); // stop browser from appending
      const wasEmpty = input.value === "";
      input.value = e.key.toUpperCase(); // always replace current letter
      // Advance to next box only if this one was already filled
      if (!wasEmpty && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (input.value !== "") {
        // If current input has a value, clear it
        input.value = "";
      } else if (i > 0) {
        // If current input is empty, go to previous input and clear it
        inputs[i - 1].value = "";
        inputs[i - 1].focus();
      }
    }
  });
});

// ── Dropdowns — update column accent color on change ──
selects.forEach((select) => {
  const col = select.closest(".tile-col");

  const updateColor = () => {
    col.dataset.status = select.value;
  };
  select.addEventListener("change", updateColor);
  updateColor(); // set initial color on load
});
