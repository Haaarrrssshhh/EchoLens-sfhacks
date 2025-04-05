/**
 * EchoLens - Accessibility Content Script
 * Provides core accessibility features for blind and low vision users
 */

class EchoLensAccessibility {
  constructor() {
    this.isActive = false;
    this.currentFocusIndex = -1;
    this.interactiveElements = [];
    this.readingQueue = [];
    this.isReading = false;
    this.settings = {
      speechRate: 1.0,
      speechPitch: 1.0,
      highContrast: false,
      fontSize: 16,
      focusColor: '#FF4081',
      enableKeyboardShortcuts: true,
    };
    
    this.initializeSettings();
    this.initializeKeyboardListeners();
  }

  // Initialize with stored settings or defaults
  async initializeSettings() {
    try {
      // Request settings from background script
      chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
        if (response && response.settings) {
          this.settings = { ...this.settings, ...response.settings };
          this.applySettings();
        }
      });
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  }

  // Apply current settings to the page
  applySettings() {
    if (this.settings.highContrast) {
      this.enableHighContrast();
    } else {
      this.disableHighContrast();
    }
    
    if (this.settings.fontSize !== 16) {
      document.documentElement.style.fontSize = `${this.settings.fontSize}px`;
    }
  }

  // Enable high contrast mode
  enableHighContrast() {
    let style = document.getElementById('echolens-high-contrast');
    if (!style) {
      style = document.createElement('style');
      style.id = 'echolens-high-contrast';
      style.textContent = `
        body {
          background-color: #000 !important;
          color: #fff !important;
        }
        a, button, input, select, textarea {
          background-color: #000 !important;
          color: #ffff00 !important;
          border: 1px solid #ffff00 !important;
        }
        img {
          filter: brightness(1.2) contrast(1.2);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Disable high contrast mode
  disableHighContrast() {
    const style = document.getElementById('echolens-high-contrast');
    if (style) {
      style.remove();
    }
  }

  // Initialize keyboard event listeners
  initializeKeyboardListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // Check if this is a Mac
  isMac() {
    return navigator.platform.indexOf('Mac') > -1;
  }

  // Handle keyboard shortcuts
  handleKeyDown(event) {
    if (!this.settings.enableKeyboardShortcuts) return;

    const isMac = this.isMac();
    const altKey = isMac ? event.metaKey || event.altKey : event.altKey;

    // Alt+Shift+A (or Option+Shift+A on Mac) to toggle the screen reader
    if (altKey && event.shiftKey && event.key === 'A') {
      event.preventDefault();
      this.toggleScreenReader();
      return;
    }
    
    // If screen reader is active
    if (this.isActive) {
      // Up/Down for navigation between interactive elements
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.navigateNext();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigatePrevious();
      }
      
      // Space or Enter to activate the current element
      else if ((event.key === ' ' || event.key === 'Enter') && this.currentFocusIndex >= 0) {
        event.preventDefault();
        this.activateCurrentElement();
      }
      
      // Alt+H or Option+H to read page headings
      else if (altKey && (event.key === 'h' || event.key === 'H')) {
        event.preventDefault();
        this.readHeadings();
      }
      
      // Alt+L or Option+L to read landmarks
      else if (altKey && (event.key === 'l' || event.key === 'L')) {
        event.preventDefault();
        this.readLandmarks();
      }
      
      // Alt+P or Option+P to read paragraphs
      else if (altKey && (event.key === 'p' || event.key === 'P')) {
        event.preventDefault();
        this.readParagraphs();
      }

      // Alt+I or Option+I to read images
      else if (altKey && (event.key === 'i' || event.key === 'I')) {
        event.preventDefault();
        this.readImages();
      }
      
      // Escape to stop reading
      else if (event.key === 'Escape') {
        event.preventDefault();
        this.stopReading();
      }
    }
  }

  // Placeholder function for the "G" key event with visual feedback
  handleGKey() {
    // Create a div element to show a visual indicator
    const feedback = document.createElement('div');
    feedback.textContent = "G key pressed!";
    feedback.style.position = "fixed";
    feedback.style.top = "10px";
    feedback.style.right = "10px";
    feedback.style.backgroundColor = "#FF4081";
    feedback.style.color = "#FFF";
    feedback.style.padding = "10px";
    feedback.style.borderRadius = "5px";
    feedback.style.zIndex = "9999";
    feedback.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    document.body.appendChild(feedback);
    
    // Remove the feedback after 2 seconds
    setTimeout(() => feedback.remove(), 2000);
    
    // Optionally, announce message via TTS (or any other action)
    this.announceMessage("G key pressed - visual indicator shown");
  }

  // Toggle screen reader functionality
  toggleScreenReader() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.announceMessage("Screen reader activated");
      this.scanPageElements();
    } else {
      this.stopReading();
      this.clearFocus();
      this.announceMessage("Screen reader deactivated");
    }
  }

  // Scan the page for interactive elements
  scanPageElements() {
    // Find all interactive elements including paragraphs and images
    this.interactiveElements = Array.from(document.querySelectorAll(
      'a, button, input, select, textarea, p, img, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"], [tabindex]'
    )).filter(el => {
      // Filter out hidden elements
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
  }

  // Navigate to the next interactive element
  navigateNext() {
    if (this.interactiveElements.length === 0) {
      this.scanPageElements();
      if (this.interactiveElements.length === 0) {
        this.announceMessage("No interactive elements found");
        return;
      }
    }
    
    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.interactiveElements.length;
    this.focusElement(this.interactiveElements[this.currentFocusIndex]);
  }

  // Navigate to the previous interactive element
  navigatePrevious() {
    if (this.interactiveElements.length === 0) {
      this.scanPageElements();
      if (this.interactiveElements.length === 0) {
        this.announceMessage("No interactive elements found");
        return;
      }
    }
    
    this.currentFocusIndex = (this.currentFocusIndex - 1 + this.interactiveElements.length) % this.interactiveElements.length;
    this.focusElement(this.interactiveElements[this.currentFocusIndex]);
  }

  // Focus on an element and announce it
  focusElement(element) {
    // Clear previous focus styling
    this.clearFocus();
    
    // Apply focus
    element.focus();
    
    // Add visual focus indicator
    const focusOutline = document.createElement('div');
    focusOutline.className = 'echolens-focus-indicator';
    focusOutline.style.position = 'absolute';
    const rect = element.getBoundingClientRect();
    focusOutline.style.left = (rect.left + window.scrollX - 4) + 'px';
    focusOutline.style.top = (rect.top + window.scrollY - 4) + 'px';
    focusOutline.style.width = (rect.width + 8) + 'px';
    focusOutline.style.height = (rect.height + 8) + 'px';
    focusOutline.style.border = `3px solid ${this.settings.focusColor}`;
    focusOutline.style.borderRadius = '3px';
    focusOutline.style.pointerEvents = 'none';
    focusOutline.style.zIndex = '999999';
    document.body.appendChild(focusOutline);
    
    // Scroll the element into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Announce the element
    const elementDescription = this.getElementDescription(element);
    this.announceMessage(elementDescription);
  }

  // Clear focus styling
  clearFocus() {
    const focusIndicators = document.querySelectorAll('.echolens-focus-indicator');
    focusIndicators.forEach(indicator => indicator.remove());
  }

  // Get a descriptive string for an element
  getElementDescription(element) {
    let description = '';
    
    // Get element type
    const tagName = element.tagName.toLowerCase();
    
    // Check ARIA roles
    const role = element.getAttribute('role');
    
    // Check for accessible name
    let name = element.getAttribute('aria-label') || 
               element.getAttribute('alt') || 
               element.getAttribute('title') || 
               element.textContent.trim();
    
    // Handle specific element types
    if (tagName === 'a') {
      description = `Link: ${name}`;
    } else if (tagName === 'button' || role === 'button') {
      description = `Button: ${name}`;
    } else if (tagName === 'input') {
      const inputType = element.getAttribute('type') || 'text';
      const value = element.value;
      description = `${inputType} input`;
      
      if (element.getAttribute('placeholder')) {
        description += `: ${element.getAttribute('placeholder')}`;
      }
      
      if (value) {
        description += `, value: ${value}`;
      }
      
      if (element.getAttribute('required')) {
        description += ', required';
      }
    } else if (tagName === 'select') {
      const selectedOption = element.options[element.selectedIndex];
      description = `Dropdown: ${element.getAttribute('name') || ''}`;
      if (selectedOption) {
        description += `, selected: ${selectedOption.textContent}`;
      }
    } else if (tagName === 'textarea') {
      description = `Text area: ${element.getAttribute('placeholder') || ''}`;
      if (element.value) {
        description += `, contains text`;
      }
    } else if (tagName === 'p') {
      const text = name || '';
      if (text.length > 100) {
        description = `Paragraph: ${text.substring(0, 100)}... (${text.length} characters)`;
      } else {
        description = `Paragraph: ${text}`;
      }
    } else if (tagName === 'img') {
      const alt = element.getAttribute('alt') || 'No alt text provided';
      const src = element.getAttribute('src') || '';
      const fileName = src.split('/').pop();
      description = `Image: ${alt}`;
      if (alt === 'No alt text provided' && fileName) {
        description += ` (filename: ${fileName})`;
      }
    } else {
      description = name;
    }
    
    // Include state information
    if (element.getAttribute('aria-expanded') === 'true') {
      description += ', expanded';
    } else if (element.getAttribute('aria-expanded') === 'false') {
      description += ', collapsed';
    }
    
    if (element.getAttribute('aria-checked') === 'true' || element.checked) {
      description += ', checked';
    } else if (element.getAttribute('aria-checked') === 'false') {
      description += ', not checked';
    }
    
    if (element.getAttribute('aria-disabled') === 'true' || element.disabled) {
      description += ', disabled';
    }
    
    return description;
  }

  // Activate the current element (click or otherwise interact)
  activateCurrentElement() {
    if (this.currentFocusIndex >= 0 && this.currentFocusIndex < this.interactiveElements.length) {
      const element = this.interactiveElements[this.currentFocusIndex];
      
      // Different activation based on element type
      if (element.tagName.toLowerCase() === 'input') {
        const inputType = element.getAttribute('type');
        if (inputType === 'checkbox' || inputType === 'radio') {
          element.checked = !element.checked;
          this.announceMessage(element.checked ? 'checked' : 'unchecked');
        } else {
          element.focus();
        }
      } else if (element.tagName.toLowerCase() === 'img') {
        // For images, just read the description again
        const description = this.getElementDescription(element);
        this.announceMessage(description);
      } else if (element.tagName.toLowerCase() === 'p') {
        // For paragraphs, read the full content
        this.announceMessage(`Reading paragraph: ${element.textContent.trim()}`);
      } else {
        // Click the element
        element.click();
      }
    }
  }

  // Read all headings on the page
  readHeadings() {
    // First stop any ongoing reading
    this.stopReading();
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]');
    if (headings.length === 0) {
      this.announceMessage("No headings found");
      return;
    }
    
    this.readingQueue = Array.from(headings).map(heading => {
      const level = heading.tagName ? parseInt(heading.tagName.charAt(1)) : 
                  heading.getAttribute('aria-level') || 2;
      return `Level ${level} heading: ${heading.textContent.trim()}`;
    });
    
    this.announceMessage(`${headings.length} headings found`);
    this.isReading = true;
    this.processReadingQueue();
  }

  // Read all paragraphs on the page
  readParagraphs() {
    // First stop any ongoing reading
    this.stopReading();
    
    const paragraphs = document.querySelectorAll('p');
    if (paragraphs.length === 0) {
      this.announceMessage("No paragraphs found");
      return;
    }
    
    this.readingQueue = Array.from(paragraphs).map(paragraph => {
      const text = paragraph.textContent.trim();
      if (text.length > 200) {
        return `Paragraph: ${text.substring(0, 200)}... continues`;
      }
      return `Paragraph: ${text}`;
    });
    
    this.announceMessage(`${paragraphs.length} paragraphs found`);
    this.isReading = true;
    this.processReadingQueue();
  }

  // Read all landmarks on the page
  readLandmarks() {
    // First stop any ongoing reading
    this.stopReading();
    
    const landmarks = document.querySelectorAll(
      'header, footer, main, nav, aside, section[aria-label], section[aria-labelledby], [role="banner"], [role="contentinfo"], [role="main"], [role="navigation"], [role="complementary"], [role="search"], [role="region"][aria-label], [role="region"][aria-labelledby]'
    );
    
    if (landmarks.length === 0) {
      this.announceMessage("No landmarks found");
      return;
    }
    
    this.readingQueue = Array.from(landmarks).map(landmark => {
      let type = landmark.tagName.toLowerCase();
      if (landmark.hasAttribute('role')) {
        type = landmark.getAttribute('role');
      }
      
      let name = landmark.getAttribute('aria-label') || '';
      const labelledby = landmark.getAttribute('aria-labelledby');
      if (labelledby) {
        const labelElement = document.getElementById(labelledby);
        if (labelElement) {
          name = labelElement.textContent.trim();
        }
      }
      
      return `${type} landmark${name ? ': ' + name : ''}`;
    });
    
    this.announceMessage(`${landmarks.length} landmarks found`);
    this.isReading = true;
    this.processReadingQueue();
  }

  // Read all images on the page
  readImages() {
    // First stop any ongoing reading
    this.stopReading();
    
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
      this.announceMessage("No images found");
      return;
    }
    
    this.readingQueue = Array.from(images).map(img => {
      const alt = img.getAttribute('alt') || 'No alt text provided';
      const src = img.getAttribute('src') || '';
      const fileName = src.split('/').pop();
      
      let description = `Image: ${alt}`;
      if (alt === 'No alt text provided' && fileName) {
        description += ` (filename: ${fileName})`;
      }
      
      return description;
    });
    
    this.announceMessage(`${images.length} images found`);
    this.isReading = true;
    this.processReadingQueue();
  }

  // Read all visible text on the page
  readAllText() {
    // Get all visible text from the body element
    const allVisibleText = document.body.innerText;
    if (!allVisibleText.trim()) {
      this.announceMessage("No text found on this page");
      return;
    }
    // You might want to split or chunk the text if it's very long,
    // but for simplicity, we'll announce it all at once.
    this.announceMessage(allVisibleText);
  }

  // Process the reading queue
  processReadingQueue() {
    if (this.readingQueue.length > 0 && this.isReading) {
      const nextItem = this.readingQueue.shift();
      this.announceMessage(nextItem, () => {
        setTimeout(() => {
          this.processReadingQueue();
        }, 500); // Small pause between items
      });
    }
  }

  // Stop current reading
  stopReading() {
    this.readingQueue = [];
    this.isReading = false;
    chrome.runtime.sendMessage({ action: 'stopSpeech' });
  }

  // Announce a message using text-to-speech
  announceMessage(message, callback) {
    chrome.runtime.sendMessage({
      action: 'speak',
      text: message,
      options: {
        rate: this.settings.speechRate,
        pitch: this.settings.speechPitch
      }
    }, callback);
  }
}

// Initialize the accessibility features
const echoLens = new EchoLensAccessibility();

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleScreenReader') {
    echoLens.toggleScreenReader();
    sendResponse({ success: true });
  } else if (message.action === 'updateSettings') {
    echoLens.settings = { ...echoLens.settings, ...message.settings };
    echoLens.applySettings();
    sendResponse({ success: true });
  } else if (message.action === 'readHeadings') {
    echoLens.readHeadings();
    sendResponse({ success: true });
  } else if (message.action === 'readLandmarks') {
    echoLens.readLandmarks();
    sendResponse({ success: true });
  } else if (message.action === 'readAllText') {
    echoLens.readAllText();
    sendResponse({ success: true });
  } else if (message.action === 'stopReading') {
    echoLens.stopReading();
    sendResponse({ success: true });
  } else if (message.action === 'readParagraphs') {
    echoLens.readParagraphs();
    sendResponse({ success: true });
  } else if (message.action === 'readImages') {
    echoLens.readImages();
    sendResponse({ success: true });
  } else if (message.action === 'describeImage') {
    // Handle image description request
    if (message.imageUrl) {
      const images = Array.from(document.querySelectorAll('img')).filter(img => 
        img.src === message.imageUrl || img.currentSrc === message.imageUrl
      );
      
      if (images.length > 0) {
        const img = images[0];
        const altText = img.alt || 'No image description available';
        echoLens.announceMessage(`Image: ${altText}`);
      }
    }
    sendResponse({ success: true });
  }
  return true; // Required for async response
});
