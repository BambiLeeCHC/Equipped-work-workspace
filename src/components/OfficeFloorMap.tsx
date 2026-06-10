import { useState, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import {
  Coffee, Users, Presentation, Briefcase, Headphones,
  ChevronRight, ZoomIn, ZoomOut, Maximize2, ArrowRight,
  Sparkles
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/* ═══════════════════════════════════════════════════
   3D ISOMETRIC FLOOR MAP — map-only, hover popovers
   No sidebar lists. The map IS the interface.
   ═══════════════════════════════════════════════════ */

interface RoomSpot {
  id: string;
  name: string;
  dept: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  top: string;
  left: string;
}

const ROOM_SPOTS: RoomSpot[] = [
  {
    id: "office",
    name: "CEO Office",
    dept: "Executive Suite",
    subtitle: "Private executive office",
    icon: Briefcase,
    color: "#06b6d4",
    glowColor: "rgba(6,182,212,0.5)",
    top: "68%",
    left: "82%",
  },
  {
    id: "focus",
    name: "Focus Room",
    dept: "Operations",
    subtitle: "Deep work · No distractions",
    icon: Headphones,
    color: "#a855f7",
    glowColor: "rgba(168,85,247,0.5)",
    top: "48%",
    left: "12%",
  },
  {
    id: "collab",
    name: "Open Collab",
    dept: "Collaboration",
    subtitle: "Brainstorm & create together",
    icon: Presentation,
    color: "#3b82f6",
    glowColor: "rgba(59,130,246,0.5)",
    top: "78%",
    left: "48%",
  },
  {
    id: "meeting",
    name: "Meeting Room",
    dept: "Collaboration",
    subtitle: "Team standups & syncs",
    icon: Users,
    color: "#f472b6",
    glowColor: "rgba(244,114,182,0.5)",
    top: "18%",
    left: "85%",
  },
  {
    id: "lounge",
    name: "Lounge",
    dept: "Common Areas",
    subtitle: "Casual hangout & breaks",
    icon: Coffee,
    color: "#ec4899",
    glowColor: "rgba(236,72,153,0.5)",
    top: "8%",
    left: "72%",
  },
];

/* ─── Popover on hover/tap ─── */
function RoomPopover({
  spot,
  onlineCount,
  onEnter,
  onClose,
  isMobile,
}: {
  spot: RoomSpot;
  onlineCount: number;
  onEnter: () => void;
  onClose: () => void;
  isMobile: boolean;
}) {
  return (
    <div
      className="absolute z-40 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: spot.top,
        left: spot.left,
        transform: "translate(-50%, -120%)",
      }}
    >
      <div
        className="relative rounded-2xl border shadow-2xl overflow-hidden min-w-[200px] max-w-[240px]"
        style={{
          background: "linear-gradient(135deg, rgba(15,15,25,0.97), rgba(20,20,35,0.97))",
          borderColor: `${spot.color}40`,
          boxShadow: `0 8px 40px ${spot.glowColor}, 0 0 60px ${spot.glowColor}30`,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Glow stripe at top */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${spot.color}, transparent)` }} />

        <div className="p-4">
          {/* Icon + name */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${spot.color}30, ${spot.color}15)`,
                border: `1px solid ${spot.color}40`,
              }}
            >
              <spot.icon className="w-5 h-5" style={{ color: spot.color }} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{spot.name}</h3>
              <p className="text-[10px] text-gray-500 font-medium">{spot.dept}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-3">{spot.subtitle}</p>

          {/* Online count */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              {onlineCount > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">{onlineCount} online</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <span className="text-xs text-gray-600">Empty</span>
                </>
              )}
            </div>
          </div>

          {/* Enter button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnter();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${spot.color}, ${spot.color}cc)`,
              boxShadow: `0 4px 15px ${spot.glowColor}`,
            }}
          >
            Enter Room <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Arrow pointing down */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
          style={{
            background: "rgba(20,20,35,0.97)",
            borderRight: `1px solid ${spot.color}40`,
            borderBottom: `1px solid ${spot.color}40`,
          }}
        />
      </div>

      {/* Tap-away overlay for mobile */}
      {isMobile && (
        <div className="fixed inset-0 z-[-1]" onClick={onClose} />
      )}
    </div>
  );
}

/* ─── Room pin on the map ─── */
function RoomPin({
  spot,
  isActive,
  onlineCount,
  onActivate,
}: {
  spot: RoomSpot;
  isActive: boolean;
  onlineCount: number;
  onActivate: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      className="absolute z-20 group focus:outline-none"
      style={{
        top: spot.top,
        left: spot.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{
          backgroundColor: `${spot.color}20`,
          animationDuration: "3s",
          width: "48px",
          height: "48px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Main pin */}
      <div
        className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: isActive ? spot.color : "rgba(15,15,25,0.9)",
          border: `2px solid ${isActive ? spot.color : `${spot.color}60`}`,
          boxShadow: isActive
            ? `0 4px 25px ${spot.glowColor}, 0 0 40px ${spot.glowColor}40`
            : `0 2px 12px ${spot.glowColor}30`,
          transform: isActive ? "scale(1.1)" : "scale(1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : `${spot.color}25` }}
        >
          <spot.icon className="w-3.5 h-3.5" style={{ color: isActive ? "#fff" : spot.color }} />
        </div>
        <span
          className="text-xs font-bold tracking-wide whitespace-nowrap"
          style={{ color: isActive ? "#fff" : "#e5e7eb" }}
        >
          {spot.name}
        </span>
        {onlineCount > 0 && (
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "rgba(16,185,129,0.15)",
              color: isActive ? "#fff" : "#34d399",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {onlineCount}
          </span>
        )}
        {!isActive && (
          <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors -mr-0.5" />
        )}
      </div>

      {/* Dot below pin */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: spot.color,
          boxShadow: `0 0 10px ${spot.glowColor}`,
          animation: isActive ? "pin-pulse 1.5s ease-in-out infinite" : "none",
        }}
      />
    </button>
  );
}

/* ─── Zoom / pan controls ─── */
function ZoomPanControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5">
      <button
        onClick={onZoomIn}
        className="w-9 h-9 rounded-lg bg-black/70 border border-white/10 shadow-lg flex items-center justify-center active:scale-95 transition-transform backdrop-blur-sm"
      >
        <ZoomIn className="w-4 h-4 text-white/80" />
      </button>
      <button
        onClick={onZoomOut}
        className="w-9 h-9 rounded-lg bg-black/70 border border-white/10 shadow-lg flex items-center justify-center active:scale-95 transition-transform backdrop-blur-sm"
      >
        <ZoomOut className="w-4 h-4 text-white/80" />
      </button>
      {zoom !== 1 && (
        <button
          onClick={onReset}
          className="w-9 h-9 rounded-lg bg-black/70 border border-white/10 shadow-lg flex items-center justify-center active:scale-95 transition-transform backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4 text-white/80" />
        </button>
      )}
      <div className="text-center text-[10px] font-bold text-white/60 bg-black/50 rounded px-1.5 py-0.5 border border-white/10 backdrop-blur-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function OfficeFloorMap({
  rooms,
  presence,
  members,
  workspaceId,
  onJoinRoom,
}: {
  rooms: any[];
  presence: any[];
  members: any[];
  workspaceId: string;
  onJoinRoom?: (roomId: string) => void;
}) {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const joinRoom = useMutation(api.workspace.joinRoom);

  /* ── Zoom & pan (portrait) ── */
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 3)), []);
  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(z - 0.25, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);
  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1) return;
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, panX: panOffset.x, panY: panOffset.y };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [zoom, panOffset]
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setPanOffset({
        x: dragStart.current.panX + (e.clientX - dragStart.current.x),
        y: dragStart.current.panY + (e.clientY - dragStart.current.y),
      });
    },
    [isDragging]
  );
  const onPointerUp = useCallback(() => setIsDragging(false), []);

  /* ── Map room labels → actual Convex room IDs ── */
  const roomTypeMap: Record<string, any> = {};
  for (const room of rooms) {
    const type = room.type?.toLowerCase() || "";
    if (type.includes("lounge") || type.includes("break")) roomTypeMap["lounge"] = room;
    else if (type.includes("meeting") || type.includes("conference")) roomTypeMap["meeting"] = room;
    else if (type.includes("focus") || type.includes("one_on_one")) roomTypeMap["focus"] = room;
    else if (type.includes("collab") || type.includes("open") || type.includes("training")) roomTypeMap["collab"] = room;
    else if (type.includes("office") || type.includes("private")) roomTypeMap["office"] = room;
    else if (type.includes("presentation") || type.includes("auditorium")) roomTypeMap["collab"] = room;
  }
  const unmapped = rooms.filter((r) => !Object.values(roomTypeMap).includes(r));
  for (const id of ["lounge", "meeting", "focus", "collab", "office"]) {
    if (!roomTypeMap[id] && unmapped.length > 0) roomTypeMap[id] = unmapped.shift();
  }

  const handleEnterRoom = async (labelId: string) => {
    const room = roomTypeMap[labelId];
    if (!room) return;
    try {
      await joinRoom({
        workspaceId: workspaceId as Id<"workspaces">,
        roomId: room._id,
      });
      onJoinRoom?.(room._id);
    } catch (e: any) {
      console.error("Failed to join room:", e);
    }
  };

  /* Presence counts per room */
  const roomPresenceCounts: Record<string, number> = {};
  for (const p of presence) {
    if (p.currentRoomId) roomPresenceCounts[p.currentRoomId] = (roomPresenceCounts[p.currentRoomId] || 0) + 1;
  }
  const getOnlineCount = (labelId: string) => {
    const room = roomTypeMap[labelId];
    return room ? roomPresenceCounts[room._id] || 0 : 0;
  };

  /* Close popover on background click */
  const handleBgClick = () => setActiveSpot(null);

  /* Detect mobile */
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const totalOnline = presence.filter((p: any) => p.status !== "offline").length;

  return (
    <div className="h-full flex flex-col min-h-0 overflow-auto" onClick={handleBgClick}>
      {/* ── Compact header ── */}
      <div className="text-center py-4 md:py-6 px-4">
        <h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Virtual Office.{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500">
            Reimagined.
          </span>
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3 text-sm text-gray-500">
          {totalOnline > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {totalOnline} online
            </span>
          )}
          <span className="text-gray-600">{rooms.length} rooms · {members.length} member{members.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── The Map ── */}
      <div className="flex-1 flex items-center justify-center px-3 md:px-6 pb-6">
        <div
          className="relative w-full max-w-[1100px] rounded-2xl overflow-hidden shadow-2xl touch-none"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(168,85,247,0.08)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Pannable/zoomable inner */}
          <div
            className="relative"
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.25s ease-out",
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* 3D Isometric image */}
            <img
              src="/images/office-floor-map.jpg"
              alt="Isometric 3D Virtual Office"
              className="w-full h-auto select-none"
              draggable={false}
              style={{
                filter: activeSpot ? "brightness(0.7)" : "brightness(0.85)",
                transition: "filter 0.3s ease",
              }}
            />

            {/* Dark overlay for contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 100%)",
              }}
            />

            {/* Room pins */}
            {ROOM_SPOTS.map((spot) => (
              <RoomPin
                key={spot.id}
                spot={spot}
                isActive={activeSpot === spot.id}
                onlineCount={getOnlineCount(spot.id)}
                onActivate={() => setActiveSpot(activeSpot === spot.id ? null : spot.id)}
              />
            ))}

            {/* Popover for active room */}
            {activeSpot && (
              <RoomPopover
                spot={ROOM_SPOTS.find((s) => s.id === activeSpot)!}
                onlineCount={getOnlineCount(activeSpot)}
                onEnter={() => handleEnterRoom(activeSpot)}
                onClose={() => setActiveSpot(null)}
                isMobile={isMobile}
              />
            )}
          </div>

          {/* Zoom controls */}
          <ZoomPanControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleZoomReset}
          />

          {/* Hint on mobile */}
          {zoom === 1 && isMobile && (
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <ZoomIn className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[11px] text-white/70 font-medium">Pinch or tap + to zoom</span>
            </div>
          )}

          {/* Sparkle badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-[11px] text-white/70 font-medium">Tap a room to enter</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pin-pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.8); }
        }
      `}</style>
    </div>
  );
}
