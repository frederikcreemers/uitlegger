import { useState, useEffect, useCallback } from "react";

export function useDutchSpeech() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dutchVoice, setDutchVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsAvailable(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const nlBEVoice = voices.find((voice) => voice.lang === "nl-BE");
      const nlNLVoice = voices.find((voice) => voice.lang === "nl-NL");

      const selectedVoice = nlBEVoice || nlNLVoice || null;
      setDutchVoice(selectedVoice);
      setIsAvailable(selectedVoice !== null);
    };

    loadVoices();

    const timeoutId = setTimeout(loadVoices, 100);

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      clearTimeout(timeoutId);
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!isAvailable || !dutchVoice || isSpeaking) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = dutchVoice;
    utterance.lang = dutchVoice.lang;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { isAvailable, isSpeaking, speak, stop };
}
