/**
 * EchoLens - Background Script
 * Handles text-to-speech and settings management
 */

// Default settings
const defaultSettings = {
  speechRate: 1.0,
  speechPitch: 1.0,
  highContrast: false,
  fontSize: 16,
  focusColor: '#FF4081',
  enableKeyboardShortcuts: true,
  voiceName: '' // Default system voice
};

// Initialize settings
let settings = { ...defaultSettings };

// Load saved settings
chrome.storage.sync.get('echolensSettings', (data) => {
  if (data.echolensSettings) {
    settings = { ...settings, ...data.echolensSettings };
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'speak':
      speak(message.text, message.options, sendResponse);
      return true; // Keep the message channel open for async response
      
    case 'stopSpeech':
      chrome.tts.stop();
      sendResponse({ success: true });
      break;
      
    case 'getSettings':
      sendResponse({ settings });
      break;
      
    case 'updateSettings':
      settings = { ...settings, ...message.settings };
      // Save settings to storage
      chrome.storage.sync.set({ echolensSettings: settings });
      // Notify all tabs about the setting change
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { 
            action: 'updateSettings',
            settings
          }).catch(() => {
            // Ignore errors from tabs that don't have content script loaded
          });
        });
      });
      sendResponse({ success: true });
      break;
      
    case 'getVoices':
      chrome.tts.getVoices((voices) => {
        sendResponse({ voices });
      });
      return true; // Keep the message channel open for async response
  }
});

// Handle text-to-speech
function speak(text, options = {}, callback) {
  const ttsOptions = {
    rate: options.rate || settings.speechRate,
    pitch: options.pitch || settings.speechPitch,
    voiceName: options.voiceName || settings.voiceName,
    onEvent: (event) => {
      if (event.type === 'end' || event.type === 'interrupted' || event.type === 'error') {
        if (callback) callback();
      }
    }
  };
  
  chrome.tts.speak(text, ttsOptions);
}

// Install event handler - set up initial settings
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ echolensSettings: defaultSettings });
    
    // Open options page on install
    chrome.runtime.openOptionsPage();
  }
});

// Context menu for image descriptions
chrome.contextMenus.create({
  id: 'readImage',
  title: 'Describe this image',
  contexts: ['image']
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'readImage' && info.srcUrl) {
    // Get alt text or try to describe the image
    chrome.tabs.sendMessage(tab.id, {
      action: 'describeImage',
      imageUrl: info.srcUrl
    });
  }
}); 