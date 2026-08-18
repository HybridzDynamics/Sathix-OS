import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { chat, transcribe } from '../api/backend';
import { translations } from '../utils/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectScheme: (schemeId: string) => void;
  onSearchQuery: (query: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose, language, onSearchQuery }) => {
  const [isListening, setIsListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const t = translations[language] || translations.en;

  useEffect(() => () => recorder.current?.stream.getTracks().forEach((track) => track.stop()), []);
  if (!isOpen) return null;

  async function startRecording() {
    setError(''); setAiResponse(''); setSpokenText('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError('Voice recording is not supported in this browser.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const current = new MediaRecorder(stream);
      current.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audio = new Blob(chunks.current, { type: current.mimeType || 'audio/webm' });
        if (!audio.size) { setError('No audio was captured. Please try again.'); return; }
        setProcessing(true);
        try {
          const transcription = await transcribe(audio);
          const query = transcription.data.text.trim();
          if (!query) throw new Error('No speech was detected. Please try again.');
          setSpokenText(query);
          const result = await chat(query, language);
          setAiResponse(result.answer || 'No relevant information was found.');
        } catch (cause) { setError(cause instanceof Error ? cause.message : 'Voice processing is unavailable. Please try again.'); }
        finally { setProcessing(false); }
      };
      recorder.current = current;
      current.start();
      setIsListening(true);
    } catch { setError('Microphone permission is required to use voice input.'); }
  }

  function stopRecording() { if (recorder.current?.state === 'recording') recorder.current.stop(); setIsListening(false); }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-xs sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="voice-title">
    <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col items-center overflow-y-auto rounded-t-3xl border border-slate-100 bg-white p-6 text-center shadow-2xl sm:rounded-3xl">
      <button onClick={onClose} aria-label="Close voice assistant" className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#BBDEFB] bg-[#E3F2FD] px-3 py-1 text-xs font-semibold text-[#1565C0]"><Sparkles className="h-3.5 w-3.5" />SathiX OS Voice Assistant</div>
      <button onClick={isListening ? stopRecording : startRecording} disabled={processing} aria-label={isListening ? 'Stop recording' : 'Start recording'} className={`my-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg disabled:opacity-60 ${isListening ? 'animate-pulse bg-[#2196F3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{isListening ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7" />}</button>
      <h3 id="voice-title" className="mt-2 text-base font-bold text-[#1A237E] sm:text-lg">{processing ? 'Processing your request…' : isListening ? t.voiceListening : 'Tap the microphone to speak'}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 sm:text-sm">{isListening ? 'Tap again when you have finished speaking.' : t.voicePrompt}</p>
      {error && <p role="alert" className="mt-5 w-full rounded-2xl bg-red-50 p-3 text-left text-sm text-red-800">{error}</p>}
      {(spokenText || aiResponse) && <div className="mt-5 w-full space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-left">
        {spokenText && <div className="flex gap-2.5"><span className="shrink-0 pt-0.5 text-xs font-bold uppercase text-slate-400">You:</span><p className="text-sm font-semibold text-[#1A237E]">{spokenText}</p></div>}
        {aiResponse && <div className="flex gap-2.5 border-t border-slate-200/60 pt-3"><Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2196F3]" /><div><p className="text-sm leading-relaxed text-slate-700">{aiResponse}</p><button onClick={() => { onSearchQuery(spokenText); onClose(); }} className="mt-3 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#E3F2FD]">Show matching schemes</button></div></div>}
      </div>}
    </div>
  </div>;
};
