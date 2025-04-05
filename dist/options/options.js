/**
 * EchoLens - Options Script
 */

// Default settings
const defaultSettings = {
  speechRate: 1.0,
  speechPitch: 1.0,
  highContrast: false,
  fontSize: 16,
  focusColor: '#FF4081',
  enableKeyboardShortcuts: true,
  voiceName: ''
};

// DOM Elements
const speechRateSlider = document.getElementById('speechRate');
const speechRateValue = document.getElementById('speechRateValue');
const speechPitchSlider = document.getElementById('speechPitch');
const speechPitchValue = document.getElementById('speechPitchValue');
const voiceSelector = document.getElementById('voiceSelector');
const highContrastCheckbox = document.getElementById('highContrast');
const highContrastBtn = document.getElementById('highContrastBtn');
const fontSizeSlider = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const focusColorPicker = document.getElementById('focusColor');
const focusColorPreview = document.getElementById('focusColorPreview');
const enableKeyboardShortcutsCheckbox = document.getElementById('enableKeyboardShortcuts');
const keyboardShortcutsBtn = document.getElementById('keyboardShortcutsBtn');
const saveSettingsBtn = document.getElementById('saveSettings');
const restoreDefaultsBtn = document.getElementById('restoreDefaults');

// Current settings
let currentSettings = { ...defaultSettings };

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load available voices
  loadVoices();
  
  // Load current settings
  loadSettings();
  
  // Set up event listeners
  setupEventListeners();
});

// Load available voices
async function loadVoices() {
  try {
    chrome.runtime.sendMessage({ action: 'getVoices' }, (response) => {
      if (response && response.voices) {
        populateVoiceSelector(response.voices);
      }
    });
  } catch (error) {
    console.error('Failed to load voices:', error);
  }
}

// Populate voice selector with available voices
function populateVoiceSelector(voices) {
  voiceSelector.innerHTML = '<option value="">System Default</option>';
  
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.voiceName;
    option.textContent = `${voice.voiceName} (${voice.lang})`;
    voiceSelector.appendChild(option);
  });
}

// Load current settings
function loadSettings() {
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    if (response && response.settings) {
      currentSettings = { ...currentSettings, ...response.settings };
      updateUI();
    }
  });
}

// Update UI based on current settings
function updateUI() {
  speechRateSlider.value = currentSettings.speechRate;
  speechRateValue.textContent = currentSettings.speechRate.toFixed(1);
  
  speechPitchSlider.value = currentSettings.speechPitch;
  speechPitchValue.textContent = currentSettings.speechPitch.toFixed(1);
  
  if (currentSettings.voiceName) {
    voiceSelector.value = currentSettings.voiceName;
  }
  
  highContrastCheckbox.checked = currentSettings.highContrast;
  updateToggleButton(highContrastBtn, currentSettings.highContrast, 'HIGH CONTRAST');
  
  fontSizeSlider.value = currentSettings.fontSize;
  fontSizeValue.textContent = `${currentSettings.fontSize}px`;
  
  focusColorPicker.value = currentSettings.focusColor;
  updateColorPreview(currentSettings.focusColor);
  
  enableKeyboardShortcutsCheckbox.checked = currentSettings.enableKeyboardShortcuts;
  updateToggleButton(keyboardShortcutsBtn, currentSettings.enableKeyboardShortcuts, 'SHORTCUTS');
}

// Set up event listeners
function setupEventListeners() {
  // Speech settings
  speechRateSlider.addEventListener('input', () => {
    const value = parseFloat(speechRateSlider.value);
    speechRateValue.textContent = value.toFixed(1);
    currentSettings.speechRate = value;
  });
  
  speechPitchSlider.addEventListener('input', () => {
    const value = parseFloat(speechPitchSlider.value);
    speechPitchValue.textContent = value.toFixed(1);
    currentSettings.speechPitch = value;
  });
  
  voiceSelector.addEventListener('change', () => {
    currentSettings.voiceName = voiceSelector.value;
  });
  
  // Visual settings
  highContrastBtn.addEventListener('click', () => {
    currentSettings.highContrast = !currentSettings.highContrast;
    updateToggleButton(highContrastBtn, currentSettings.highContrast, 'HIGH CONTRAST');
  });
  
  fontSizeSlider.addEventListener('input', () => {
    const value = parseInt(fontSizeSlider.value);
    fontSizeValue.textContent = `${value}px`;
    currentSettings.fontSize = value;
  });
  
  focusColorPicker.addEventListener('input', () => {
    currentSettings.focusColor = focusColorPicker.value;
    updateColorPreview(currentSettings.focusColor);
  });
  
  // Keyboard settings
  keyboardShortcutsBtn.addEventListener('click', () => {
    currentSettings.enableKeyboardShortcuts = !currentSettings.enableKeyboardShortcuts;
    updateToggleButton(keyboardShortcutsBtn, currentSettings.enableKeyboardShortcuts, 'SHORTCUTS');
  });
  
  // Buttons
  restoreDefaultsBtn.addEventListener('click', restoreDefaults);
  saveSettingsBtn.addEventListener('click', saveSettings);
}

// Restore default settings
function restoreDefaults() {
  // Reset current settings to defaults
  currentSettings = { ...defaultSettings };
  
  // Update UI with default values
  updateUI();
  
  // Save default settings to storage
  chrome.runtime.sendMessage({
    action: 'updateSettings',
    settings: currentSettings
  }, (response) => {
    if (response && response.success) {
      showNotification('Default settings restored and saved');
    } else {
      showNotification('Failed to save default settings');
    }
  });
}

// Save settings
function saveSettings() {
  chrome.runtime.sendMessage({
    action: 'updateSettings',
    settings: currentSettings
  }, (response) => {
    if (response && response.success) {
      showNotification('Settings saved successfully');
    }
  });
}

// Show notification
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.save-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'save-notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.classList.add('show');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Update toggle button appearance
function updateToggleButton(button, isActive, label) {
  if (isActive) {
    button.classList.add('active');
    button.style.backgroundColor = '#4CAF50'; // Success color
    button.textContent = `${label}: ON`;
  } else {
    button.classList.remove('active');
    button.style.backgroundColor = '#F44336'; // Error color
    button.textContent = `${label}: OFF`;
  }
}

// Update color preview
function updateColorPreview(color) {
  focusColorPreview.style.backgroundColor = color;
} 