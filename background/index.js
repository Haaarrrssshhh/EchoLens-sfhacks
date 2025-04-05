import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function getTextTranscript(textContent) {
  try {
    console.log("Sending text to Gemini:", textContent); // 🔍 DEBUG

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = "Transcribe the following text for a blind user.";
    const result = await model.generateContent([prompt, textContent]);

    const transcript = await result.response.text();
    console.log("Gemini transcript result:", transcript); // ✅ DEBUG

    return transcript;
  } catch (err) {
    console.error("Text transcription error:", err); // ❌ SHOW THE ERROR
    return "Sorry, I couldn't transcribe the text.";
  }
}


async function getImageTranscript(imageUrl, altText = '') {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: blob.type
      }
    };

    const prompt = "Describe this image for a blind user.";
    const contentPrompt = `Alt text: ${altText}`;

    const result = await model.generateContent([prompt, contentPrompt, imagePart]);
    return result.response.text();
  } catch (err) {
    console.error("Image transcription error:", err);
    return "Sorry, I couldn't transcribe the image.";
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'transcribeText':
      getTextTranscript(message.textContent).then(transcript => sendResponse({ transcript }));
      return true;
    case 'transcribeImage':
      getImageTranscript(message.imageUrl, message.altText).then(transcript => sendResponse({ transcript }));
      return true;
    case 'speak':
      speak(message.text, message.options, sendResponse);
      return true;
    case 'stopSpeech':
      chrome.tts.stop();
      sendResponse({ success: true });
      break;
  }
});

function speak(text, options = {}, callback) {
  if (!text) {
    if (callback) callback();
    return;
  }

  const ttsOptions = {
    rate: options.rate || 1.0,
    pitch: options.pitch || 1.0,
    voiceName: options.voiceName || '',
    onEvent: (event) => {
      if (['end', 'interrupted', 'error'].includes(event.type)) {
        if (callback) callback();
      }
    }
  };

  chrome.tts.speak(text, ttsOptions);
}
