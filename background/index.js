import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function getTextTranscript(textContent, targetLanguage = 'English') {
  try {
    console.log(`Sending text to Gemini for translation to ${targetLanguage}:`, textContent);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Translate the following text into ${targetLanguage}. Also, provide a concise transcription suitable for a blind user, focusing on essential information. Return ONLY the translated text.`;

    const result = await model.generateContent([prompt, textContent]);

    const transcript = await result.response.text();
    console.log("Gemini transcript result:", transcript); // ✅ DEBUG

    return transcript;
  } catch (err) {
    console.error("Text transcription error:", err); // ❌ SHOW THE ERROR
    return "Sorry, I couldn't transcribe the text.";
  }
}


async function getImageTranscript(imageUrl, altText = '', targetLanguage = 'English') {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: blob.type
      }
    };

    const prompt = `Describe this image concisely in ${targetLanguage} for a blind user, focusing on the key elements that convey its primary meaning or purpose. Omit unnecessary details or subjective interpretations. Prioritize information that would be most helpful for understanding the image's context and relevance. Return ONLY the description in ${targetLanguage}.`;
    const contentPrompt = `Alt text (if any): ${altText || 'None'}`;

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
      chrome.storage.sync.get('targetLanguage', (data) => {
        const lang = data.targetLanguage || 'English';
        getTextTranscript(message.textContent, lang).then(transcript => sendResponse({ transcript }));
      });
      return true;
    case 'transcribeImage':
      chrome.storage.sync.get('targetLanguage', (data) => {
        const lang = data.targetLanguage || 'English';
        console.log('lang', lang);
        getImageTranscript(message.imageUrl, message.altText, lang).then(transcript => sendResponse({ transcript }));
      });
      return true;
    case 'speak':
      chrome.storage.sync.get('targetLanguage', (data) => {
        const lang = data.targetLanguage || 'English';
        speak(message.text, message.options, sendResponse, lang);
      })
      return true;
    case 'stopSpeech':
      chrome.tts.stop();
      isSpeaking = false;
      sendResponse({ success: true });
      break;
    case 'getSettings':
      chrome.storage.sync.get(['speechRate', 'highContrast'], (result) => {
        console.log('Background: Retrieved settings from storage:', result); // Log retrieved settings
        sendResponse({ settings: result });
      });
      return true;
  }
});

let isSpeaking = false;

function speak(text, options = {}, callback, lang = "English") {
  if (!text) {
    if (callback) callback();
    return;
  }

  isSpeaking = true;

  const languageMap = {
    English: { langCode: "en-US", voiceName: "Google US English" },
    Hindi: { langCode: "hi-IN", voiceName: "Google हिन्दी" },
    Chinese: { langCode: "zh-CN", voiceName: "Google 中文（普通话）" },
    French: { langCode: "fr-FR", voiceName: "Google français" },
    Spanish: { langCode: "es-ES", voiceName: "Google español" }
  };

  const selected = languageMap[lang] || languageMap["English"];

  const ttsOptionsBase = {
    lang: selected.langCode,
    voiceName: selected.voiceName,
    rate: options.rate || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0
  };

  const sentences = text.match(/[^\.!\?]+[\.!\?]*/g) || [text];

  function speakNext(index) {
    if (!isSpeaking || index >= sentences.length) {
      isSpeaking = false;
      if (callback) callback();
      return;
    }

    chrome.tts.speak(sentences[index].trim(), {
      ...ttsOptionsBase,
      onEvent: (event) => {
        if (['end', 'interrupted', 'error'].includes(event.type)) {
          speakNext(index + 1);
        }
      }
    });
  }

  speakNext(0);
}

