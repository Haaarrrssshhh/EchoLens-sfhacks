/**
 * EchoLens - Accessibility Content Script
 * Provides core accessibility features for blind and low vision users
 */
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import 'dotenv/config';



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
    // this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Get current state
  getState() {
    return {
      isActive: this.isActive,
      isReading: this.isReading,
      settings: this.settings
    };
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
      this.applyFontSize(this.settings.fontSize);
    }
  }

  // Apply font size to all text elements
  applyFontSize(size) {
    const style = document.getElementById('echolens-font-size');
    if (style) {
      style.remove();
    }
    
    const newStyle = document.createElement('style');
    newStyle.id = 'echolens-font-size';
    newStyle.textContent = `
      body, p, h1, h2, h3, h4, h5, h6, span, div, a, button, input, select, textarea {
        font-size: ${size}px !important;
      }
    `;
    document.head.appendChild(newStyle);
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
    if (altKey && event.shiftKey && (event.key === 'A' || event.key === 'a')) {
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

      // Alt+G or Option+G to read all text
      else if (altKey && (event.key === 'g' || event.key === 'G')) {
        event.preventDefault();
        this.readAllText();
      }
      else if (event.key === 'g' || event.key === 'G') {
        this.handleGKey();
      }
      
      // Escape to stop reading
      else if (event.key === 'Escape') {
        event.preventDefault();
        this.stopReading();
      }
    }
  }

  // Placeholder function for the "G" key event with visual feedback
  async handleGKey() {
    const element = document.activeElement;

    if (!element) {
      this.announceMessage("No element is currently focused.");
      return;
    }

    if (element.tagName.toLowerCase() === "img") {
      const src = element.src;
      const alt = element.getAttribute("alt") || '';

      chrome.runtime.sendMessage(
        { action: "transcribeImage", imageUrl: src, altText: alt },
        (response) => {
          this.announceMessage(response.transcript || "No image transcript.");
        }
      );
    } else {
      const text = element.textContent?.trim() || element.value || '';
      if (!text) {
        this.announceMessage("No text found in the element.");
        return;
      }

      chrome.runtime.sendMessage(
        { action: "transcribeText", textContent: text },
        (response) => {
          this.announceMessage(response.transcript || "No text transcript.");
        }
      );
    }
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
    const allElements = Array.from(document.querySelectorAll(
      'a, button, input, select, textarea, p, img, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"], [tabindex], iframe, h1, h2, h3, h4, h5, h6'
    ));
    
    // Add meaningful divs that have direct text content
    const divs = Array.from(document.querySelectorAll('div'));
    const meaningfulDivs = divs.filter(div => {
      // Check if div has direct text content that's not just whitespace
      let hasDirectText = false;
      
      // Check direct childNodes for text nodes with content
      for (let i = 0; i < div.childNodes.length; i++) {
        const node = div.childNodes[i];
        // Check if it's a text node with non-whitespace content
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          hasDirectText = true;
          break;
        }
      }
      
      // Skip container divs that only have other elements as children
      if (!hasDirectText) {
        return false;
      }
      
      // Check if visible
      const style = window.getComputedStyle(div);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       style.opacity !== '0' &&
                       div.offsetParent !== null;
      
      // Additional check for zero-sized elements
      const hasSize = div.offsetWidth > 0 && div.offsetHeight > 0;
      
      return isVisible && hasSize;
    });
    
    // Combine all elements
    const combinedElements = [...allElements, ...meaningfulDivs];
    
    // Filter out hidden elements and those within iframes (since we can't access them)
    this.interactiveElements = combinedElements.filter(el => {
      // Skip elements without visible content
      if (el.tagName.toLowerCase() !== 'img' && 
          el.textContent.trim() === '' && 
          !el.getAttribute('aria-label') && 
          !el.getAttribute('alt') &&
          !el.getAttribute('title') &&
          !el.getAttribute('placeholder') &&
          el.tagName.toLowerCase() !== 'input' &&
          el.tagName.toLowerCase() !== 'textarea') {
        return false;
      }
      
      // Check if element is visible
      const style = window.getComputedStyle(el);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       style.opacity !== '0' &&
                       el.offsetParent !== null;
      
      // Additional check for zero-sized elements
      const hasSize = el.offsetWidth > 0 && el.offsetHeight > 0;
      
      // Don't include elements that are just containers for other elements
      // (unless they're designated as interactive elements like buttons)
      if (el.tagName.toLowerCase() === 'div') {
        // We already filtered divs separately above
        return true;
      }
      
      return isVisible && hasSize;
    });
    
    // Sort elements based on their visual position in the document
    this.sortElementsByPosition();
  }

  // Sort elements by their visual position in the document
  sortElementsByPosition() {
    // Get the document dimensions for reference
    const docWidth = document.documentElement.clientWidth;
    
    // Define logical "rows" of elements
    const rows = [];
    const processedElements = new Set();
    
    // First sort roughly by vertical position
    const sortedByTop = [...this.interactiveElements].sort((a, b) => {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
    
    // Group elements into rows
    sortedByTop.forEach(element => {
      if (processedElements.has(element)) {
        return;
      }
      
      const rect = element.getBoundingClientRect();
      
      // Find existing row that this element could belong to
      let foundRow = false;
      for (const row of rows) {
        // Check if the element is in the vertical range of this row
        // Use a smaller threshold (10px) for greater accuracy
        const rowTop = row.top;
        const rowBottom = row.bottom;
        
        if (
          (rect.top >= rowTop - 10 && rect.top <= rowBottom + 10) ||
          (rect.bottom >= rowTop - 10 && rect.bottom <= rowBottom + 10) ||
          (rect.top <= rowTop && rect.bottom >= rowBottom)
        ) {
          row.elements.push(element);
          
          // Update row boundaries if necessary
          if (rect.top < row.top) row.top = rect.top;
          if (rect.bottom > row.bottom) row.bottom = rect.bottom;
          
          processedElements.add(element);
          foundRow = true;
          break;
        }
      }
      
      // If no existing row fits, create a new one
      if (!foundRow) {
        rows.push({
          top: rect.top,
          bottom: rect.bottom,
          elements: [element]
        });
        processedElements.add(element);
      }
    });
    
    // Sort each row's elements from left to right
    rows.forEach(row => {
      row.elements.sort((a, b) => {
        return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
      });
    });
    
    // Ensure rows are sorted from top to bottom
    rows.sort((a, b) => a.top - b.top);
    
    // Flatten the sorted rows back into a single array
    this.interactiveElements = rows.flatMap(row => row.elements);
    
    // Post-processing to handle special cases
    this.handleSpecialCases();
  }
  
  // Handle special cases like tables, multi-column layouts, etc.
  handleSpecialCases() {
    // Check for tables and ensure cells are navigated in the right order
    const tables = document.querySelectorAll('table');
    if (tables.length > 0) {
      // Find table elements in our interactive elements
      const tableElements = this.interactiveElements.filter(el => {
        let parent = el;
        while (parent) {
          if (parent.tagName && parent.tagName.toLowerCase() === 'table') {
            return true;
          }
          parent = parent.parentElement;
        }
        return false;
      });
      
      if (tableElements.length > 0) {
        // Re-sort table elements by their row and column position
        tableElements.sort((a, b) => {
          const aRow = this.getTableRowIndex(a);
          const bRow = this.getTableRowIndex(b);
          
          if (aRow !== bRow) {
            return aRow - bRow;
          }
          
          const aCol = this.getTableColumnIndex(a);
          const bCol = this.getTableColumnIndex(b);
          return aCol - bCol;
        });
        
        // Replace the original table elements with the sorted ones
        this.interactiveElements = this.interactiveElements.filter(el => {
          let parent = el;
          while (parent) {
            if (parent.tagName && parent.tagName.toLowerCase() === 'table') {
              return false;
            }
            parent = parent.parentElement;
          }
          return true;
        }).concat(tableElements);
      }
    }
  }
  
  // Helper to get the row index of a table cell
  getTableRowIndex(element) {
    let current = element;
    while (current && current.tagName.toLowerCase() !== 'tr') {
      current = current.parentElement;
    }
    
    if (!current) return 0;
    
    const table = current.closest('table');
    if (!table) return 0;
    
    const rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] === current) {
        return i;
      }
    }
    return 0;
  }
  
  // Helper to get the column index of a table cell
  getTableColumnIndex(element) {
    let current = element;
    while (current && current.tagName.toLowerCase() !== 'td' && current.tagName.toLowerCase() !== 'th') {
      current = current.parentElement;
    }
    
    if (!current) return 0;
    
    const row = current.closest('tr');
    if (!row) return 0;
    
    const cells = row.querySelectorAll('td, th');
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === current) {
        return i;
      }
    }
    return 0;
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
    
    // Apply focus - try-catch to handle potential errors for some elements
    try {
      element.focus();
    } catch (e) {
      console.log('Could not focus element', e);
    }
    
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
      // For paragraphs, provide a complete description without truncation
      const text = name || '';
      description = `Paragraph: ${text}`;
    } else if (tagName === 'img') {
      const alt = element.getAttribute('alt') || 'No alt text provided';
      const src = element.getAttribute('src') || '';
      const fileName = src.split('/').pop();
      description = `Image: ${alt}`;
      if (alt === 'No alt text provided' && fileName) {
        description += ` (filename: ${fileName})`;
      }
    } else if (tagName === 'iframe') {
      description = 'Iframe content';
      if (element.getAttribute('title')) {
        description += `: ${element.getAttribute('title')}`;
      }
    } else if (tagName === 'div') {
      if (name && name.length > 0) {
        description = `Content: ${name}`;
      } else {
        description = 'Content container';
      }
    } else if (tagName.match(/^h[1-6]$/)) {
      // Handle heading elements (h1-h6)
      const level = tagName.charAt(1);
      description = `Heading level ${level}: ${name}`;
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
        // Try to click the element but catch any errors
        try {
          element.click();
        } catch (e) {
          console.log('Could not click element', e);
          // As a fallback, read the element's description
          this.announceMessage(this.getElementDescription(element));
        }
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
      return text;
    });

    this.announceMessage(`${paragraphs.length} paragraphs found`);
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
    console.log("Announcing:", message);
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
  } else if (message.action === 'getScreenReaderState') {
    sendResponse({ isActive: echoLens.isActive });
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
