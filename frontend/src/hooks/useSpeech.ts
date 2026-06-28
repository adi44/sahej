import { useState, useRef, useCallback } from "react";
import api from "../api/client";

export type Lang = "en-IN" | "hi-IN";

// SpeechRecognition is not in all tsconfig DOM libs — declare minimally
interface ISpeechResult {
  readonly isFinal: boolean;
  readonly [index: number]: { readonly transcript: string };
}
interface ISpeechRecognitionEvent {
  readonly results: ISpeechResult[] & { readonly length: number };
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}
type ISpeechRecognitionCtor = new () => ISpeechRecognition;

const SpeechRecognitionAPI: ISpeechRecognitionCtor | undefined =
  typeof window !== "undefined"
    ? ((window as unknown as Record<string, unknown>)["SpeechRecognition"] as ISpeechRecognitionCtor) ??
      ((window as unknown as Record<string, unknown>)["webkitSpeechRecognition"] as ISpeechRecognitionCtor)
    : undefined;

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en-IN");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sttSupported = !!SpeechRecognitionAPI;
  const ttsSupported = true; // ElevenLabs via backend

  // ── STT ────────────────────────────────────────────────────────────────────

  const startListening = useCallback(
    (onTranscript: (text: string, final: boolean) => void) => {
      if (!SpeechRecognitionAPI) return;

      recognitionRef.current?.stop();

      const rec = new SpeechRecognitionAPI();
      rec.lang = lang;
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;

      rec.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((r: ISpeechResult) => r[0].transcript)
          .join("");
        const isFinal = e.results[e.results.length - 1].isFinal;
        onTranscript(transcript, isFinal);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);

      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    },
    [lang]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // ── TTS (ElevenLabs via backend) ───────────────────────────────────────────

  const speak = useCallback(
    async (text: string, id: string) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setSpeakingId(null);
      }

      setSpeakingId(id);
      try {
        const resp = await api.post("/tts/", {
          text,
          lang: lang.startsWith("hi") ? "hi" : "en",
        }, { responseType: "blob" });

        const url = URL.createObjectURL(resp.data);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setSpeakingId(null);
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };
        audio.onerror = () => {
          setSpeakingId(null);
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };

        await audio.play();
      } catch {
        setSpeakingId(null);
      }
    },
    [lang]
  );

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeakingId(null);
  }, []);

  return {
    listening,
    speakingId,
    lang,
    setLang,
    sttSupported,
    ttsSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
