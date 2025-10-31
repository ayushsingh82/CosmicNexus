"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CornerFrame from "@/app/components/CornerFrame";

type RealmType = "cosmic" | "crystal" | "neon" | "void" | "zenith";
type NPC = {
  id: string;
  name: string;
  type: "guide" | "merchant" | "mystic" | "guardian";
  dialogue: string;
  questActive?: boolean;
  x: number;
  y: number;
};

type Artifact = {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  x: number;
  y: number;
  collected: boolean;
};

const REALM_CONFIGS: Record<RealmType, { 
  name: string; 
  skybox: string; 
  ambientColor: string;
  description: string;
}> = {
  cosmic: {
    name: "Cosmic Nebula",
    skybox: "radial-gradient(circle at 30% 40%, #1a0033, #000428, #0a0e27)",
    ambientColor: "#4a00e0",
    description: "A swirling expanse of cosmic dust and starlight",
  },
  crystal: {
    name: "Crystal Caves",
    skybox: "radial-gradient(circle at 50% 30%, #0f3460, #16213e, #1a1a2e)",
    ambientColor: "#00d4ff",
    description: "Glimmering crystals reflect ethereal light",
  },
  neon: {
    name: "Neon Metropolis",
    skybox: "linear-gradient(180deg, #1a0033 0%, #2d1b69 50%, #000428 100%)",
    ambientColor: "#ff00ff",
    description: "Electric energy pulses through the digital realm",
  },
  void: {
    name: "The Void",
    skybox: "radial-gradient(circle, #000000, #0a0a0a, #1a1a1a)",
    ambientColor: "#ffffff",
    description: "Pure emptiness, yet full of possibility",
  },
  zenith: {
    name: "Zenith Peak",
    skybox: "linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    ambientColor: "#f093fb",
    description: "The highest realm, bathed in transcendent light",
  },
};

export default function AppHome() {
  const [currentRealm, setCurrentRealm] = useState<RealmType>("cosmic");
  const [energy, setEnergy] = useState(100);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [muted, setMuted] = useState(false);
  const [discoveredRealms, setDiscoveredRealms] = useState<RealmType[]>(["cosmic"]);
  const [questProgress, setQuestProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; color: string }>>([]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientAudioRef = useRef<AudioNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize realm with AI-generated content
  useEffect(() => {
    generateRealmContent(currentRealm);
  }, [currentRealm]);

  function generateRealmContent(realm: RealmType) {
    // AI-Generated NPCs for each realm
    const realmNPCs: NPC[] = [];
    const realmArtifacts: Artifact[] = [];
    
    const npcConfigs = {
      cosmic: [
        { name: "Stellar Guide", type: "guide" as const, dialogue: "The cosmos whispers secrets. Follow the starlight, explorer.", x: 30, y: 40 },
        { name: "Nebula Merchant", type: "merchant" as const, dialogue: "Trade stardust for knowledge. What do you seek?", x: 70, y: 60 },
      ],
      crystal: [
        { name: "Crystal Seer", type: "mystic" as const, dialogue: "The crystals show many paths. Choose wisely, traveler.", x: 40, y: 50 },
        { name: "Cave Guardian", type: "guardian" as const, dialogue: "These caves hold ancient power. Prove your worth.", x: 60, y: 30 },
      ],
      neon: [
        { name: "Data Stream", type: "guide" as const, dialogue: "I am the flow of information. Where shall we go next?", x: 50, y: 45 },
        { name: "Circuit Vendor", type: "merchant" as const, dialogue: "Upgrade your connection. The network expands.", x: 25, y: 70 },
      ],
      void: [
        { name: "The Watcher", type: "mystic" as const, dialogue: "In emptiness, truth. In silence, answers. What do you hear?", x: 50, y: 50 },
      ],
      zenith: [
        { name: "Transcendent One", type: "guardian" as const, dialogue: "You've reached the peak. But can you ascend further?", x: 50, y: 40 },
      ],
    };

    npcConfigs[realm].forEach((npc, idx) => {
      realmNPCs.push({
        id: `${realm}-npc-${idx}`,
        name: npc.name,
        type: npc.type,
        dialogue: npc.dialogue,
        questActive: idx === 0,
        x: npc.x,
        y: npc.y,
      });
    });

    // AI-Generated Artifacts
    const artifactNames = {
      cosmic: ["Stardust Fragment", "Nebula Core", "Cosmic Shard"],
      crystal: ["Crystal Prism", "Light Refractor", "Gem of Clarity"],
      neon: ["Data Crystal", "Energy Core", "Circuit Fragment"],
      void: ["Void Essence", "Silence Gem", "Empty Vessel"],
      zenith: ["Peak Jewel", "Transcendence Stone", "Zenith Orb"],
    };

    artifactNames[realm].forEach((name, idx) => {
      realmArtifacts.push({
        id: `${realm}-artifact-${idx}`,
        name,
        rarity: idx === 2 ? "epic" : idx === 1 ? "rare" : "common",
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        collected: false,
      });
    });

    setNpcs(realmNPCs);
    setArtifacts(realmArtifacts);
  }

  // AI-Generated Ambient Audio
  useEffect(() => {
    if (muted) {
      if (ambientAudioRef.current) {
        try {
          (ambientAudioRef.current as any).stop?.();
        } catch {}
        ambientAudioRef.current = null;
      }
      return;
    }

    const ctx = ensureAudio();
    if (!ctx) return;

    // Create ambient pad based on realm
    const frequencies = {
      cosmic: [110, 165, 220],
      crystal: [131, 196, 262],
      neon: [147, 220, 294],
      void: [98, 147, 196],
      zenith: [165, 247, 330],
    };

    const freqs = frequencies[currentRealm];
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = idx === 0 ? 0.015 : 0.008;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      oscillators.push(osc);
      gains.push(gain);
    });

    ambientAudioRef.current = gains[0]; // Store reference

    return () => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
    };
  }, [currentRealm, muted]);

  function ensureAudio() {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {}
    }
    return audioCtxRef.current;
  }

  // AI-Generated SFX
  function playSFX(type: "collect" | "portal" | "interact" | "discover" | "energy") {
    if (muted) return;
    const ctx = ensureAudio();
    if (!ctx) return;

    const configs = {
      collect: { freq: 800, duration: 0.2, type: "triangle" as OscillatorType },
      portal: { freq: 400, duration: 0.4, type: "sawtooth" as OscillatorType },
      interact: { freq: 600, duration: 0.15, type: "square" as OscillatorType },
      discover: { freq: 1000, duration: 0.3, type: "sine" as OscillatorType },
      energy: { freq: 350, duration: 0.25, type: "triangle" as OscillatorType },
    };

    const config = configs[type];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = config.type;
    osc.frequency.value = config.freq;
    gain.gain.value = 0.0001;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + config.duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + config.duration);
  }

  function collectArtifact(artifactId: string) {
    setArtifacts(prev => prev.map(a => {
      if (a.id === artifactId && !a.collected) {
        playSFX("collect");
        triggerParticles(REALM_CONFIGS[currentRealm].ambientColor);
        setEnergy(e => Math.min(100, e + 10));
        setQuestProgress(p => p + 1);
        return { ...a, collected: true };
      }
      return a;
    }));
  }

  function interactWithNPC(npc: NPC) {
    setSelectedNpc(npc);
    playSFX("interact");
    if (npc.questActive) {
      setQuestProgress(p => p + 1);
    }
  }

  function travelToRealm(realm: RealmType) {
    if (!discoveredRealms.includes(realm) && energy < 50) return;
    if (!discoveredRealms.includes(realm)) {
      setDiscoveredRealms(prev => [...prev, realm]);
      setEnergy(e => e - 50);
      playSFX("discover");
    } else {
      playSFX("portal");
    }
    setCurrentRealm(realm);
    setPlayerPosition({ x: 50, y: 50 });
  }

  function triggerParticles(color: string) {
    const id = Math.random().toString(36).slice(2);
    const x = playerPosition.x + (Math.random() - 0.5) * 20;
    const y = playerPosition.y + (Math.random() - 0.5) * 20;
    setParticles(prev => [...prev, { id, x, y, color }].slice(-15));
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 800);
  }

  function movePlayer(direction: "up" | "down" | "left" | "right") {
    setPlayerPosition(prev => ({
      x: Math.max(10, Math.min(90, prev.x + (direction === "left" ? -5 : direction === "right" ? 5 : 0))),
      y: Math.max(10, Math.min(90, prev.y + (direction === "up" ? -5 : direction === "down" ? 5 : 0))),
    }));
    // Check proximity to NPCs and artifacts
    const nearbyNPC = npcs.find(npc => {
      const dist = Math.sqrt(Math.pow(playerPosition.x - npc.x, 2) + Math.pow(playerPosition.y - npc.y, 2));
      return dist < 8;
    });
    const nearbyArtifact = artifacts.find(art => !art.collected && {
      const dist = Math.sqrt(Math.pow(playerPosition.x - art.x, 2) + Math.pow(playerPosition.y - art.y, 2));
      return dist < 6;
    });
    if (nearbyArtifact) collectArtifact(nearbyArtifact.id);
    if (nearbyNPC && !selectedNpc) interactWithNPC(nearbyNPC);
  }

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(e => Math.min(100, e + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentRealmConfig = REALM_CONFIGS[currentRealm];
  const collectedCount = artifacts.filter(a => a.collected).length;
  const totalArtifacts = artifacts.length;

  return (
    <div 
      className="min-h-screen w-full px-4 py-6 sm:px-6 text-white relative overflow-hidden"
      style={{ 
        background: currentRealmConfig.skybox,
        transition: "background 1s ease-in-out",
      }}
    >
      {/* AI-Generated Skybox Background Effects */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${playerPosition.x}% ${playerPosition.y}%, ${currentRealmConfig.ambientColor}40 0%, transparent 50%)`,
          transition: "all 0.5s ease",
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 relative z-10">
        <div className="text-3xl font-extrabold text-white">
          <a href="/">Cosmic Nexus</a>
        </div>

        {/* Status Bar */}
        <CornerFrame className="flex items-center justify-between" paddingClassName="p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#C0C0C0]">Energy:</span>
              <div className="w-32 h-4 bg-black/50 border border-[#C0C0C0] rounded relative overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${currentRealmConfig.ambientColor}, ${currentRealmConfig.ambientColor}88)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${energy}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-sm text-white font-semibold">{Math.round(energy)}%</span>
            </div>
            <div className="text-sm text-[#C0C0C0]">
              Artifacts: <span className="text-white font-semibold">{collectedCount}/{totalArtifacts}</span>
            </div>
            <div className="text-sm text-[#C0C0C0]">
              Quest Progress: <span className="text-white font-semibold">{questProgress}</span>
            </div>
          </div>
          <label className="flex items-center gap-1 text-xs text-[#C0C0C0] cursor-pointer">
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
            Mute
          </label>
        </CornerFrame>

        {/* Realm Info */}
        <CornerFrame paddingClassName="p-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{currentRealmConfig.name}</h2>
              <p className="text-sm text-[#C0C0C0]">{currentRealmConfig.description}</p>
            </div>
            <div className="text-xs text-[#C0C0C0]">
              Realms Discovered: {discoveredRealms.length}/{Object.keys(REALM_CONFIGS).length}
            </div>
          </div>
        </CornerFrame>

        <main className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main Exploration Area */}
          <CornerFrame className="lg:col-span-2" paddingClassName="p-4">
            <h2 className="mb-4 text-lg font-bold text-white">Exploration Map</h2>
            <div className="relative w-full aspect-square border-2 border-[#C0C0C0]/30 rounded-lg overflow-hidden bg-black/20">
              {/* AI-Generated Environment Background */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${currentRealmConfig.ambientColor}30, transparent 70%)`,
                }}
              />

              {/* Player */}
              <motion.div
                className="absolute w-6 h-6 rounded-full border-2 border-white z-20"
                style={{
                  background: currentRealmConfig.ambientColor,
                  left: `${playerPosition.x}%`,
                  top: `${playerPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: `0 0 20px ${currentRealmConfig.ambientColor}`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              {/* AI-Generated NPCs */}
              <AnimatePresence>
                {npcs.map((npc) => (
                  <motion.div
                    key={npc.id}
                    className="absolute cursor-pointer z-10"
                    style={{
                      left: `${npc.x}%`,
                      top: `${npc.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => interactWithNPC(npc)}
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className="text-3xl">
                      {npc.type === "guide" && "🧙"}
                      {npc.type === "merchant" && "🛒"}
                      {npc.type === "mystic" && "🔮"}
                      {npc.type === "guardian" && "🛡️"}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-[10px] text-white bg-black/70 px-1 rounded whitespace-nowrap">
                      {npc.name}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* AI-Generated Artifacts */}
              <AnimatePresence>
                {artifacts.map((artifact) => (
                  !artifact.collected && (
                    <motion.div
                      key={artifact.id}
                      className="absolute z-10"
                      style={{
                        left: `${artifact.x}%`,
                        top: `${artifact.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ opacity: 0, scale: 0, rotate: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        rotate: 360,
                      }}
                      transition={{
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      }}
                      onClick={() => collectArtifact(artifact.id)}
                    >
                      <div className="text-2xl cursor-pointer filter drop-shadow-lg">
                        {artifact.rarity === "legendary" && "💎"}
                        {artifact.rarity === "epic" && "✨"}
                        {artifact.rarity === "rare" && "⭐"}
                        {artifact.rarity === "common" && "🔷"}
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>

              {/* Particles */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute text-2xl pointer-events-none"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      color: p.color,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: -30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    +
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            {/* Movement Controls */}
            <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div></div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => movePlayer("up")}
                className="rounded border border-white px-4 py-2 text-white hover:bg-white/10"
                disabled={energy < 5}
              >
                ↑
              </motion.button>
              <div></div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => movePlayer("left")}
                className="rounded border border-white px-4 py-2 text-white hover:bg-white/10"
                disabled={energy < 5}
              >
                ←
              </motion.button>
              <div></div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => movePlayer("right")}
                className="rounded border border-white px-4 py-2 text-white hover:bg-white/10"
                disabled={energy < 5}
              >
                →
              </motion.button>
              <div></div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => movePlayer("down")}
                className="rounded border border-white px-4 py-2 text-white hover:bg-white/10"
                disabled={energy < 5}
              >
                ↓
              </motion.button>
              <div></div>
            </div>
          </CornerFrame>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Realm Portal */}
            <CornerFrame paddingClassName="p-4">
              <h3 className="mb-3 text-lg font-bold text-white">Realm Portals</h3>
              <div className="space-y-2">
                {Object.entries(REALM_CONFIGS).map(([key, config]) => (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => travelToRealm(key as RealmType)}
                    disabled={!discoveredRealms.includes(key as RealmType) && energy < 50}
                    className={`w-full text-left rounded border px-3 py-2 text-sm transition ${
                      currentRealm === key
                        ? "border-white bg-white/10 text-white"
                        : discoveredRealms.includes(key as RealmType)
                        ? "border-[#C0C0C0] text-[#C0C0C0] hover:bg-white/5"
                        : "border-[#666] text-[#666] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-semibold">{config.name}</div>
                    {!discoveredRealms.includes(key as RealmType) && (
                      <div className="text-xs mt-1">Requires 50 energy to discover</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </CornerFrame>

            {/* Collected Artifacts */}
            <CornerFrame paddingClassName="p-4">
              <h3 className="mb-3 text-lg font-bold text-white">Artifacts</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {artifacts.filter(a => a.collected).length === 0 ? (
                  <div className="text-sm text-[#C0C0C0]">No artifacts collected yet</div>
                ) : (
                  artifacts
                    .filter(a => a.collected)
                    .map((artifact) => (
                      <div key={artifact.id} className="flex items-center gap-2 text-sm border border-[#C0C0C0]/30 p-2 rounded">
                        <span>
                          {artifact.rarity === "epic" && "✨"}
                          {artifact.rarity === "rare" && "⭐"}
                          {artifact.rarity === "common" && "🔷"}
                        </span>
                        <div>
                          <div className="text-white font-medium">{artifact.name}</div>
                          <div className="text-xs text-[#C0C0C0] capitalize">{artifact.rarity}</div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CornerFrame>
          </aside>
        </main>

        {/* NPC Dialogue Modal */}
        {selectedNpc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <CornerFrame className="w-full max-w-md shadow-xl" paddingClassName="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="text-4xl">
                  {selectedNpc.type === "guide" && "🧙"}
                  {selectedNpc.type === "merchant" && "🛒"}
                  {selectedNpc.type === "mystic" && "🔮"}
                  {selectedNpc.type === "guardian" && "🛡️"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedNpc.name}</h3>
                  <p className="text-xs text-[#C0C0C0] capitalize">{selectedNpc.type}</p>
                </div>
              </div>
              <p className="mb-4 text-[#C0C0C0] leading-relaxed">{selectedNpc.dialogue}</p>
              {selectedNpc.questActive && (
                <div className="mb-4 rounded border border-[#C0C0C0]/30 bg-black/30 p-3 text-sm text-[#C0C0C0]">
                  <div className="font-semibold text-white mb-1">Quest Active!</div>
                  Collect artifacts and explore realms to complete the quest.
                </div>
              )}
              <button
                onClick={() => setSelectedNpc(null)}
                className="w-full rounded border border-white px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Continue
              </button>
            </CornerFrame>
          </div>
        )}

        {/* Onboarding */}
        {showOnboarding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <CornerFrame className="w-full max-w-2xl" paddingClassName="p-6">
              <div className="text-2xl font-extrabold mb-4 text-white">Welcome to Cosmic Nexus</div>
              <div className="space-y-3 text-[#C0C0C0]">
                <p>Explore AI-generated realms, interact with intelligent NPCs, and collect artifacts in this immersive experience.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-white">🎮</span>
                    <div>
                      <div className="text-white font-semibold">Movement</div>
                      <div className="text-sm">Use arrow buttons to explore the realm</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white">🧙</span>
                    <div>
                      <div className="text-white font-semibold">AI NPCs</div>
                      <div className="text-sm">Click on NPCs to hear their AI-generated dialogue</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white">✨</span>
                    <div>
                      <div className="text-white font-semibold">Artifacts</div>
                      <div className="text-sm">Collect artifacts to gain energy and progress</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white">🌌</span>
                    <div>
                      <div className="text-white font-semibold">Realms</div>
                      <div className="text-sm">Discover new AI-generated realms with unique environments</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="flex-1 rounded border border-white px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Begin Journey
                </button>
              </div>
            </CornerFrame>
          </div>
        )}
      </div>
    </div>
  );
}