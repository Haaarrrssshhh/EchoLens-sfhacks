/**
 * EchoLens - Background Script
 * Manages extension state, settings, and implements text-to-speech
 */

// Default settings
const defaultSettings = {
  speechRate: 1.0,
  speechPitch: 1.0,
  highContrast: false,
  fontSize: 16,
  focusColor: '#FF4081',
  enableKeyboardShortcuts: true
};

// Current state
let currentSpeech = null;
let settings = { ...defaultSettings };

// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(Object.keys(defaultSettings), (result) => {
    // Only set defaults for missing settings
    const newSettings = { ...defaultSettings };
    for (const key in result) {
      if (result[key] !== undefined) {
        newSettings[key] = result[key];
      }
    }
    chrome.storage.sync.set(newSettings);
    settings = newSettings;
  });
  
  // Register keyboard commands
  registerKeyboardCommands();
});

// Load settings when background script starts
chrome.storage.sync.get(Object.keys(defaultSettings), (result) => {
  settings = { ...defaultSettings, ...result };
});

// Listen for changes to settings
chrome.storage.onChanged.addListener((changes) => {
  for (const key in changes) {
    if (key in settings) {
      settings[key] = changes[key].newValue;
    }
  }
});

// Register keyboard commands (for shortcuts)
function registerKeyboardCommands() {
  chrome.commands.onCommand.addListener(async (command) => {
    console.log(`Command: ${command}`);
    
    // Get the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || !tabs[0]) return;
    
    const activeTab = tabs[0];
    
    switch (command) {
      case 'toggle_screen_reader':
        chrome.tabs.sendMessage(activeTab.id, { action: 'toggleScreenReader' });
        break;
      case 'read_headings':
        chrome.tabs.sendMessage(activeTab.id, { action: 'readHeadings' });
        break;
      case 'read_paragraphs':
        chrome.tabs.sendMessage(activeTab.id, { action: 'readParagraphs' });
        break;
      case 'read_images':
        chrome.tabs.sendMessage(activeTab.id, { action: 'readImages' });
        break;
      case 'read_all_text':
        chrome.tabs.sendMessage(activeTab.id, { action: 'readAllText' });
        break;
      case 'stop_reading':
        stopSpeech();
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopReading' });
        break;
    }
  });
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Log all messages for debugging
  console.log('Message received:', message);
  
  switch (message.action) {
    case 'speak':
      handleSpeak(message, sendResponse);
      return true; // Keep the message channel open for async response
      
    case 'stopSpeech':
      stopSpeech();
      sendResponse({ success: true });
      break;
      
    case 'updateSettings':
      if (message.settings) {
        // Update local copy
        settings = { ...settings, ...message.settings };
        
        // Save to storage
        chrome.storage.sync.set(message.settings);
        
        sendResponse({ success: true, settings });
      }
      break;
  }
});

// Handle speech synthesis
function handleSpeak(message, sendResponse) {
  // Stop any current speech
  stopSpeech();
  
  // Get the text to speak
  const text = message.text;
  if (!text) {
    sendResponse({ success: false, error: 'No text provided' });
    return;
  }
  
  // Set up speech options
  const options = message.options || {};
  
  // Initialize SpeechSynthesis
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set speech parameters
  utterance.rate = options.rate || settings.speechRate;
  utterance.pitch = options.pitch || settings.speechPitch;
  utterance.lang = 'en-US'; // Default to English
  
  // Handle when speech is done
  utterance.onend = () => {
    currentSpeech = null;
    if (sendResponse) {
      sendResponse({ success: true, completed: true });
    }
  };
  
  // Handle errors
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    currentSpeech = null;
    if (sendResponse) {
      sendResponse({ success: false, error: event.error });
    }
  };
  
  // Store the current utterance
  currentSpeech = utterance;
  
  // Start speaking
  window.speechSynthesis.speak(utterance);
  
  // For very long texts, the speech might get cut off
  // This is a workaround for a Chrome bug
  if (text.length > 200) {
    const resumeSpeech = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(resumeSpeech);
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000); // Check every 10 seconds
  }
}

// Stop current speech
function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentSpeech = null;
} 