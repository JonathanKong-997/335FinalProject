// =========================================
//  Wordle Hint Widget — index.js
//  Layout: 5 columns side by side
//  Each column: letter input (top) + status dropdown (bottom)
// =========================================

const DEFAULT_WORD = ['G', 'U', 'E', 'S', 'S'];
const NUM_LETTERS  = 5;

// ── Build the form ──
const container = document.getElementById('guess-form-container');

// Title
const title = document.createElement('h1');
title.className   = 'widget-title';
title.textContent = 'Wordle Helper';
container.appendChild(title);

const subtitle = document.createElement('p');
subtitle.className   = 'widget-subtitle';
subtitle.textContent = 'Enter your guess and mark each letter';
container.appendChild(subtitle);

const form = document.createElement('form');
form.method    = 'GET';
form.action    = '/hint';
form.className = 'guess-form';

// ── 5-column grid of letter + dropdown pairs ──
const tileGrid = document.createElement('div');
tileGrid.className = 'tile-grid';

for (let i = 0; i < NUM_LETTERS; i++) {
  const col = document.createElement('div');
  col.className = 'tile-col';

  // Letter text input
  const letterInput = document.createElement('input');
  letterInput.type      = 'text';
  letterInput.name      = `letter${i}`;
  letterInput.maxLength = 1;
  letterInput.value     = DEFAULT_WORD[i];
  letterInput.className = 'letter-input';

  // Enforce single uppercase letter
  letterInput.addEventListener('input', () => {
    letterInput.value = letterInput.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 1);
  });

  // Auto-advance focus to next column on letter entry
  letterInput.addEventListener('keydown', (e) => {
    if (/^[a-zA-Z]$/.test(e.key) && i < NUM_LETTERS - 1) {
      setTimeout(() => {
        const inputs = form.querySelectorAll('.letter-input');
        if (inputs[i + 1]) inputs[i + 1].focus();
      }, 10);
    }
  });

  // Status dropdown
  const statusSelect = document.createElement('select');
  statusSelect.name      = `status${i}`;
  statusSelect.className = 'status-select';

  const options = [
    { value: 'wrong',   label: 'Wrong' },
    { value: 'inplace', label: 'In Place' },
    { value: 'correct', label: 'Correct' },
  ];

  options.forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value       = value;
    opt.textContent = label;
    statusSelect.appendChild(opt);
  });

  // Update column accent color when status changes
  const updateColColor = () => { col.dataset.status = statusSelect.value; };
  statusSelect.addEventListener('change', updateColColor);
  updateColColor();

  col.appendChild(letterInput);
  col.appendChild(statusSelect);
  tileGrid.appendChild(col);
}

form.appendChild(tileGrid);

// ── Buttons ──
const btnRow = document.createElement('div');
btnRow.className = 'btn-row';

const submitBtn = document.createElement('button');
submitBtn.type        = 'submit';
submitBtn.textContent = 'Get Hint';
submitBtn.className   = 'btn btn-submit';

const historyLink = document.createElement('a');
historyLink.href        = '/history';
historyLink.textContent = 'History';
historyLink.className   = 'btn btn-history';

btnRow.appendChild(submitBtn);
btnRow.appendChild(historyLink);
form.appendChild(btnRow);

container.appendChild(form);
