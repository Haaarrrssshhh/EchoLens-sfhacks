# 🔊 Echo Lens – Accessibility Browser Extension

**Echo Lens** is an AI-enhanced browser extension designed to empower users who are blind or have low vision by making web browsing more inclusive, intelligent, and effortless. With robust screen reading, smart image transcription using Gemini, and keyboard-first navigation, Echo Lens delivers an enhanced accessible experience on any webpage.

---
## 🖼️ Screenshots

<div align="center">
  <img src="./assets/Echo Lens - Popup.png"
  width=31% alt="Watch the demo video"/>
  <img src="./assets/Echo Lens - Language Dropdown.png"
  width=31% alt="Watch the demo video"/>
  <img src="./assets/Echo Lens - Shortcuts.png"
  width=31% alt="Watch the demo video"/>
</div>
<p style="center">


## 🚀 Features

- 🎤 **Personalise Screen Reading**  
  Reads web page content aloud using the Web Speech API with customizable voice and speed settings.

- 👁️‍🗨️ **Smart Image Descriptions**  
  Uses Gemini Vision API to generate rich, contextual image descriptions—even when `alt` tags are missing.

- ⌨️ **Keyboard Navigation**  
  Navigate through links, forms, headings, and sections using intuitive keyboard shortcuts.

- 🧠 **Semantic Structure Recognition**  
  Understands and announces semantic elements such as headings, lists, tables, and sections.

- ♿ **ARIA Role Support**  
  Full support for ARIA roles, landmarks, and live regions.

- 🎨 **High Contrast & Readability Modes**  
  Switch to dark mode, high contrast, or customized font settings for better visual accessibility.

- ✍️ **Text Customization**  
  Control font size, line spacing, and typography for optimal readability.

- 🌟 **Focus Highlighting**  
  Visually highlights the currently focused element during keyboard navigation.
- 🌐 **Multilingual Support**<br>
  Users can also manually select their preferred language for speech output. Supported languages include (but are not limited to):
    - English 🇺🇸
    - Spanish 🇪🇸
    - Hindi 🇮🇳
    - French 🇫🇷
    - Chinese 🇨🇳
---

## 🧰 Tech Stack

| Layer          | Technologies                          |
| -------------- | ------------------------------------- |
| Frontend       | JavaScript, HTML, CSS                 |
| Extension APIs | Web Extension API (Manifest v3)       |
| Accessibility  | Web Speech API, ARIA, Keyboard Events |
| AI Backend     | Gemini Pro Vision API                 |
| Image Support  | Base64 / Blob image data for Gemini   |

---

## 🛠️ Installation

### 👉 Load the Extension Locally

1. Create a .env file:
  ```bash
  VITE_GEMINI_API_KEY=your_api_key_here
  ``` 

2. Clone this repository:
   ```bash
   git clone https://github.com/your-username/echolens.git
   cd echolens
   ```
3. Install dependencies:
   ```bash
   npm install

4. Build the extension:
   ```bash
   npm run build
   ```

5. Load into Chrome:
- Visit chrome://extensions
- Enable Developer Mode
- Click Load Unpacked
- Select the dist/ or build/ folder

