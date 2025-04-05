/**
 * EchoLens - Popup Script
 */

// DOM Elements
const toggleScreenReaderBtn = document.getElementById('toggleScreenReader');
const readHeadingsBtn = document.getElementById('readHeadings');
const readLandmarksBtn = document.getElementById('readLandmarks');
const stopReadingBtn = document.getElementById('stopReading');
const openOptionsBtn = document.getElementById('openOptions');
const helpBtn = document.getElementById('help');
const closeHelpBtn = document.getElementById('closeHelp');
const helpDialog = document.getElementById('helpDialog');

// Settings elements
const highContrastToggle = document.getElementById('highContrast');
const speechRateSlider = document.getElementById('speechRate');
const speechRateValue = document.getElementById('speechRateValue');
const fontSizeSlider = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');

// Current settings
let currentSettings = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  try {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
      if (response && response.settings) {
        currentSettings = response.settings;
        updateUI();
      }
    });
  } catch (error) {
    console.error('Failed to load settings:', error);
  }

  // Set up event listeners
  setupEventListeners();
});

// Update UI based on current settings
function updateUI() {
  highContrastToggle.checked = currentSettings.highContrast;
  speechRateSlider.value = currentSettings.speechRate;
  speechRateValue.textContent = currentSettings.speechRate.toFixed(1);
  fontSizeSlider.value = currentSettings.fontSize;
  fontSizeValue.textContent = `${currentSettings.fontSize}px`;
}

// Set up event listeners
function setupEventListeners() {
  // Main actions
  toggleScreenReaderBtn.addEventListener('click', () => {
    sendMessageToActiveTab('toggleScreenReader');
  });

  readHeadingsBtn.addEventListener('click', () => {
    sendMessageToActiveTab('readHeadings');
  });

  readLandmarksBtn.addEventListener('click', () => {
    sendMessageToActiveTab('readLandmarks');
  });

  stopReadingBtn.addEventListener('click', () => {
    sendMessageToActiveTab('stopReading');
  });

  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Settings
  highContrastToggle.addEventListener('change', () => {
    updateSetting('highContrast', highContrastToggle.checked);
  });

  speechRateSlider.addEventListener('input', () => {
    const value = parseFloat(speechRateSlider.value);
    speechRateValue.textContent = value.toFixed(1);
    updateSetting('speechRate', value);
  });

  fontSizeSlider.addEventListener('input', () => {
    const value = parseInt(fontSizeSlider.value);
    fontSizeValue.textContent = `${value}px`;
    updateSetting('fontSize', value);
  });

  // Help dialog
  helpBtn.addEventListener('click', () => {
    helpDialog.showModal();
  });

  closeHelpBtn.addEventListener('click', () => {
    helpDialog.close();
  });
}

// Send message to the active tab
function sendMessageToActiveTab(action, data = {}) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
    }
  });
}

// Update a setting
function updateSetting(key, value) {
  currentSettings[key] = value;
  
  const settingUpdate = {};
  settingUpdate[key] = value;
  
  chrome.runtime.sendMessage({
    action: 'updateSettings',
    settings: settingUpdate
  });
} 