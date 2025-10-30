"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CornerFrame from "@/app/components/CornerFrame";

type Customer = {
  id: string;
  mood: "happy" | "neutral" | "impatient";
  spend: number;
};

type UpgradeTier = 0 | 1 | 2 | 3;

export default function AppHome() {
  const [cash, setCash] = useState(0);
  const [combo, setCombo] = useState(0);
  const [queue, setQueue] = useState<Customer[]>([]);
  const [fixturesTier, setFixturesTier] = useState<UpgradeTier>(0);
  const [productTier, setProductTier] = useState<UpgradeTier>(0);
  const [autoStaff, setAutoStaff] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [shopName, setShopName] = useState("Neon Nibbles");
  const [partyBoost, setPartyBoost] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [licenseLevel, setLicenseLevel] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [rushIn, setRushIn] = useState(12);
  const [rushActive, setRushActive] = useState(false);
  const [goalServe, setGoalServe] = useState(0);
  const [goalEarn, setGoalEarn] = useState(0);
  const [goalAudit, setGoalAudit] = useState(false);
  const [prestige, setPrestige] = useState(0);
  const [muted, setMuted] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; }>>([]);
  const [npcLine, setNpcLine] = useState("Welcome to the block. Keep it tidy, keep it moving.");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const base = rushActive ? 900 : 1400;
    const interval = setInterval(() => {
      setQueue((prev) => {
        const newCust: Customer = {
          id: Math.random().toString(36).slice(2),
          mood: Math.random() < 0.15 ? "impatient" : Math.random() < 0.6 ? "neutral" : "happy",
          spend: 5 + Math.floor(Math.random() * 6),
        };
        const capped = prev.slice(-4);
        return [...capped, newCust];
      });
    }, Math.max(500, base - fixturesTier * 200));
    return () => clearInterval(interval);
  }, [fixturesTier, rushActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prev) => prev.filter((c, idx) => !(c.mood === "impatient" && idx === 0 && Math.random() < 0.35)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoStaff) return;
    const interval = setInterval(() => {
      serveTop(true);
    }, 1800 - productTier * 200);
    return () => clearInterval(interval);
  }, [autoStaff, productTier]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.25) setAuditOpen(true);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setRushIn((s) => {
        if (s <= 1) {
          setRushActive((a) => !a);
          return rushActive ? 12 : 8;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [rushActive]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bpt_state");
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.cash === "number") setCash(s.cash);
        if (typeof s.fixturesTier === "number") setFixturesTier(s.fixturesTier);
        if (typeof s.productTier === "number") setProductTier(s.productTier);
        if (typeof s.prestige === "number") setPrestige(s.prestige);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("bpt_state", JSON.stringify({ cash, fixturesTier, productTier, prestige }));
    } catch {}
  }, [cash, fixturesTier, productTier, prestige]);

  const spendMultiplier = useMemo(() => {
    const base = 1 + productTier * 0.35;
    const comboBonus = 1 + Math.min(combo, 10) * 0.05;
    const boost = boosting ? 1.3 : 1;
    const party = partyBoost ? 1.2 : 1;
    const license = 1 + licenseLevel * 0.15;
    const prestigeBonus = 1 + prestige * 0.2;
    return base * comboBonus * boost * party * license * prestigeBonus;
  }, [productTier, combo, boosting, partyBoost, licenseLevel, prestige]);

  function serveTop(passive = false) {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [top, ...rest] = prev;
      const moodMul = top.mood === "happy" ? 1.2 : top.mood === "neutral" ? 1 : 0.7;
      const earned = Math.round(top.spend * spendMultiplier * moodMul);
      setCash((v) => v + earned);
      setCombo((c) => Math.min(c + 1, 20));
      if (!passive) setGoalServe((g) => Math.min(5, g + 1));
      setGoalEarn((e) => Math.min(100, e + earned));
      triggerParticles();
      playServe();
      return rest;
    });
  }

  function restock() { setCombo(0); }
  function startBoost() { if (!boosting) { setBoosting(true); playBoost(); setTimeout(() => setBoosting(false), 3000); } }
  function passAudit() { setLicenseLevel((l) => Math.min(l + 1, 3)); setCash((v) => v + 50 + licenseLevel * 25); setGoalAudit(true); setAuditOpen(false); playAudit(); setNpcLine("Audit passed. License upgraded. Impressive."); }
  function failAudit() { setCash((v) => Math.max(0, v - 30)); setAuditOpen(false); }

  function drawSelfie() {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = 640, H = 360; canvas.width = W; canvas.height = H;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#C0C0C0"; ctx.lineWidth = 2; ctx.strokeRect(12, 12, W - 24, H - 24);
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.fillText(`${shopName}`, 28, 44);
    ctx.fillStyle = "#C0C0C0"; ctx.font = "16px sans-serif"; ctx.fillText(`$${cash} | Combo ${combo}x | L${licenseLevel}`, 28, 72);
  }

  function downloadCanvas() {
    const canvas = canvasRef.current; if (!canvas) return; const link = document.createElement("a");
    link.download = "block-party.png"; link.href = canvas.toDataURL("image/png"); link.click();
  }

  // Audio: lazy init context
  function ensureAudio() {
    if (!audioCtxRef.current) {
      try { audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch {}
    }
    return audioCtxRef.current;
  }
  function playTone(freq: number, time = 0.12, type: OscillatorType = "sine") {
    if (muted) return;
    const ctx = ensureAudio(); if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = 0.0001; g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + time);
  }
  function playServe() { playTone(520, 0.08, "triangle"); }
  function playBoost() { playTone(200, 0.18, "square"); }
  function playAudit() { playTone(640, 0.2, "sawtooth"); }

  // Ambient pad
  useEffect(() => {
    if (muted) return; const ctx = ensureAudio(); if (!ctx) return;
    let o: OscillatorNode | null = ctx.createOscillator();
    let g: GainNode | null = ctx.createGain();
    o!.type = "sine"; o!.frequency.value = 110;
    g!.gain.value = 0.003;
    o!.connect(g!).connect(ctx.destination); o!.start();
    return () => { try { o && o.stop(); } catch {} o = null; g = null; };
  }, [muted]);

  // Particles
  function triggerParticles() {
    const id = Math.random().toString(36).slice(2);
    const x = 40 + Math.random() * 40; const y = 50 + Math.random() * 20;
    setParticles((p) => [...p, { id, x, y }].slice(-12));
    setTimeout(() => setParticles((p) => p.filter((q) => q.id !== id)), 600);
  }

  // NPC rotating lines
  useEffect(() => {
    const lines = [
      "Keep the queue flowing—happy customers tip more.",
      "Restock before rush hits. Timing is profit.",
      "Boost wisely; combos stack fast during rush.",
    ];
    const t = setInterval(() => setNpcLine(lines[Math.floor(Math.random() * lines.length)]), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black px-4 py-6 sm:px-6 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="text-3xl font-extrabold text-white"><a href="/">Block Party Taycon</a></div>
        <CornerFrame className="flex items-center justify-between" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
          <div className="flex items-center gap-2">
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value.slice(0, 22))}
              className="rounded-md border border-[#C0C0C0] bg-black px-2 py-1 text-sm text-white placeholder-[#C0C0C0]"
              aria-label="Shop name"
            />
            <span className="rounded border border-[#C0C0C0] px-2 py-1 text-xs font-semibold text-white">L{licenseLevel}</span>
            {prestige > 0 && (
              <span className="rounded border border-[#C0C0C0] px-2 py-1 text-xs font-semibold text-white">Prestige {prestige}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded border border-[#C0C0C0] px-2 py-1 text-sm font-semibold text-white">${cash}</span>
            <span className="rounded border border-[#C0C0C0] px-2 py-1 text-sm font-semibold text-white">{combo}x</span>
            <label className="flex items-center gap-1 text-xs text-[#C0C0C0]">
              <input type="checkbox" checked={partyBoost} onChange={(e) => setPartyBoost(e.target.checked)} />
              Co-op boost
            </label>
            <label className="flex items-center gap-1 text-xs text-[#C0C0C0]">
              <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
              Mute
            </label>
          </div>
        </CornerFrame>

        <CornerFrame className="flex items-center justify-between" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
          <div className="text-sm text-[#C0C0C0]">Rush {rushActive ? "Active" : "Incoming"} in <span className="text-white font-semibold">{rushIn}s</span></div>
          <div className="text-xs text-[#C0C0C0]">Tip: Serve during rush to earn more quickly.</div>
        </CornerFrame>

        <main className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CornerFrame className="col-span-2" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
            <h2 className="mb-3 text-lg font-bold text-white">Queue</h2>
            <div className="flex gap-2 overflow-x-auto pb-2" onTouchStart={(e) => (touchStartRef.current = e.touches[0].clientX)} onTouchEnd={(e) => {
              const end = e.changedTouches[0].clientX; if (touchStartRef.current !== null && end - touchStartRef.current > 40) serveTop(false); touchStartRef.current = null;
            }}>
              <AnimatePresence initial={false}>
                {queue.map((c) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <CornerFrame className="min-w-[110px]" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
                      <div className="text-xs text-[#C0C0C0]">${c.spend}</div>
                      <div className="mt-2 text-lg">{c.mood === "happy" ? "😊" : c.mood === "neutral" ? "🙂" : "😠"}</div>
                      <div className="mt-1 text-[10px] uppercase text-[#C0C0C0]">Customer</div>
                    </CornerFrame>
                  </motion.div>
                ))}
              </AnimatePresence>
              {queue.length === 0 && <div className="text-sm text-[#C0C0C0]">Waiting for customers…</div>}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => serveTop(false)} className="rounded border border-white px-4 py-3 text-lg font-semibold text-white transition disabled:opacity-50 hover:bg-[#111111]" disabled={queue.length === 0}>Serve</motion.button>
              <motion.button whileTap={{ scale: 0.98 }} onClick={restock} className="rounded border border-white px-4 py-3 text-lg font-semibold text-white transition hover:bg-[#111111]">Restock</motion.button>
              <motion.button whileTap={{ scale: 0.98 }} onClick={startBoost} className={`rounded border border-white px-4 py-3 text-lg font-semibold text-white transition ${boosting ? "bg-[#111111]" : "hover:bg-[#111111]"}`}>{boosting ? "Boosting…" : "Boost"}</motion.button>
            </div>
            <div className="mt-2 text-xs text-[#C0C0C0]">Tip: Tap Serve to clear the first customer. Restock resets combo. Boost speeds earnings briefly.</div>

            {/* Particles */}
            <div className="pointer-events-none relative h-0">
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span key={p.id} initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -24 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6 }}
                    className="absolute text-white"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                    +
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </CornerFrame>

          <aside className="col-span-1 space-y-4">
            <CornerFrame className="" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
              <h3 className="mb-3 text-lg font-bold text-white">Upgrades</h3>
              <div className="space-y-2">
                <UpgradeRow label="Fixtures" tier={fixturesTier} cost={(fixturesTier + 1) * 40} onUpgrade={() => setFixturesTier((t) => (t < 3 ? ((setCash((v) => v - (t + 1) * 40)), (t + 1 as UpgradeTier)) : t))} cash={cash} />
                <UpgradeRow label="Product" tier={productTier} cost={(productTier + 1) * 50} onUpgrade={() => setProductTier((t) => (t < 3 ? ((setCash((v) => v - (t + 1) * 50)), (t + 1 as UpgradeTier)) : t))} cash={cash} />
                <CornerFrame className="flex items-center justify-between" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
                  <div>
                    <div className="text-sm font-medium text-white">Auto Staff</div>
                    <div className="text-xs text-[#C0C0C0]">Serve passively during rush</div>
                  </div>
                  <button onClick={() => setAutoStaff((s) => !s)} className={`rounded-full border px-3 py-1 text-sm ${autoStaff ? "border-white text-white" : "border-[#C0C0C0] text-[#C0C0C0]"}`}>{autoStaff ? "On" : "Off"}</button>
                </CornerFrame>
              </div>
            </CornerFrame>

            <CornerFrame className="" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
              <h3 className="mb-3 text-lg font-bold text-white">Goals</h3>
              <div className="space-y-2 text-sm">
                <GoalRow label="Serve 5 customers" done={goalServe >= 5} progress={`${goalServe}/5`} />
                <GoalRow label="Earn $100" done={goalEarn >= 100} progress={`$${goalEarn}/$100`} />
                <GoalRow label="Pass an audit" done={goalAudit} />
              </div>
            </CornerFrame>

            <CornerFrame className="" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
              <h3 className="mb-3 text-lg font-bold text-white">Prestige</h3>
              <div className="text-sm text-[#C0C0C0] mb-2">Reset progress for a permanent income bonus (+20% each prestige).</div>
              <button
                onClick={() => {
                  if (cash < 300) return;
                  setCash(0); setFixturesTier(0); setProductTier(0); setCombo(0); setPrestige((p) => p + 1);
                }}
                disabled={cash < 300}
                className="rounded border border-white px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[#111111]"
              >
                Prestige (cost $300)
              </button>
            </CornerFrame>

            <CornerFrame className="" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
              <h3 className="mb-3 text-lg font-bold text-white">Camera</h3>
              <div className="flex gap-2">
                <button onClick={drawSelfie} className="rounded-xl border border-white px-3 py-2 text-sm text-white hover:bg-[#111111]">Selfie</button>
                <button onClick={downloadCanvas} className="rounded-xl border border-white px-3 py-2 text-sm text-white hover:bg-[#111111]">Save PNG</button>
              </div>
              <CornerFrame className="mt-2 overflow-hidden" paddingClassName="p-0" cornerOffset={0} cornerRadius={0}>
                <canvas ref={canvasRef} className="block w-full" />
              </CornerFrame>
            </CornerFrame>
          </aside>
        </main>

        {/* NPC banner */}
        <CornerFrame className="" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
          <div className="text-sm"><span className="mr-2">🧾 Ms. Ledger:</span><span className="text-[#C0C0C0]">{npcLine}</span></div>
        </CornerFrame>

        {auditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <CornerFrame className="w-full max-w-sm shadow-xl" paddingClassName="p-5" cornerOffset={0} cornerRadius={0}>
              <div className="mb-3 text-2xl text-white">🧾 Ms. Ledger’s Audit</div>
              <p className="mb-4 text-sm text-[#C0C0C0]">Surprise inspection! Answer correctly to secure a license upgrade.</p>
              <AuditQuiz onPass={passAudit} onFail={failAudit} />
              <button onClick={() => setAuditOpen(false)} className="mt-3 w-full rounded-xl border border-[#C0C0C0] px-4 py-2 text-sm text-white hover:bg-[#111111]">Not now</button>
            </CornerFrame>
          </div>
        )}

        {showOnboarding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <CornerFrame className="w-full max-w-2xl" paddingClassName="p-6" cornerOffset={0} cornerRadius={0}>
              <div className="text-2xl font-extrabold mb-2 text-white">How to Play</div>
              <ol className="list-decimal pl-6 space-y-2 text-lg">
                <li>Tap <span className="font-semibold">Serve</span> to help the first customer in the Queue.</li>
                <li>Use <span className="font-semibold">Upgrades</span> to speed spawn and increase earnings.</li>
                <li>Watch for <span className="font-semibold">Rush</span> — serve quickly to earn more.</li>
              </ol>
              <div className="mt-4 text-sm text-[#C0C0C0]">Goal: Serve 5 customers and earn $100. Pass an audit for a license upgrade.</div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setShowOnboarding(false)} className="rounded border border-white px-4 py-2 text-sm font-semibold text-white hover:bg-[#111111]">Got it</button>
                <button onClick={() => setShowOnboarding(false)} className="rounded border border-[#C0C0C0] px-4 py-2 text-sm text-white hover:bg-[#111111]">Skip</button>
              </div>
            </CornerFrame>
          </div>
        )}
      </div>
    </div>
  );
}

function UpgradeRow({ label, tier, cost, onUpgrade, cash }: { label: string; tier: UpgradeTier; cost: number; onUpgrade: () => void; cash: number; }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#C0C0C0] bg-black p-3">
      <div>
        <div className="text-sm font-medium text-white">{label} T{tier}</div>
        <div className="text-xs text-[#C0C0C0]">Next: +{label === "Product" ? 35 : 20}% efficiency</div>
      </div>
      <button disabled={tier >= 3 || cash < cost} onClick={onUpgrade} className="rounded-full border border-white px-3 py-1 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[#111111]">${cost}</button>
    </div>
  );
}

function AuditQuiz({ onPass, onFail }: { onPass: () => void; onFail: () => void }) {
  const qs = [
    { prompt: "A rush hour begins. What’s your best move?", opts: ["Restock immediately", "Boost to serve faster", "Upgrade fixtures mid-rush"], correct: 1 },
    { prompt: "Impatient customers stack up. What helps reduce loss?", opts: ["Auto staff", "More product variety", "Rename the shop"], correct: 0 },
    { prompt: "How to raise average spend quickly?", opts: ["Boost", "Product upgrade", "Fixtures upgrade"], correct: 1 },
  ];
  const [q] = useState(qs[Math.floor(Math.random() * qs.length)]);
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <div>
      <div className="mb-3 text-sm font-medium text-white">{q.prompt}</div>
      <div className="space-y-2">
        {q.opts.map((o, idx) => (
          <button key={idx} onClick={() => setChoice(idx)} className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${choice === idx ? "border-white bg-[#111111] text-white" : "border-[#C0C0C0] bg-black text-[#C0C0C0]"}`}>{o}</button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => (choice === q.correct ? onPass() : onFail())} disabled={choice === null} className="flex-1 rounded-xl border border-white px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[#111111]">Submit</button>
        <button onClick={onFail} className="rounded-xl border border-[#C0C0C0] px-4 py-2 text-sm text-white hover:bg-[#111111]">Fail</button>
      </div>
    </div>
  );
}

const touchStartRef = { current: null as number | null };

function GoalRow({ label, done, progress }: { label: string; done: boolean; progress?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className={`text-sm ${done ? "text-white" : "text-[#C0C0C0]"}`}>{label}{progress ? ` – ${progress}` : ""}</div>
      <div className={`text-xs ${done ? "text-white" : "text-[#C0C0C0]"}`}>{done ? "Done" : ""}</div>
    </div>
  );
}


