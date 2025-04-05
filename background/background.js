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
  } else {
    // If no settings exist, save defaults
    chrome.storage.sync.set({ echolensSettings: settings });
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
      // Update only the settings that were provided
      settings = { ...settings, ...message.settings };
      
      // Save all settings to storage
      chrome.storage.sync.set({ echolensSettings: settings }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save settings:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError });
        } else {
          // Notify all tabs about the setting change
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
              try {
                chrome.tabs.sendMessage(tab.id, { 
                  action: 'updateSettings',
                  settings: message.settings
                }).catch(() => {
                  // Ignore errors from tabs that don't have content script loaded
                });
              } catch (e) {
                // Ignore errors for tabs that can't receive messages
              }
            });
          });
          sendResponse({ success: true });
        }
      });
      return true; // Keep message channel open for async response
      
    case 'getVoices':
      chrome.tts.getVoices((voices) => {
        sendResponse({ voices });
      });
      return true; // Keep the message channel open for async response
  }
});

// Handle text-to-speech
function speak(text, options = {}, callback) {
  if (!text) {
    if (callback) callback();
    return;
  }
  
  const ttsOptions = {
    rate: options.rate || settings.speechRate || 1.0,
    pitch: options.pitch || settings.speechPitch || 1.0,
    voiceName: options.voiceName || settings.voiceName || '',
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