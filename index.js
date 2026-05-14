// =========================================
//  Wordle Hint Widget — index.js
//  Builds a plain form with 5 letter/status pairs.
//  On submit, navigates to /hint with the form data.
//  History button navigates to /history.
// =========================================

const DEFAULT_WORD = ['G', 'U', 'E', 'S', 'S'];
const NUM_LETTERS  = 5;

// ── Build the form dynamically ──
const container = document.getElementById('guess-form-container');

const form = document.createElement('form');
form.method = 'GET';
form.action = '/hint';

// One row per letter: [text input] [dropdown]
for (let i = 0; i < NUM_LETTERS; i++) {
  const row = document.createElement('div');

  // Letter text input — single character, defaults to DEFAULT_WORD[i]
  const letterInput = document.createElement('input');
  letterInput.type      = 'text';
  letterInput.name      = `letter${i}`;
  letterInput.maxLength = 1;
  letterInput.value     = DEFAULT_WORD[i];

  // Enforce single letter on input
  letterInput.addEventListener('input', () => {
    letterInput.value = letterInput.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 1);
  });

  // Status dropdown: wrong / in place / correct
  const statusSelect = document.createElement('select');
  statusSelect.name = `status${i}`;

  const options = [
    { value: 'wrong',    label: 'Wrong' },
    { value: 'inplace',  label: 'In Place' },
    { value: 'correct',  label: 'Correct' },
  ];

  options.forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value       = value;
    opt.textContent = label;
    statusSelect.appendChild(opt);
  });

  row.appendChild(letterInput);
  row.appendChild(statusSelect);
  form.appendChild(row);
}

// Submit button — submits the form to /hint
const submitBtn = document.createElement('button');
submitBtn.type        = 'submit';
submitBtn.textContent = 'Submit Guess';
form.appendChild(submitBtn);

container.appendChild(form);

// History button — plain link to /history
const historyLink = document.createElement('a');
historyLink.href        = '/history';
historyLink.textContent = 'View History';
container.appendChild(historyLink);
