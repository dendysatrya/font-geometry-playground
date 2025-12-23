/* =========================================================
   DOM REFERENCES
========================================================= */

const fontSelect = document.getElementById('fontSelect');
const lineHeightSlider = document.getElementById('lineHeightSlider');
const lineHeightValue = document.getElementById('lineHeightValue');

const referenceGrid = document.getElementById('referenceGrid');
const textGrid = document.getElementById('textGrid');

const heightFactorValue = document.getElementById('heightFactorValue');
const copyButton = document.getElementById('copyButton');

/* =========================================================
   CONSTANTS
========================================================= */

const GRID_SIZE = 6;
const CELL_SIZE_PX = 40;
const SAMPLE_CHAR = 'M';

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initializeGrids();
  attachEventListeners();
  updateMeasurements();
});

function initializeGrids() {
  buildReferenceGrid();
  buildTextGrid();
}

function attachEventListeners() {
  fontSelect.addEventListener('change', () => {
    updateTextGridFont();
    updateMeasurements();
  });

  lineHeightSlider.addEventListener('input', (e) => {
    lineHeightValue.textContent = parseFloat(e.target.value).toFixed(2);
    updateTextGridLineHeight();
    updateMeasurements();
  });

  copyButton.addEventListener('click', copyToClipboard);
}

/* =========================================================
   GRID BUILDING
========================================================= */

function buildReferenceGrid() {
  referenceGrid.innerHTML = '';
  referenceGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${CELL_SIZE_PX}px)`;
  referenceGrid.style.gridTemplateRows = `repeat(${GRID_SIZE}, ${CELL_SIZE_PX}px)`;

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell reference-cell';
    referenceGrid.appendChild(cell);
  }
}

function buildTextGrid() {
  textGrid.innerHTML = '';
  textGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${CELL_SIZE_PX}px)`;
  textGrid.style.gridTemplateRows = `repeat(${GRID_SIZE}, ${CELL_SIZE_PX}px)`;

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell text-cell';
    cell.textContent = SAMPLE_CHAR;
    textGrid.appendChild(cell);
  }

  updateTextGridFont();
  updateTextGridLineHeight();
}

/* =========================================================
   GRID UPDATES
========================================================= */

function updateTextGridFont() {
  textGrid.style.fontFamily = fontSelect.value;
}

function updateTextGridLineHeight() {
  textGrid.style.lineHeight = lineHeightSlider.value;
}

/* =========================================================
   MEASUREMENT
========================================================= */

function updateMeasurements() {
  const measurements = measureCharacter();

  if (!measurements) {
    heightFactorValue.textContent = '—';
    return;
  }

  const { width, height } = measurements;
  const heightFactor = width / height;
  heightFactorValue.textContent = heightFactor.toFixed(4);
}

function measureCharacter() {
  // Create a measurement probe
  const probe = document.createElement('span');
  probe.textContent = SAMPLE_CHAR;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.whiteSpace = 'pre';
  probe.style.fontFamily = fontSelect.value;
  probe.style.fontSize = '32px';
  probe.style.lineHeight = lineHeightSlider.value;

  document.body.appendChild(probe);

  const rect = probe.getBoundingClientRect();
  const measurements = {
    width: rect.width,
    height: rect.height,
  };

  probe.remove();

  if (measurements.height === 0) {
    return null;
  }

  return measurements;
}

/* =========================================================
   COPY FUNCTIONALITY
========================================================= */

function copyToClipboard() {
  const value = heightFactorValue.textContent;
  navigator.clipboard.writeText(value).then(() => {
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 1500);
  });
}
