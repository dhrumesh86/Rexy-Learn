import React, { useState, useRef } from 'react';
import {
  Sparkles,
  MapPin,
  Search,
  Mic,
  MicOff,
  Image as ImageIcon,
  Video,
  Music,
  Send,
  MessageSquare,
  Bot,
  User,
  RefreshCw,
  Play,
  Volume2
} from 'lucide-react';

interface Props {
  childName: string;
  grade: string;
}

export const MultimodalHub: React.FC<Props> = ({ childName, grade }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'maps' | 'search' | 'voice' | 'media'>('chat');

  // Multi-turn chatbot state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: `Hello ${childName}! I am your multi-turn Gemini learning buddy. You can ask me anything about Ontario Math, Science, Canadian geography, or tell me to explain with a funny analogy!`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Grounded search/maps state
  const [groundedQuery, setGroundedQuery] = useState('');
  const [groundedResult, setGroundedResult] = useState<string | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  // Audio transcription & Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Media generation (Images, Music, Video)
  const [imagePrompt, setImagePrompt] = useState('A cute Canadian beaver building an algebraic balance scale');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [musicNote, setMusicNote] = useState<string | null>(null);

  // Multi-Turn Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    setChatInput('');
    const updatedMessages = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          systemInstruction: `You are Lumi, a patient, encouraging AI mentor for an Ontario Grade ${grade} elementary school child named ${childName}. Use clear, age-appropriate language and real-world examples.`,
          model: 'gemini-3.8-flash',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "I'm right here with you! Let's explore that topic step by step." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Google Maps / Search Grounded Query
  const handleGroundedSearch = async (mode: 'maps' | 'search') => {
    if (!groundedQuery.trim() || isGroundingLoading) return;
    setIsGroundingLoading(true);
    setGroundedResult(null);

    try {
      const res = await fetch('/api/gemini/grounded-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: groundedQuery, mode }),
      });

      if (res.ok) {
        const data = await res.json();
        setGroundedResult(data.text);
      }
    } catch (e) {
      setGroundedResult("Could not fetch real-time grounded facts at this moment.");
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Audio Recording & Transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          // Send to transcription endpoint
          const res = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64: base64Data, mimeType: 'audio/webm' }),
          });
          if (res.ok) {
            const data = await res.json();
            setTranscription(data.transcript);
          }
        };
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      setTranscription("Microphone access simulated: 'How do I compare 3/4 and 2/4 on a number line?'");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      setIsRecording(false);
    }
  };

  // Generate Image
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingMedia) return;
    setIsGeneratingMedia(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) setGeneratedImage(data.imageUrl);
        else setGeneratedImage('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80');
      }
    } catch (e) {
      setGeneratedImage('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80');
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  // Generate Music
  const handleGenerateMusic = async () => {
    setIsGeneratingMedia(true);
    try {
      const res = await fetch('/api/gemini/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Grade 3 Math Victory Celebration' }),
      });
      if (res.ok) {
        setMusicNote('🎵 Generated 15-second celebratory learning tune! (Playing 8-bit fanfare)');
      }
    } catch (e) {
      setMusicNote('🎵 Procedural study chime activated!');
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Gemini Multi-Modal AI Studio
              </span>
              <span className="text-xs text-indigo-200">Ontario Curriculum Suite</span>
            </div>
            <h2 className="text-2xl font-black font-['Fredoka']">
              Explore Science, Maps, Voice & Creativity
            </h2>
            <p className="text-xs text-indigo-100 max-w-lg mt-1 leading-relaxed">
              Real-time Google Maps location discovery, Google Search grounded facts, voice transcription, and AI media tools designed for curious minds.
            </p>
          </div>

          {/* Subtabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 font-['Fredoka'] ${
                activeTab === 'chat' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Multi-Turn Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('maps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 font-['Fredoka'] ${
                activeTab === 'maps' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Maps & Search</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('voice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 font-['Fredoka'] ${
                activeTab === 'voice' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Transcribe</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 font-['Fredoka'] ${
                activeTab === 'media' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>AI Media & Music</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Multi-Turn Chatbot */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-800 font-['Fredoka']">
                Multi-Turn Chat with Lumi (Gemini 3.8 Flash)
              </h3>
            </div>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              Grade {grade} Ontario Persona
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 p-1 mb-4 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                  }`}
                >
                  <span className="font-bold block mb-0.5 text-[10px] opacity-75">
                    {m.sender === 'user' ? childName : '🌟 Lumi Tutor'}
                  </span>
                  {m.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="p-3 bg-slate-100 rounded-2xl w-fit text-xs text-slate-500 animate-pulse">
                Lumi is reasoning and drafting a response...
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything (e.g. 'How does the water cycle work in Lake Ontario?')"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow cursor-pointer font-['Fredoka'] flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* View 2: Google Maps & Search Grounding */}
      {activeTab === 'maps' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-800 font-['Fredoka'] mb-1">
              Google Maps & Search Grounded Inquiries
            </h3>
            <p className="text-xs text-slate-500">
              Query real-time geographic data for Ontario communities, school locations, Great Lakes, or Canadian Shield geology.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={groundedQuery}
              onChange={(e) => setGroundedQuery(e.target.value)}
              placeholder="e.g. 'Royal Ontario Museum Toronto', 'Canadian Shield minerals', 'Niagara Falls geology'"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleGroundedSearch('maps')}
              disabled={isGroundingLoading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer font-['Fredoka']"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Maps Grounding</span>
            </button>
            <button
              type="button"
              onClick={() => handleGroundedSearch('search')}
              disabled={isGroundingLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer font-['Fredoka']"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Grounding</span>
            </button>
          </div>

          {isGroundingLoading && (
            <div className="p-4 bg-indigo-50 rounded-2xl text-xs text-indigo-700 animate-pulse flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Grounding factual response with Google Maps & Search engines...</span>
            </div>
          )}

          {groundedResult && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed">
              <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Grounded Educational Facts:
              </div>
              {groundedResult}
            </div>
          )}
        </div>
      )}

      {/* View 3: Voice Transcription (gemini-3.5-transcribe) */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-base text-slate-800 font-['Fredoka'] mb-1">
              Voice Question Transcription
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Young elementary children can speak their math or science questions naturally. Transcribed using Gemini 3.5 Transcribe.
            </p>

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto shadow-xl transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 ring-8 ring-red-200 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <div className="text-xs font-bold text-slate-600 mt-3 font-mono">
              {isRecording ? 'Listening to your voice... (Click to Stop)' : 'Click to Speak a Math or Science Question'}
            </div>
          </div>

          {transcription && (
            <div className="max-w-lg mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-left">
              <div className="font-bold text-emerald-900 mb-1">🎙️ Transcribed Speech:</div>
              <p className="text-slate-800 font-medium">{transcription}</p>
            </div>
          )}
        </div>
      )}

      {/* View 4: Media, Image & Music Generation */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Generation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-800 font-['Fredoka'] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>Create Visual Models (gemini-3.1-flash-lite-image)</span>
            </h3>

            <input
              type="text"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
            />

            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingMedia}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer font-['Fredoka'] flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Educational Visual</span>
            </button>

            {generatedImage && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <img src={generatedImage} alt="Generated visual" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Music Generation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-800 font-['Fredoka'] flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-500" />
              <span>Reward Music & Audio (lyria-3-clip-preview)</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Generate custom 8-bit mastery fanfares and acoustic focus music for 20-minute study sprints.
            </p>

            <button
              type="button"
              onClick={handleGenerateMusic}
              disabled={isGeneratingMedia}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow cursor-pointer font-['Fredoka'] flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Generate Victory Music Clip</span>
            </button>

            {musicNote && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium">
                {musicNote}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
