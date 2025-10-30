"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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
  }, [fixturesTier]);

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

  const spendMultiplier = useMemo(() => {
    const base = 1 + productTier * 0.35;
    const comboBonus = 1 + Math.min(combo, 10) * 0.05;
    const boost = boosting ? 1.3 : 1;
    const party = partyBoost ? 1.2 : 1;
    const license = 1 + licenseLevel * 0.15;
    return base * comboBonus * boost * party * license;
  }, [productTier, combo, boosting, partyBoost, licenseLevel]);

  function serveTop(passive = false) {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [top, ...rest] = prev;
      const moodMul = top.mood === "happy" ? 1.2 : top.mood === "neutral" ? 1 : 0.7;
      const earned = Math.round(top.spend * spendMultiplier * moodMul);
      setCash((v) => v + earned);
      setCombo((c) => Math.min(c + 1, 20));
      return rest;
    });
  }

  function restock() { setCombo(0); }
  function startBoost() { if (!boosting) { setBoosting(true); setTimeout(() => setBoosting(false), 3000); } }
  function passAudit() { setLicenseLevel((l) => Math.min(l + 1, 3)); setCash((v) => v + 50 + licenseLevel * 25); setAuditOpen(false); }
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

  return (
    <div className="min-h-screen w-full bg-black px-4 py-6 sm:px-6 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="text-3xl font-bold text-white hover:text-[#EBF73F] transition-colors duration-300">Block Party Taycon</div>
        <CornerFrame className="flex items-center justify-between" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
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
        </CornerFrame>

        <main className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CornerFrame className="col-span-2" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#C0C0C0]">Queue</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {queue.map((c) => (
                <CornerFrame key={c.id} className="min-w-[110px]" paddingClassName="p-3" cornerOffset={0} cornerRadius={0}>
                  <div className="text-xs text-[#C0C0C0]">${c.spend}</div>
                  <div className="mt-2 text-lg">{c.mood === "happy" ? "😊" : c.mood === "neutral" ? "🙂" : "😠"}</div>
                  <div className="mt-1 text-[10px] uppercase text-[#C0C0C0]">Customer</div>
                </CornerFrame>
              ))}
              {queue.length === 0 && <div className="text-sm text-[#C0C0C0]">Waiting for customers…</div>}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => serveTop(false)} className="flex-1 rounded-xl border border-white px-4 py-3 text-white transition active:scale-[0.99] disabled:opacity-50 hover:bg-[#111111]" disabled={queue.length === 0}>Serve</button>
              <button onClick={restock} className="rounded-xl border border-white px-4 py-3 text-white transition active:scale-[0.99] hover:bg-[#111111]">Restock</button>
              <button onClick={startBoost} className={`rounded-xl border border-white px-4 py-3 text-white transition active:scale-[0.99] ${boosting ? "bg-[#111111]" : "hover:bg-[#111111]"}`}>{boosting ? "Boosting…" : "Boost"}</button>
            </div>
          </CornerFrame>

          <aside className="col-span-1 space-y-4">
            <CornerFrame className="" paddingClassName="p-4" cornerOffset={0} cornerRadius={0}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#C0C0C0]">Upgrades</h3>
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
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#C0C0C0]">Camera</h3>
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


