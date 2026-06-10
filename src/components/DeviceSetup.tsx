import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Video, Mic, Speaker, Check, ChevronRight, ChevronLeft,
  Camera, MonitorSpeaker, Sparkles, ShieldCheck,
  ImageIcon, Paintbrush, X
} from "lucide-react";
import { api } from "../../convex/_generated/api";

/* ═══════════════════════════════════════════════════
   VIRTUAL BACKGROUND PRESETS
   ═══════════════════════════════════════════════════ */
const BG_PRESETS = [
  { id: "none", label: "None", color: "transparent", preview: "🚫" },
  { id: "blur", label: "Blur", color: "rgba(0,0,0,0.3)", preview: "🌫️" },
  { id: "office-modern", label: "Modern Office", color: "#1e1b4b", preview: "🏢" },
  { id: "gradient-purple", label: "Purple Gradient", color: "linear-gradient(135deg,#7c3aed,#db2777)", preview: "💜" },
  { id: "gradient-ocean", label: "Ocean", color: "linear-gradient(135deg,#0891b2,#2563eb)", preview: "🌊" },
  { id: "gradient-sunset", label: "Sunset", color: "linear-gradient(135deg,#f59e0b,#ef4444)", preview: "🌅" },
  { id: "bookshelf", label: "Bookshelf", color: "#3b1f0b", preview: "📚" },
  { id: "city-night", label: "City Night", color: "#0f172a", preview: "🌃" },
  { id: "nature", label: "Nature", color: "#064e3b", preview: "🌿" },
  { id: "abstract", label: "Abstract", color: "linear-gradient(135deg,#c026d3,#4f46e5,#0891b2)", preview: "🎨" },
];

/* ═══════════════════════════════════════════════════
   DEVICE SETUP WIZARD
   First-time camera/mic/speaker selector + preview
   ═══════════════════════════════════════════════════ */

interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export function DeviceSetupWizard({
  onComplete,
  isOpen,
  onClose,
}: {
  onComplete: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const savePrefs = useMutation(api.workspace.saveDevicePreferences);
  const existingPrefs = useQuery(api.workspace.getDevicePreferences);

  const [step, setStep] = useState(0); // 0=camera, 1=mic, 2=speaker, 3=background, 4=done
  const [cameras, setCameras] = useState<DeviceInfo[]>([]);
  const [mics, setMics] = useState<DeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<DeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedBg, setSelectedBg] = useState("none");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  // Load existing preferences
  useEffect(() => {
    if (existingPrefs) {
      if (existingPrefs.preferredCamera) setSelectedCamera(existingPrefs.preferredCamera);
      if (existingPrefs.preferredMic) setSelectedMic(existingPrefs.preferredMic);
      if (existingPrefs.preferredSpeaker) setSelectedSpeaker(existingPrefs.preferredSpeaker);
      if (existingPrefs.virtualBackground) setSelectedBg(existingPrefs.virtualBackground);
    }
  }, [existingPrefs]);

  // Request permissions and enumerate devices
  const requestPermissions = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setPermissionGranted(true);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput").map((d) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${d.deviceId.slice(0, 4)}`,
        kind: d.kind,
      }));
      const microphones = devices.filter((d) => d.kind === "audioinput").map((d) => ({
        deviceId: d.deviceId,
        label: d.label || `Microphone ${d.deviceId.slice(0, 4)}`,
        kind: d.kind,
      }));
      const spkrs = devices.filter((d) => d.kind === "audiooutput").map((d) => ({
        deviceId: d.deviceId,
        label: d.label || `Speaker ${d.deviceId.slice(0, 4)}`,
        kind: d.kind,
      }));

      setCameras(cams);
      setMics(microphones);
      setSpeakers(spkrs);
      if (cams.length && !selectedCamera) setSelectedCamera(cams[0].deviceId);
      if (microphones.length && !selectedMic) setSelectedMic(microphones[0].deviceId);
      if (spkrs.length && !selectedSpeaker) setSelectedSpeaker(spkrs[0].deviceId);

      // Set up audio analyser for mic level
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(mediaStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch {
      // Permissions denied — still show wizard but without preview
      setPermissionGranted(false);
    }
  }, [selectedCamera, selectedMic, selectedSpeaker]);

  useEffect(() => {
    if (isOpen) requestPermissions();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, step]);

  // Mic level meter
  useEffect(() => {
    if (step !== 1 || !analyserRef.current) return;
    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setMicLevel(avg / 255);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [step]);

  // Switch camera
  useEffect(() => {
    if (!selectedCamera || !permissionGranted) return;
    (async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCamera } },
          audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
        });
        stream?.getTracks().forEach((t) => t.stop());
        setStream(newStream);
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCamera, selectedMic]);

  const handleFinish = async () => {
    await savePrefs({
      preferredCamera: selectedCamera || undefined,
      preferredMic: selectedMic || undefined,
      preferredSpeaker: selectedSpeaker || undefined,
      virtualBackground: selectedBg,
      setupCompleted: true,
    });
    stream?.getTracks().forEach((t) => t.stop());
    onComplete();
  };

  if (!isOpen) return null;

  const STEPS = [
    { icon: Camera, label: "Camera", desc: "Select and preview your camera" },
    { icon: Mic, label: "Microphone", desc: "Select and test your microphone" },
    { icon: MonitorSpeaker, label: "Speaker", desc: "Select your audio output" },
    { icon: Paintbrush, label: "Background", desc: "Choose a virtual background" },
    { icon: Check, label: "Done", desc: "You're all set!" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Device Setup</h2>
              <p className="text-xs text-gray-400">Configure your camera, mic, and background</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center px-6 py-3 gap-1 bg-gray-950/50">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button
                key={s.label}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-gray-500"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 min-h-[320px]">
          {/* Step 0: Camera */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-fuchsia-400" /> Camera Preview
              </h3>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 border border-white/10">
                {permissionGranted ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Video className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">Camera permission needed</p>
                    <button
                      onClick={requestPermissions}
                      className="mt-3 px-4 py-2 rounded-xl bg-fuchsia-600 text-white text-sm font-medium"
                    >
                      Grant Access
                    </button>
                  </div>
                )}
              </div>
              {cameras.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Select Camera</label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white text-sm"
                  >
                    {cameras.map((c) => (
                      <option key={c.deviceId} value={c.deviceId}>{c.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Microphone */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Mic className="w-5 h-5 text-fuchsia-400" /> Microphone Test
              </h3>
              <p className="text-sm text-gray-400">Speak to test your microphone — the level meter should move.</p>
              {/* Level meter */}
              <div className="space-y-2">
                <div className="h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-fuchsia-500 transition-all duration-75"
                    style={{ width: `${Math.min(micLevel * 100, 100)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/80">
                    {micLevel > 0.02 ? "🎤 Receiving audio" : "Waiting for input..."}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 px-1">
                  <span>Silent</span><span>Normal</span><span>Loud</span>
                </div>
              </div>
              {mics.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Select Microphone</label>
                  <select
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white text-sm"
                  >
                    {mics.map((m) => (
                      <option key={m.deviceId} value={m.deviceId}>{m.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Speaker */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Speaker className="w-5 h-5 text-fuchsia-400" /> Speaker Output
              </h3>
              <p className="text-sm text-gray-400">Select your preferred audio output device.</p>
              {speakers.length > 0 ? (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Select Speaker</label>
                  <select
                    value={selectedSpeaker}
                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white text-sm"
                  >
                    {speakers.map((s) => (
                      <option key={s.deviceId} value={s.deviceId}>{s.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300">
                  Speaker selection is not supported in this browser. Your system default will be used.
                </div>
              )}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300">Audio streams are encrypted end-to-end. No recordings are made without explicit consent.</p>
              </div>
            </div>
          )}

          {/* Step 3: Virtual Background */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-fuchsia-400" /> Virtual Background
              </h3>
              <p className="text-sm text-gray-400">Choose a background to appear behind you during meetings.</p>
              <div className="grid grid-cols-5 gap-2">
                {BG_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg.id)}
                    className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      selectedBg === bg.id
                        ? "border-fuchsia-500 bg-fuchsia-500/10 scale-105"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{
                        background: bg.color.startsWith("linear") ? bg.color : bg.color || "#1a1a2e",
                      }}
                    >
                      {bg.preview}
                    </div>
                    <span className="text-[10px] text-gray-400">{bg.label}</span>
                    {selectedBg === bg.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {/* Preview with background */}
              {permissionGranted && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: selectedBg === "blur"
                        ? "rgba(0,0,0,0.5)"
                        : BG_PRESETS.find((b) => b.id === selectedBg)?.color?.startsWith("linear")
                        ? BG_PRESETS.find((b) => b.id === selectedBg)?.color
                        : BG_PRESETS.find((b) => b.id === selectedBg)?.color || "transparent",
                    }}
                  />
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover relative z-10"
                    style={{
                      filter: selectedBg === "blur" ? "" : "",
                      mixBlendMode: selectedBg !== "none" ? "screen" : "normal",
                    }}
                  />
                  {selectedBg === "blur" && (
                    <div className="absolute inset-0 z-5 backdrop-blur-sm" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">You're All Set!</h3>
              <p className="text-gray-400 mb-6">Your device preferences have been saved. You can change these anytime from the settings panel.</p>
              <div className="space-y-2 text-sm text-gray-300">
                {selectedCamera && <p>📷 Camera: {cameras.find((c) => c.deviceId === selectedCamera)?.label || "Selected"}</p>}
                {selectedMic && <p>🎤 Mic: {mics.find((m) => m.deviceId === selectedMic)?.label || "Selected"}</p>}
                {selectedSpeaker && <p>🔊 Speaker: {speakers.find((s) => s.deviceId === selectedSpeaker)?.label || "Selected"}</p>}
                {selectedBg !== "none" && <p>🖼️ Background: {BG_PRESETS.find((b) => b.id === selectedBg)?.label}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-gray-950/50">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 font-semibold text-sm hover:shadow-lg hover:shadow-fuchsia-500/20 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <Check className="w-4 h-4" /> Save & Enter Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIRTUAL BACKGROUND PICKER (in-room quick access)
   ═══════════════════════════════════════════════════ */
export function VirtualBackgroundPicker({
  currentBg,
  onChange,
}: {
  currentBg: string;
  onChange: (bgId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        title="Virtual Background"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-72 p-3 rounded-2xl bg-gray-900 border border-white/10 shadow-2xl">
          <p className="text-xs font-bold text-gray-400 mb-2 px-1">VIRTUAL BACKGROUND</p>
          <div className="grid grid-cols-5 gap-1.5">
            {BG_PRESETS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => { onChange(bg.id); setIsOpen(false); }}
                className={`relative p-2 rounded-lg border transition-all flex flex-col items-center ${
                  currentBg === bg.id
                    ? "border-fuchsia-500 bg-fuchsia-500/10"
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-sm"
                  style={{
                    background: bg.color.startsWith("linear") ? bg.color : bg.color || "#1a1a2e",
                  }}
                >
                  {bg.preview}
                </div>
                <span className="text-[9px] text-gray-500 mt-0.5">{bg.label}</span>
                {currentBg === bg.id && (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-fuchsia-500 flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
