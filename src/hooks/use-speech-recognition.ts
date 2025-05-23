// src/hooks/use-speech-recognition.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setBrowserSupportsSpeechRecognition(true);
      const recogInstance = new SpeechRecognitionAPI();
      recogInstance.continuous = false;
      recogInstance.interimResults = true;
      recogInstance.lang = 'en-US'; // Can be configured

      recogInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript || interimTranscript);
        if (finalTranscript) {
            // Automatically stop if continuous is false and we have a final result
            // For better control, we let stopListening handle this
        }
      };

      recogInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
      };

      recogInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recogInstance);
    } else {
      setBrowserSupportsSpeechRecognition(false);
      setError("Speech recognition not supported by this browser.");
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        setTranscript('');
        setError(null);
        recognition.start();
        setIsListening(true);
      } catch (e) {
        setError('Failed to start recognition. Already started?');
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  };
};

export default useSpeechRecognition;
