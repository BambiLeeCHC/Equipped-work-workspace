import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  Video, VideoOff, Mic, MicOff, ScreenShare,
  LogOut, Activity, MessageCircle,
  Send, ChevronDown, ChevronUp, Minimize2,
  Presentation, Users, GraduationCap, Coffee, Building2, Monitor,
  ListOrdered, Play, SkipForward, FlipHorizontal2,
  Volume2, FileText, Lightbulb, CheckCircle2, TrendingUp
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { VirtualBackgroundPicker } from "./DeviceSetup";

/* ═══════════════════════════════════════════════════
   ROOM BACKGROUND IMAGES
   Maps room types → photorealistic AI-generated images
   ═══════════════════════════════════════════════════ */
const ROOM_BG_IMAGES: Record<string, string> = {
  office: "/images/room-bg-office.jpg",
  one_on_one: "/images/room-bg-office.jpg",
  private: "/images/room-bg-office.jpg",
  meeting: "/images/room-bg-meeting.jpg",
  conference: "/images/room-bg-meeting.jpg",
  lounge: "/images/room-bg-lounge.jpg",
  break: "/images/room-bg-lounge.jpg",
  focus: "/images/room-bg-focus.jpg",
  collab: "/images/room-bg-collab.jpg",
  open: "/images/room-bg-collab.jpg",
  training: "/images/room-bg-collab.jpg",
  auditorium: "/images/room-bg-meeting.jpg",
  presentation: "/images/room-bg-meeting.jpg",
};

function getRoomBgImage(roomType: string): string {
  const t = roomType?.toLowerCase() || "";
  for (const [key, img] of Object.entries(ROOM_BG_IMAGES)) {
    if (t.includes(key)) return img;
  }
  return "/images/room-bg-office.jpg";
}

/* ═══════════════════════════════════════════════════
   SCREEN SHARE HOOK
   Uses getDisplayMedia to capture the user's screen.
   Stores the stream in state (not just a ref) so React
   re-renders the video element with the live stream.
   ═══════════════════════════════════════════════════ */
function useScreenShare() {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const isSharing = !!screenStream;

  /*  Callback ref — runs every time the <video> node mounts/unmounts
      AND every time screenStream changes (because we pass screenStream
      in the useCallback dep array, React gives us a new ref identity
      which forces the <video ref={…}> to re-fire). */
  const screenVideoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (node && screenStream) {
        node.srcObject = screenStream;
        node.play().catch(() => {});
      }
    },
    [screenStream],
  );

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      });
      setScreenStream(stream);

      // Listen for the user clicking "Stop sharing" in the browser chrome
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        setScreenStream(null);
      });
    } catch (err: any) {
      // User cancelled the picker — not an error
      if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
        console.warn("Screen share failed:", err);
      }
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    setScreenStream((prev) => {
      if (prev) {
        for (const track of prev.getTracks()) track.stop();
      }
      return null;
    });
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (screenStream) {
      stopScreenShare();
    } else {
      await startScreenShare();
    }
  }, [screenStream, startScreenShare, stopScreenShare]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setScreenStream((prev) => {
        if (prev) {
          for (const track of prev.getTracks()) track.stop();
        }
        return null;
      });
    };
  }, []);

  return { screenVideoCallbackRef, isSharing, toggleScreenShare, stopScreenShare };
}

/* ═══════════════════════════════════════════════════
   LOCAL CAMERA / MIC HOOK
   Manages getUserMedia for the local user's camera & mic
   Returns stream ref for audio analysis
   ═══════════════════════════════════════════════════ */
function useLocalMedia(isVideoOn: boolean, isAudioOn: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startMedia = useCallback(async () => {
    try {
      setCameraError(null);
      // Always request audio to keep the stream alive for audio meter
      const constraints: MediaStreamConstraints = {
        video: isVideoOn
          ? { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" }
          : false,
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Mute audio tracks if isAudioOn is false
      for (const track of stream.getAudioTracks()) {
        track.enabled = isAudioOn;
      }

      if (videoRef.current && isVideoOn) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Media access failed:", err);
      if (err.name === "NotAllowedError") {
        setCameraError("Camera/mic permission denied. Check browser settings.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera/microphone found on this device.");
      } else {
        setCameraError("Could not access camera/microphone.");
      }
    }
  }, [isVideoOn, isAudioOn]);

  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    startMedia();
    return () => stopMedia();
  }, [isVideoOn]); // re-acquire when video toggles

  /* Toggle audio tracks live */
  useEffect(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getAudioTracks()) {
        track.enabled = isAudioOn;
      }
    }
  }, [isAudioOn]);

  return { videoRef, streamRef, cameraError };
}

/* ═══════════════════════════════════════════════════
   AUDIO LEVEL METER HOOK
   Uses Web Audio API AnalyserNode to read volume
   ═══════════════════════════════════════════════════ */
function useAudioLevel(streamRef: React.RefObject<MediaStream | null>, isAudioOn: boolean) {
  const [level, setLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isAudioOn || !streamRef.current) {
      setLevel(0);
      return;
    }

    const stream = streamRef.current;
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setLevel(0);
      return;
    }

    try {
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        // Average volume level 0-255, normalize to 0-1
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length / 255;
        setLevel(avg);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.warn("AudioContext failed:", e);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current?.state !== "closed") {
        audioCtxRef.current?.close().catch(() => {});
      }
    };
  }, [isAudioOn, streamRef.current]);

  return level;
}

/* ═══════════════════════════════════════════════════
   AUDIO LEVEL INDICATOR — visual decibel bars
   ═══════════════════════════════════════════════════ */
function AudioLevelBars({ level, size = "md" }: { level: number; size?: "sm" | "md" }) {
  const barCount = size === "sm" ? 4 : 5;
  const h = size === "sm" ? "h-3" : "h-4";
  return (
    <div className="flex items-end gap-0.5">
      {Array.from({ length: barCount }).map((_, i) => {
        const threshold = (i + 1) / barCount;
        const active = level >= threshold * 0.5;
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-75 ${h}`}
            style={{
              height: `${6 + i * (size === "sm" ? 3 : 4)}px`,
              backgroundColor: active
                ? level > 0.6 ? "#ef4444" : level > 0.3 ? "#eab308" : "#22c55e"
                : "rgba(255,255,255,0.15)",
              transform: active ? "scaleY(1)" : "scaleY(0.6)",
              transformOrigin: "bottom",
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIVE TRANSCRIPTION HOOK
   Uses Web Speech API for real-time speech-to-text
   ═══════════════════════════════════════════════════ */
function useLiveTranscription(
  meetingId: string | null,
  isAudioOn: boolean,
  displayName: string,
) {
  const addChunk = useMutation(api.workspace.addTranscriptChunk);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!meetingId || !isAudioOn) {
      setIsListening(false);
      setInterimText("");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }

    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = async (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) {
            try {
              await addChunk({
                meetingId: meetingId as Id<"meetings">,
                text,
                speakerName: displayName,
                confidence: result[0].confidence,
              });
            } catch (e) {
              console.warn("Failed to save transcript chunk:", e);
            }
          }
          setInterimText("");
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if we still want to listen
      if (meetingId && isAudioOn) {
        try {
          recognition.start();
        } catch (e) {
          // might fail if already started
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
    }
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
      recognitionRef.current = null;
    };
  }, [meetingId, isAudioOn, displayName]);

  return { isListening, interimText };
}

/* ═══════════════════════════════════════════════════
   LIVE INSIGHTS PANEL
   Shows real transcription + AI-extracted insights
   ═══════════════════════════════════════════════════ */
function LiveInsightsPanel({
  meetingId,
  isListening,
  interimText,
}: {
  meetingId: string;
  isListening: boolean;
  interimText: string;
}) {
  const transcript = useQuery(api.workspace.getTranscript, {
    meetingId: meetingId as Id<"meetings">,
  });
  const insights = useQuery(api.workspace.getInsights, {
    meetingId: meetingId as Id<"meetings">,
  });
  const [activeTab, setActiveTab] = useState<"transcript" | "insights">("transcript");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript?.length, interimText]);

  const tabs = [
    { id: "transcript" as const, label: "Transcript", icon: FileText },
    { id: "insights" as const, label: "Insights", icon: Lightbulb },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-fuchsia-400 bg-fuchsia-500/10 border-b-2 border-fuchsia-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5">
        <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-600"}`} />
        <span className="text-[10px] text-gray-400 font-medium">
          {isListening ? "Transcribing live…" : "Waiting for audio"}
        </span>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="h-48 sm:h-56 overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
        {activeTab === "transcript" && (
          <>
            {(!transcript || transcript.length === 0) && !interimText ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <FileText className="w-8 h-8 text-gray-700" />
                <p className="text-xs text-gray-600">Start speaking — your words will appear here in real time</p>
              </div>
            ) : (
              <>
                {(transcript || []).map((chunk: any) => (
                  <div key={chunk._id} className="flex items-start gap-2">
                    <span className="text-[10px] text-gray-600 font-mono w-12 shrink-0 mt-0.5">
                      {new Date(chunk.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-fuchsia-400">{chunk.speakerName}: </span>
                      <span className="text-xs text-gray-300">{chunk.text}</span>
                    </div>
                  </div>
                ))}
                {/* Interim (not yet finalized) */}
                {interimText && (
                  <div className="flex items-start gap-2 opacity-50">
                    <span className="text-[10px] text-gray-600 font-mono w-12 shrink-0 mt-0.5">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-400 italic">{interimText}…</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "insights" && (
          <>
            {!insights ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <Lightbulb className="w-8 h-8 text-gray-700" />
                <p className="text-xs text-gray-600">AI insights will populate as the meeting progresses</p>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.summary && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                    <p className="text-xs text-gray-300">{insights.summary}</p>
                  </div>
                )}
                {insights.keyTakeaways?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Key Takeaways</p>
                    {insights.keyTakeaways.map((t: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1">
                        <TrendingUp className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-300">{t}</span>
                      </div>
                    ))}
                  </div>
                )}
                {insights.actionItems?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Action Items</p>
                    {insights.actionItems.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1">
                        <CheckCircle2 className={`w-3 h-3 mt-0.5 shrink-0 ${item.completed ? "text-emerald-400" : "text-amber-400"}`} />
                        <span className="text-xs text-gray-300">
                          {item.text}
                          {item.assignee && <span className="text-fuchsia-400"> @{item.assignee}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {insights.sentiment && (
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Sentiment:</span>
                    <span className={`text-xs font-semibold ${
                      insights.sentiment === "positive" ? "text-emerald-400" :
                      insights.sentiment === "negative" ? "text-red-400" : "text-gray-400"
                    }`}>{insights.sentiment}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING CHAT PANEL
   ═══════════════════════════════════════════════════ */
function FloatingChat({
  workspaceId,
  roomId,
}: {
  workspaceId: string;
  roomId: string;
}) {
  const messages = useQuery(api.workspace.getRoomMessages, {
    roomId: roomId as Id<"workspaceRooms">,
    limit: 50,
  });
  const sendMsg = useMutation(api.workspace.sendRoomMessage);
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMsg({
      workspaceId: workspaceId as Id<"workspaces">,
      roomId: roomId as Id<"workspaceRooms">,
      text: text.trim(),
      type: "message",
    });
    setText("");
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 z-30 p-3 rounded-full bg-fuchsia-600 text-white shadow-xl hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
        {messages && messages.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">
            {messages.length}
          </div>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-24 right-3 sm:right-6 z-30 w-[calc(100%-1.5rem)] sm:w-80 max-w-80 transition-all duration-300 ${
        isFocused
          ? "bg-gray-900/95 border-fuchsia-500/60 shadow-2xl shadow-fuchsia-500/10"
          : "bg-gray-900/30 backdrop-blur-sm shadow-lg"
      }`}
      style={{
        borderRadius: "20px",
        border: isFocused
          ? "2px solid rgba(217,70,239,0.5)"
          : "2px solid transparent",
        backgroundImage: isFocused
          ? "none"
          : "linear-gradient(135deg, rgba(217,70,239,0.15), rgba(139,92,246,0.15), rgba(59,130,246,0.15), rgba(6,182,212,0.15))",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 cursor-pointer" onClick={() => !isFocused && setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-fuchsia-400" />
          <span className={`text-sm font-semibold ${isFocused ? "text-white" : "text-white/60"}`}>Chat</span>
          {messages && messages.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold">
              {messages.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isCollapsed && (
        <>
          <div className={`h-48 overflow-y-auto px-3 space-y-2 scrollbar-thin scrollbar-thumb-white/10 ${isFocused ? "opacity-100" : "opacity-60"}`}>
            {(!messages || messages.length === 0) ? (
              <div className="flex items-center justify-center h-full text-xs text-gray-500">
                No messages yet — say hi! 👋
              </div>
            ) : (
              messages.map((msg: any) => (
                <div key={msg._id} className="flex items-start gap-2">
                  {msg.type === "reaction" ? (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-lg">{msg.reactionEmoji}</span>
                      <span className="text-xs text-gray-500">{msg.displayName}</span>
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: msg.avatarColor }}
                      >
                        {msg.displayName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-gray-300">{msg.displayName}</span>
                          <span className="text-[9px] text-gray-600">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 break-words">{msg.text}</p>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="p-2 rounded-xl bg-fuchsia-600 text-white disabled:opacity-30 hover:bg-fuchsia-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REACTION BAR
   ═══════════════════════════════════════════════════ */
function ReactionBar({
  workspaceId,
  roomId,
}: {
  workspaceId: string;
  roomId: string;
}) {
  const sendMsg = useMutation(api.workspace.sendRoomMessage);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const nextId = useRef(0);

  const sendReaction = async (emoji: string) => {
    const id = nextId.current++;
    setFloatingEmojis((prev) => [...prev, { id, emoji, x: 30 + Math.random() * 40 }]);
    setTimeout(() => setFloatingEmojis((prev) => prev.filter((e) => e.id !== id)), 2000);

    await sendMsg({
      workspaceId: workspaceId as Id<"workspaces">,
      roomId: roomId as Id<"workspaceRooms">,
      text: emoji,
      type: "reaction",
      reactionEmoji: emoji,
    });
  };

  const REACTIONS = [
    { emoji: "👏", label: "Clap" },
    { emoji: "✋", label: "Raise Hand" },
    { emoji: "🔥", label: "Fire" },
    { emoji: "👍", label: "Thumbs Up" },
    { emoji: "😂", label: "Laugh" },
    { emoji: "💯", label: "100" },
  ];

  return (
    <>
      {floatingEmojis.map((fe) => (
        <div
          key={fe.id}
          className="fixed z-50 text-3xl pointer-events-none"
          style={{
            left: `${fe.x}%`,
            bottom: "120px",
            animation: "floatUp 2s ease-out forwards",
          }}
        >
          {fe.emoji}
        </div>
      ))}

      <div className="flex items-center gap-1">
        {REACTIONS.map((r) => (
          <button
            key={r.emoji}
            onClick={() => sendReaction(r.emoji)}
            title={r.label}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 hover:scale-110 transition-all text-base"
          >
            {r.emoji}
          </button>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   AUDITORIUM STAGE VIEW
   ═══════════════════════════════════════════════════ */
function AuditoriumStage({
  workspaceId,
  roomId,
  presence,
  members,
  isVideoOn,
  isAudioOn,
  localVideoRef,
  isMirrored,
  audioLevel,
}: {
  workspaceId: string;
  roomId: string;
  presence: any[];
  members: any[];
  isVideoOn: boolean;
  isAudioOn: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  isMirrored: boolean;
  audioLevel: number;
}) {
  const speakerQueue = useQuery(api.workspace.getSpeakerQueue, {
    roomId: roomId as Id<"workspaceRooms">,
  });
  const joinQueue = useMutation(api.workspace.joinSpeakerQueue);
  const advanceQueue = useMutation(api.workspace.advanceSpeakerQueue);
  const [showQueue, setShowQueue] = useState(false);
  const [topic, setTopic] = useState("");

  const activeSpeaker = (speakerQueue || []).find((s: any) => s.status === "speaking");
  const waiting = (speakerQueue || []).filter((s: any) => s.status === "waiting").sort((a: any, b: any) => a.position - b.position);
  const audience = presence.filter(
    (p: any) => !activeSpeaker || p.userId !== activeSpeaker.userId
  );

  return (
    <div className="space-y-4">
      {/* Stage */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        minHeight: "200px",
      }}>
        <div className="absolute top-0 left-0 right-0 flex justify-around">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-3 h-16 bg-gradient-to-b from-white/20 to-transparent blur-sm" style={{
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          {activeSpeaker ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-fuchsia-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-fuchsia-500/30 mb-3" style={{
                backgroundColor: members.find((m: any) => m.userId === activeSpeaker.userId)?.avatarColor || "#7c3aed",
              }}>
                {activeSpeaker.displayName[0]}
              </div>
              <p className="font-bold text-lg">{activeSpeaker.displayName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-red-300 font-medium">Speaking Now</span>
              </div>
              {activeSpeaker.topic && (
                <p className="text-sm text-gray-400 mt-2 px-4 py-1 rounded-full bg-white/5">"{activeSpeaker.topic}"</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Presentation className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Stage is open</p>
              <p className="text-xs text-gray-600">Join the speaker queue to present</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-700/30 via-amber-600/50 to-amber-700/30" />
      </div>

      {/* Next up banner */}
      {waiting.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <SkipForward className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-300 font-medium">
            Up next: {waiting[0].displayName}
            {waiting[0].topic && ` — "${waiting[0].topic}"`}
          </span>
          {waiting.length > 1 && (
            <span className="text-xs text-amber-500/60">+ {waiting.length - 1} more</span>
          )}
        </div>
      )}

      {/* Audience */}
      <div className="relative">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Users className="w-3.5 h-3.5" /> Audience ({audience.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {audience.map((p: any) => {
            const m = members.find((mm: any) => mm.userId === p.userId);
            return (
              <div key={p._id} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-white/10"
                  style={{ backgroundColor: m?.avatarColor || "#7c3aed" }}
                >
                  {m?.displayName?.[0] || "?"}
                </div>
                <span className="text-[9px] text-gray-500 max-w-[50px] truncate">{m?.displayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your camera tile */}
      <div className="relative">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Video className="w-3.5 h-3.5" /> Your Camera
        </p>
        <div className="w-[180px] sm:w-[220px]">
          <VideoTile
            displayName="You"
            avatarColor="#7c3aed"
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            isSelf={true}
            videoRef={localVideoRef}
            isMirrored={isMirrored}
            audioLevel={audioLevel}
          />
        </div>
      </div>

      {/* Speaker queue panel */}
      <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
        <button
          onClick={() => setShowQueue(!showQueue)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-bold">Speaker Queue</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300">{waiting.length} waiting</span>
          </div>
          {showQueue ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {showQueue && (
          <div className="px-4 pb-4 space-y-3">
            {waiting.map((s: any, i: number) => (
              <div key={s._id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <span className="text-xs font-bold text-gray-500 w-6">{i + 1}</span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: members.find((m: any) => m.userId === s.userId)?.avatarColor || "#7c3aed" }}
                >
                  {s.displayName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.displayName}</p>
                  {s.topic && <p className="text-xs text-gray-500">{s.topic}</p>}
                </div>
                <button
                  onClick={() => advanceQueue({
                    roomId: roomId as Id<"workspaceRooms">,
                    speakerId: s._id,
                    newStatus: "speaking",
                  })}
                  className="px-2 py-1 rounded-lg bg-fuchsia-600 text-xs font-medium text-white"
                >
                  <Play className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What will you present? (optional)"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500"
              />
              <button
                onClick={async () => {
                  await joinQueue({
                    workspaceId: workspaceId as Id<"workspaces">,
                    roomId: roomId as Id<"workspaceRooms">,
                    topic: topic.trim() || undefined,
                  });
                  setTopic("");
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-violet-600 text-sm font-bold"
              >
                Join Queue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIDEO TILE — portrait-centered with audio meter
   ═══════════════════════════════════════════════════ */
function VideoTile({
  displayName,
  avatarColor,
  isVideoOn,
  isAudioOn,
  isSelf,
  videoRef,
  isMirrored,
  audioLevel,
  isScreenSharing,
}: {
  displayName: string;
  avatarColor: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSelf: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  isMirrored?: boolean;
  audioLevel?: number;
  isScreenSharing?: boolean;
}) {
  const borderGlow = (audioLevel || 0) > 0.15
    ? `0 0 ${Math.min(20, (audioLevel || 0) * 40)}px rgba(34,197,94,${Math.min(0.6, (audioLevel || 0))})`
    : "none";

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2 transition-all duration-150 flex items-center justify-center"
      style={{
        aspectRatio: "3/4",
        maxHeight: "280px",
        borderColor: (audioLevel || 0) > 0.15 ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.1)",
        boxShadow: borderGlow,
        background: "linear-gradient(135deg, #1f2937, #111827)",
      }}
    >
      {isVideoOn && isSelf && videoRef ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: isMirrored ? "scaleX(-1)" : "none" }}
          />
        </>
      ) : isVideoOn && !isSelf ? (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
          <Video className="w-8 h-8 text-blue-400" />
        </div>
      ) : (
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-xl"
          style={{ backgroundColor: avatarColor }}
        >
          {displayName[0] || "?"}
        </div>
      )}

      {/* Bottom bar: name + mic + audio level */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs">
          <span className="font-semibold text-white">{isSelf ? "You" : displayName}</span>
          {!isAudioOn && <MicOff className="w-3 h-3 text-red-400" />}
          {isScreenSharing && <ScreenShare className="w-3 h-3 text-blue-400" />}
        </div>
        {isAudioOn && (audioLevel || 0) > 0.02 && (
          <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <AudioLevelBars level={audioLevel || 0} size="sm" />
          </div>
        )}
      </div>

      {/* Online dot */}
      <div className="absolute top-2 right-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOM INTERIOR — main export
   ═══════════════════════════════════════════════════ */
const ROOM_ICONS: Record<string, React.ElementType> = {
  office: Building2,
  auditorium: Presentation,
  training: GraduationCap,
  presentation: Monitor,
  one_on_one: Users,
  lounge: Coffee,
};

const ROOM_GRADIENTS: Record<string, string> = {
  office: "from-violet-500 to-purple-600",
  auditorium: "from-blue-500 to-indigo-600",
  training: "from-emerald-500 to-teal-600",
  presentation: "from-pink-500 to-rose-600",
  one_on_one: "from-amber-500 to-orange-600",
  lounge: "from-cyan-500 to-sky-600",
};

export function RoomInterior({
  room,
  presence,
  members,
  activeMeetings,
  isVideoOn,
  isAudioOn,
  isScreenSharing: _isScreenSharing,
  virtualBg,
  workspaceId,
  onToggleVideo,
  onToggleAudio,
  onLeave,
  onStartMeeting,
  onChangeBg,
}: {
  room: any;
  presence: any[];
  members: any[];
  activeMeetings: any[];
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  virtualBg: string;
  workspaceId: string;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onLeave: () => void;
  onStartMeeting: () => void;
  onChangeBg: (bg: string) => void;
}) {
  const { videoRef: localVideoRef, streamRef, cameraError } = useLocalMedia(isVideoOn, isAudioOn);
  const audioLevel = useAudioLevel(streamRef, isAudioOn);
  const [isMirrored, setIsMirrored] = useState(true);
  const { screenVideoCallbackRef, isSharing: isScreenSharing, toggleScreenShare } = useScreenShare();

  // Get current user display name for transcription
  const displayName = useMemo(() => {
    // Try to find "You" in members (the current logged-in user)
    return "You"; // This will be the speaker label for transcription
  }, []);

  // Active meeting ID for transcription
  const activeMeetingId = activeMeetings.length > 0 ? activeMeetings[0]._id : null;
  const { isListening, interimText } = useLiveTranscription(
    activeMeetingId,
    isAudioOn,
    displayName,
  );

  if (!room) return null;

  const RoomIcon = ROOM_ICONS[room.type] || Building2;
  const gradient = ROOM_GRADIENTS[room.type] || "from-gray-500 to-gray-600";
  const hasMeeting = activeMeetings.length > 0;
  const isAuditorium = room.type === "auditorium" || room.type === "presentation";
  const bgImage = getRoomBgImage(room.type);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* ── Photorealistic room background ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.8)" }}
        />
        {/* Warm overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }} />
      </div>

      {/* Room header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
            <RoomIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{room.name}</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {presence.length} / {room.capacity} seats
              {hasMeeting && <span className="ml-2 text-red-400">· Meeting active</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Audio level display in header when mic is on */}
          {isAudioOn && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <AudioLevelBars level={audioLevel} />
              <span className="text-[10px] text-gray-400 font-mono w-6 text-right">
                {Math.round(audioLevel * 100)}
              </span>
            </div>
          )}
          <button
            onClick={onLeave}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 text-sm ml-auto sm:ml-0"
          >
            <LogOut className="w-4 h-4" /> Leave
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative z-10 overflow-auto">
        {isAuditorium ? (
          <AuditoriumStage
            workspaceId={workspaceId}
            roomId={room._id}
            presence={presence}
            members={members}
            isVideoOn={isVideoOn}
            isAudioOn={isAudioOn}
            localVideoRef={localVideoRef}
            isMirrored={isMirrored}
            audioLevel={audioLevel}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            {/* Video grid — portrait tiles */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-4">
                {/* Self tile */}
                <div className="w-[160px] sm:w-[200px] lg:w-[220px]">
                  <VideoTile
                    displayName="You"
                    avatarColor="#7c3aed"
                    isVideoOn={isVideoOn}
                    isAudioOn={isAudioOn}
                    isSelf={true}
                    videoRef={localVideoRef}
                    isMirrored={isMirrored}
                    audioLevel={audioLevel}
                  />
                  {cameraError && (
                    <div className="mt-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-[10px] text-red-300">{cameraError}</p>
                    </div>
                  )}
                </div>

                {/* Screen share tile — wide format when active */}
                {isScreenSharing && (
                  <div className="w-full max-w-[500px]">
                    <div
                      className="relative rounded-2xl overflow-hidden border-2 border-blue-500/40 transition-all duration-150"
                      style={{
                        aspectRatio: "16/9",
                        boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                        background: "linear-gradient(135deg, #1f2937, #111827)",
                      }}
                    >
                      <video
                        ref={screenVideoCallbackRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/80 backdrop-blur-sm text-xs">
                          <ScreenShare className="w-3 h-3 text-white" />
                          <span className="font-semibold text-white">Your Screen</span>
                        </div>
                        <button
                          onClick={toggleScreenShare}
                          className="px-2.5 py-1 rounded-full bg-red-500/80 backdrop-blur-sm text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other participants */}
                {presence.map((p: any) => {
                  const member = members.find((m: any) => m.userId === p.userId);
                  if (!member) return null;
                  return (
                    <div key={p._id} className="w-[160px] sm:w-[200px] lg:w-[220px]">
                      <VideoTile
                        displayName={member.displayName}
                        avatarColor={member.avatarColor || "#6366f1"}
                        isVideoOn={p.isVideoOn}
                        isAudioOn={p.isAudioOn}
                        isSelf={false}
                        isScreenSharing={p.isScreenSharing}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live insights sidebar — only when meeting is active */}
            {hasMeeting && activeMeetingId && (
              <div className="lg:w-80 shrink-0">
                <LiveInsightsPanel
                  meetingId={activeMeetingId}
                  isListening={isListening}
                  interimText={interimText}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating chat */}
      <FloatingChat workspaceId={workspaceId} roomId={room._id} />

      {/* Controls bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2.5 sm:p-4 mt-3 sm:mt-4 rounded-xl sm:rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
        <button
          onClick={onToggleAudio}
          className={`p-3 rounded-xl transition-all ${isAudioOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
          title={isAudioOn ? "Mute" : "Unmute"}
        >
          {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-xl transition-all ${isVideoOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
          title={isVideoOn ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Mirror toggle */}
        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className={`p-3 rounded-xl transition-all ${isMirrored ? "bg-fuchsia-500/20 text-fuchsia-400" : "bg-white/10 text-gray-400"} hover:bg-white/20`}
          title={isMirrored ? "Unflip camera" : "Mirror camera"}
        >
          <FlipHorizontal2 className="w-5 h-5" />
        </button>

        {/* Screen share */}
        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-xl transition-all ${isScreenSharing ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
          title={isScreenSharing ? "Stop screen share" : "Share your screen"}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        <VirtualBackgroundPicker currentBg={virtualBg} onChange={onChangeBg} />

        <div className="w-px h-8 bg-white/10" />

        <ReactionBar workspaceId={workspaceId} roomId={room._id} />

        <div className="w-px h-8 bg-white/10" />

        {!hasMeeting && (
          <button
            onClick={onStartMeeting}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 font-semibold transition-all text-sm"
          >
            <Activity className="w-4 h-4" /> Start Meeting
          </button>
        )}
        {hasMeeting && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-emerald-400 font-medium">
              Meeting Active
              {isListening && " · Transcribing"}
            </span>
          </div>
        )}

        <div className="w-px h-8 bg-white/10" />
        <button
          onClick={onLeave}
          className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-200px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
