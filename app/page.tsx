"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Customer = {
  id: string;
  mood: "happy" | "neutral" | "impatient";
  spend: number;
};

type UpgradeTier = 0 | 1 | 2 | 3;

type RushEvent = {
  t: number;
  action: "serve" | "restock" | "boost";
  value: number;
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [cash, setCash] = useState(0);
  const [combo, setCombo] = useState(0);
  const [queue, setQueue] = useState<Customer[]>([]);
  const [fixturesTier, setFixturesTier] = useState<UpgradeTier>(0);
  const [productTier, setProductTier] = useState<UpgradeTier>(0);
  const [autoStaff, setAutoStaff] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [licenseLevel, setLicenseLevel] = useState(0);
  const [shopName, setShopName] = useState("Neon Nibbles");
  const [partyBoost, setPartyBoost] = useState(false);
  const [events, setEvents] = useState<RushEvent[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!started) return;
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
    }, 1400 - fixturesTier * 200);
    return () => clearInterval(interval);
  }, [started, fixturesTier]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setQueue((prev) => prev.filter((c, idx) => !(c.mood === "impatient" && idx === 0 && Math.random() < 0.35)));
    }, 1200);
    return () => clearInterval(interval);
  }, [started]);

  useEffect(() => {
    if (!autoStaff || !started) return;
    const interval = setInterval(() => {
      serveTop(true);
    }, 1800 - productTier * 200);
    return () => clearInterval(interval);
  }, [autoStaff, started, productTier, queue]);

  const spendMultiplier = useMemo(() => {
    const base = 1 + productTier * 0.35;
    const comboBonus = 1 + Math.min(combo, 10) * 0.05;
    const boost = boosting ? 1.3 : 1;
    const party = partyBoost ? 1.2 : 1;
    const license = 1 + licenseLevel * 0.15;
    return base * comboBonus * boost * party * license;
  }, [productTier, combo, boosting, partyBoost, licenseLevel]);

  function logEvent(action: RushEvent["action"], value: number) {
    setEvents((e) => {
      const now = Date.now();
      const next = [...e, { t: now, action, value }].slice(-12);
      return next;
    });
  }

  function serveTop(passive = false) {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [top, ...rest] = prev;
      const moodMul = top.mood === "happy" ? 1.2 : top.mood === "neutral" ? 1 : 0.7;
      const earned = Math.round(top.spend * spendMultiplier * moodMul);
      setCash((v) => v + earned);
      setCombo((c) => Math.min(c + 1, 20));
      if (!passive) logEvent("serve", earned);
      return rest;
    });
  }

  function restock() {
    setCombo(0);
    logEvent("restock", 0);
  }

  function startBoost() {
    if (boosting) return;
    setBoosting(true);
    logEvent("boost", 0);
    setTimeout(() => setBoosting(false), 3000);
  }

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      if (Math.random() < 0.28) setAuditOpen(true);
    }, 15000);
    return () => clearInterval(timer);
  }, [started]);

  function passAudit() {
    setLicenseLevel((l) => Math.min(l + 1, 3));
    setCash((v) => v + 50 + licenseLevel * 25);
    setAuditOpen(false);
  }

  function failAudit() {
    setCash((v) => Math.max(0, v - 30));
    setAuditOpen(false);
  }

  function drawCanvas(kind: "selfie" | "replay") {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 640;
    const H = 360;
    canvas.width = W;
    canvas.height = H;
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0ea5e9");
    grad.addColorStop(1, "#9333ea");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    for (let i = 0; i < 6; i++) {
      const bw = 70 + Math.random() * 60;
      const bh = 80 + Math.random() * 120;
      const bx = 20 + i * 100;
      const by = H - bh - 40;
      ctx.fillRect(bx, by, bw, bh);
    }

    ctx.fillStyle = "#111827";
    ctx.fillRect(40, H - 140, 260, 110);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(40, H - 140, 260, 24);
    ctx.fillStyle = "#f9fafb";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(shopName, 50, H - 123);

    ctx.fillStyle = "#f9fafb";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(`$${cash} | Combo ${combo}x | L${licenseLevel}`, 40, 40);

    if (kind === "replay") {
      ctx.font = "16px sans-serif";
      ctx.fillText("Rush Replay", W - 160, 40);
      let y = 70;
      events.slice(-6).forEach((e) => {
        const label = e.action === "serve" ? `Serve +$${e.value}` : e.action === "boost" ? "Boost" : "Restock";
        ctx.fillText(label, W - 180, y);
        y += 22;
      });
    } else {
      ctx.strokeStyle = "#f9fafb";
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, W - 24, H - 24);
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Block Party Tycoon", W - 260, H - 24);
    }
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "block-party-capture.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="min-h-screen w-full bg-black px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex items-center justify-between rounded-xl border border-[#C0C0C0] bg-black p-3">
          <div className="flex items-center gap-2">
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value.slice(0, 22))}
              className="rounded-md border border-[#C0C0C0] bg-black px-2 py-1 text-sm text-white placeholder-[#C0C0C0]"
              aria-label="Shop name"
            />
            <span className="rounded border border-[#C0C0C0] px-2 py-1 text-xs font-semibold text-white">L{licenseLevel}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded border border-[#C0C0C0] px-2 py-1 text-sm font-semibold text-white">${cash}</span>
            <span className="rounded border border-[#C0C0C0] px-2 py-1 text-sm font-semibold text-white">{combo}x</span>
            <label className="flex items-center gap-1 text-xs text-[#C0C0C0]">
              <input type="checkbox" checked={partyBoost} onChange={(e) => setPartyBoost(e.target.checked)} />
              Co-op boost
            </label>
          </div>
        </header>

        {!started ? (
          <div className="rounded-2xl border border-[#C0C0C0] bg-black p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-white">Block Party Tycoon</h1>
            <p className="mb-4 text-[#C0C0C0]">Tap “Open Shop”, serve your first customer in seconds, and ride the rush hour.</p>
            <button
              onClick={() => setStarted(true)}
              className="mx-auto rounded-full border border-white px-6 py-3 text-white transition hover:bg-[#111111]"
            >
              Open Shop
            </button>
          </div>
        ) : (
          <main className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <section className="col-span-2 rounded-2xl border border-[#C0C0C0] bg-black p-4">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#C0C0C0]">Queue</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {queue.map((c) => (
                  <div
                    key={c.id}
                    className="min-w-[110px] rounded-xl border border-[#C0C0C0] bg-black p-3 text-center shadow-sm"
                  >
                    <div className="text-xs text-[#C0C0C0]">${c.spend}</div>
                    <div className="mt-2 text-lg text-white">
                      {c.mood === "happy" ? "😊" : c.mood === "neutral" ? "🙂" : "😠"}
                    </div>
                    <div className="mt-1 text-[10px] uppercase text-[#C0C0C0]">Customer</div>
                  </div>
                ))}
                {queue.length === 0 && (
                  <div className="text-sm text-[#C0C0C0]">Waiting for customers…</div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => serveTop(false)}
                  className="flex-1 rounded-xl border border-white px-4 py-3 text-white transition active:scale-[0.99] disabled:opacity-50 hover:bg-[#111111]"
                  disabled={queue.length === 0}
                >
                  Swipe Serve
                </button>
                <button
                  onClick={restock}
                  className="rounded-xl border border-white px-4 py-3 text-white transition active:scale-[0.99] hover:bg-[#111111]"
                >
                  Restock
                </button>
                <button
                  onClick={startBoost}
                  className={`rounded-xl border border-white px-4 py-3 text-white transition active:scale-[0.99] ${boosting ? "bg-[#111111]" : "hover:bg-[#111111]"}`}
                >
                  {boosting ? "Boosting…" : "Boost"}
                </button>
              </div>
            </section>

            <aside className="col-span-1 space-y-4">
              <div className="rounded-2xl border border-[#C0C0C0] bg-black p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#C0C0C0]">Upgrades</h3>
                <div className="space-y-2">
                  <UpgradeRow
                    label="Fixtures"
                    tier={fixturesTier}
                    cost={(fixturesTier + 1) * 40}
                    onUpgrade={() => setFixturesTier((t) => (t < 3 ? ((setCash((v) => v - (t + 1) * 40)), (t + 1 as UpgradeTier)) : t))}
                    cash={cash}
                  />
                  <UpgradeRow
                    label="Product"
                    tier={productTier}
                    cost={(productTier + 1) * 50}
                    onUpgrade={() => setProductTier((t) => (t < 3 ? ((setCash((v) => v - (t + 1) * 50)), (t + 1 as UpgradeTier)) : t))}
                    cash={cash}
                  />
                  <div className="flex items-center justify-between rounded-xl border border-[#C0C0C0] bg-black p-3">
                    <div>
                      <div className="text-sm font-medium text-white">Auto Staff</div>
                      <div className="text-xs text-[#C0C0C0]">Serve passively during rush</div>
                    </div>
                    <button
                      onClick={() => setAutoStaff((s) => !s)}
                      className={`rounded-full border px-3 py-1 text-sm ${autoStaff ? "border-white text-white" : "border-[#C0C0C0] text-[#C0C0C0]"}`}
                    >
                      {autoStaff ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#C0C0C0] bg-black p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#C0C0C0]">Camera</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => drawCanvas("selfie")}
                    className="rounded-xl border border-white px-3 py-2 text-sm text-white hover:bg-[#111111]"
                  >
                    Selfie
                  </button>
                  <button
                    onClick={() => drawCanvas("replay")}
                    className="rounded-xl border border-white px-3 py-2 text-sm text-white hover:bg-[#111111]"
                  >
                    Rush Replay
                  </button>
                  <button
                    onClick={downloadCanvas}
                    className="rounded-xl border border-white px-3 py-2 text-sm text-white hover:bg-[#111111]"
                  >
                    Save PNG
                  </button>
                </div>
                <div className="mt-2 overflow-hidden rounded-xl border border-[#C0C0C0]">
                  <canvas ref={canvasRef} className="block w-full" />
                </div>
              </div>
            </aside>
          </main>
        )}

        {auditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-[#C0C0C0] bg-black p-5 shadow-xl">
              <div className="mb-3 text-2xl text-white">🧾 Ms. Ledger’s Audit</div>
              <p className="mb-4 text-sm text-[#C0C0C0]">
                Surprise inspection! Answer correctly to secure a license upgrade.
              </p>
              <AuditQuiz onPass={passAudit} onFail={failAudit} />
              <button onClick={() => setAuditOpen(false)} className="mt-3 w-full rounded-xl border border-[#C0C0C0] px-4 py-2 text-sm text-white hover:bg-[#111111]">
                Not now
              </button>
            </div>
          </div>
        )}

        <footer className="mt-2 text-center text-xs text-[#C0C0C0]">
          Simulated GenAI: dynamic skybox/capture textures and NPC dialogue hooks.
        </footer>
      </div>
    </div>
  );
}

function UpgradeRow({
  label,
  tier,
  cost,
  onUpgrade,
  cash,
}: {
  label: string;
  tier: UpgradeTier;
  cost: number;
  onUpgrade: () => void;
  cash: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#C0C0C0] bg-black p-3">
      <div>
        <div className="text-sm font-medium text-white">{label} T{tier}</div>
        <div className="text-xs text-[#C0C0C0]">Next: +{label === "Product" ? 35 : 20}% efficiency</div>
      </div>
      <button
        disabled={tier >= 3 || cash < cost}
        onClick={onUpgrade}
        className="rounded-full border border-white px-3 py-1 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[#111111]"
      >
        ${cost}
      </button>
    </div>
  );
}

function AuditQuiz({ onPass, onFail }: { onPass: () => void; onFail: () => void }) {
  const q = useMemo(() => {
    const qs = [
      {
        prompt: "A rush hour begins. What’s your best move?",
        opts: ["Restock immediately", "Boost to serve faster", "Upgrade fixtures mid-rush"],
        correct: 1,
      },
      {
        prompt: "Impatient customers stack up. What helps reduce loss?",
        opts: ["Auto staff", "More product variety", "Rename the shop"],
        correct: 0,
      },
      {
        prompt: "How to raise average spend quickly?",
        opts: ["Boost", "Product upgrade", "Fixtures upgrade"],
        correct: 1,
      },
    ];
    return qs[Math.floor(Math.random() * qs.length)];
  }, []);
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <div>
      <div className="mb-3 text-sm font-medium text-white">{q.prompt}</div>
      <div className="space-y-2">
        {q.opts.map((o, idx) => (
          <button
            key={idx}
            onClick={() => setChoice(idx)}
            className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${choice === idx ? "border-white bg-[#111111] text-white" : "border-[#C0C0C0] bg-black text-[#C0C0C0]"}`}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => (choice === q.correct ? onPass() : onFail())}
          disabled={choice === null}
          className="flex-1 rounded-xl border border-white px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[#111111]"
        >
          Submit
        </button>
        <button onClick={onFail} className="rounded-xl border border-[#C0C0C0] px-4 py-2 text-sm text-white hover:bg-[#111111]">
          Fail
        </button>
      </div>
    </div>
  );
}
