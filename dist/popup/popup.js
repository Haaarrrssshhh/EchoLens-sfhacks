/**
 * EchoLens - Popup Script
 * Controls the extension popup interface
 */

// Constants for text and states
const toggleText = {
  on: "SCREEN READER: ON",
  off: "SCREEN READER: OFF"
};

// State tracking
let isScreenReaderActive = false;

// Initialize the popup when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the current tab
  const getCurrentTab = async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };
  
  // Load settings
  chrome.storage.sync.get(['speechRate', 'highContrast', 'fontSize'], function(result) {
    // Set speech rate slider value if available
    if (result.speechRate) {
      document.getElementById('speech-rate').value = result.speechRate;
      document.getElementById('rate-value').textContent = result.speechRate + 'x';
    }
    
    // Set font size slider value if available
    if (result.fontSize) {
      document.getElementById('font-size').value = result.fontSize;
      document.getElementById('size-value').textContent = result.fontSize + 'px';
    }
    
    // Set high contrast toggle if available
    if (result.highContrast) {
      document.getElementById('high-contrast').checked = result.highContrast;
      updateHighContrastButton();
    }
    
    // Check the current screen reader state
    getCurrentTab().then(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'getScreenReaderState' }, function(response) {
        if (response && response.isActive !== undefined) {
          isScreenReaderActive = response.isActive;
          updateToggleButton();
        }
      });
    });
  });
  
  // Update the high contrast button state
  function updateHighContrastButton() {
    const highContrastSwitch = document.getElementById('high-contrast');
    const highContrastButton = document.querySelector('.toggle-btn.high-contrast');
    
    if (highContrastSwitch.checked) {
      highContrastButton.classList.add('active');
      highContrastButton.textContent = 'HIGH CONTRAST: ON';
    } else {
      highContrastButton.classList.remove('active');
      highContrastButton.textContent = 'HIGH CONTRAST: OFF';
    }
  }
  
  // Update the toggle button state
  function updateToggleButton() {
    const toggleButton = document.getElementById('toggle-btn');
    
    if (isScreenReaderActive) {
      toggleButton.classList.add('active');
      toggleButton.textContent = toggleText.on;
    } else {
      toggleButton.classList.remove('active');
      toggleButton.textContent = toggleText.off;
    }
  }
  
  // Toggle button event listener
  document.getElementById('toggle-btn').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    isScreenReaderActive = !isScreenReaderActive;
    
    updateToggleButton();
    
    chrome.tabs.sendMessage(tab.id, { action: 'toggleScreenReader' });
  });
  
  // Read headings button click event
  document.getElementById('read-headings').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { action: 'readHeadings' });
  });
  
  // Read paragraphs button click event
  document.getElementById('read-paragraphs').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { action: 'readParagraphs' });
  });
  
  // Read images button click event
  document.getElementById('read-images').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { action: 'readImages' });
  });
  
  // Stop reading button click event
  document.getElementById('stop-reading').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { action: 'stopReading' });
  });
  
  // High contrast toggle event
  document.getElementById('high-contrast').addEventListener('change', function() {
    const isHighContrast = this.checked;
    chrome.storage.sync.set({ highContrast: isHighContrast });
    
    updateHighContrastButton();
    
    // Apply high contrast setting to the current tab
    getCurrentTab().then(tab => {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'updateSettings', 
        settings: { highContrast: isHighContrast }
      });
    });
  });
  
  // Additional event listener for the high contrast button itself
  document.querySelector('.toggle-btn.high-contrast').addEventListener('click', function() {
    const highContrastSwitch = document.getElementById('high-contrast');
    highContrastSwitch.checked = !highContrastSwitch.checked;
    
    // Trigger the change event manually
    const event = new Event('change');
    highContrastSwitch.dispatchEvent(event);
  });
  
  // Speech rate slider event
  document.getElementById('speech-rate').addEventListener('input', function() {
    const rate = parseFloat(this.value);
    document.getElementById('rate-value').textContent = rate + 'x';
    chrome.storage.sync.set({ speechRate: rate });
    
    // Apply speech rate setting to the current tab
    getCurrentTab().then(tab => {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'updateSettings', 
        settings: { speechRate: rate }
      });
    });
  });
  
  // Font size slider event
  document.getElementById('font-size').addEventListener('input', function() {
    const size = parseInt(this.value);
    document.getElementById('size-value').textContent = size + 'px';
    chrome.storage.sync.set({ fontSize: size });
    
    // Apply font size setting to the current tab
    getCurrentTab().then(tab => {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'updateSettings', 
        settings: { fontSize: size }
      });
    });
  });
  
  // Keyboard shortcuts info
  document.getElementById('shortcuts-info').addEventListener('click', function() {
    const shortcutsList = document.getElementById('shortcuts-list');
    shortcutsList.classList.toggle('hidden');
  });
}); 