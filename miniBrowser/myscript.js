const iframe = document.getElementById('webview');
const hamburger = document.getElementById('hamburger');
const urlDialog = document.getElementById('urlDialog');
const urlInput = document.getElementById('urlInput');
const closeBtn = document.getElementById('closeBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const progressBar = document.getElementById('progressBar');
const errorScreen = document.getElementById('errorScreen');
const errorBtn = document.getElementById('errorBtn');

// Load last saved URL or default
window.addEventListener('DOMContentLoaded', () => {
  const savedUrl = localStorage.getItem('lastUrl') || 'https://example.com/';
  iframe.src = savedUrl;
  urlInput.value = savedUrl;
});

// Show hamburger when near corner
document.addEventListener('mousemove', e => {
  const margin = 100;
  hamburger.style.opacity =
    (e.clientY < margin && e.clientX > window.innerWidth - margin) ? 1 : 0.05;
});

// Open dialog
hamburger.addEventListener('click', () => {
  urlDialog.showModal();
  urlInput.focus();
});

// Close dialog
closeBtn.addEventListener('click', () => urlDialog.close());

// Clear
clearBtn.addEventListener('click', () => {
  urlInput.value = 'https://example.com/';
  localStorage.removeItem('lastUrl');
});

// Save / Load
saveBtn.addEventListener('click', () => loadUrl(urlInput.value.trim()));
urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') loadUrl(urlInput.value.trim());
});

function loadUrl(url) {
  if (!url) {
    urlDialog.close();
    return;
  }
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  iframe.src = url;
  localStorage.setItem('lastUrl', url);
  urlDialog.close();
  hideError();
}

// Error handling (iframe cannot detect all errors — use timeout fallback)
iframe.addEventListener('load', () => {
  progressBar.style.width = '100%';
  setTimeout(() => (progressBar.style.display = 'none'), 300);
});

iframe.addEventListener('error', showError);

function showError() {
  errorScreen.style.display = 'flex';
}

function hideError() {
  errorScreen.style.display = 'none';
}

errorBtn.addEventListener('click', () => {
  hideError();
  iframe.src = urlInput.value.trim();
});

// Simulated progress bar
iframe.addEventListener('loadstart', () => {
  progressBar.style.display = 'block';
  progressBar.style.width = '10%';
});

iframe.addEventListener('load', () => {
  progressBar.style.width = '100%';
  setTimeout(() => {
    progressBar.style.display = 'none';
    progressBar.style.width = '0';
  }, 400);
});
