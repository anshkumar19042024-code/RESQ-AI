// Web Speech API Types
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void,
  lang: string = 'en-US'
) {
  if (!isSpeechRecognitionSupported()) {
    onError('Voice input is not supported in this browser. Please type your emergency description.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      finalTranscript += event.results[i][0].transcript;
    }
    onResult(finalTranscript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    let msg = 'Voice recognition error.';
    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      msg = 'Microphone permission was denied. Please type your description manually.';
    } else if (event.error === 'no-speech') {
      msg = 'No speech was detected. Please tap the mic and try speaking again.';
    }
    onError(msg);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}

export function speakText(text: string, lang: string = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (lang === 'ta') utterance.lang = 'ta-IN';
  else if (lang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-US';

  window.speechSynthesis.speak(utterance);
}
