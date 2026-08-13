import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertOctagon, Bot, Cloud, Cpu, Fingerprint, Globe,
  KeyRound, LogOut, Network, Radio, Server, Shield, ShieldAlert,
  ShieldCheck, Terminal, Zap,
} from "lucide-react";
import { CyberBackground } from "@/components/CyberBackground";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DOMAINS as INITIAL_DOMAINS, PLAYBOOKS, isAuthenticated, signOut, getOperator, BACKEND_URL, type AgentState, type DomainStatus,
} from "@/lib/sentinai-store";

import { generateIncidentReport } from "@/lib/generate-report";

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [
      { title: "Command Center — SentinAI v3.0 Elite" },
      { name: "description", content: "Autonomous Enterprise SOC. Global threat orchestration." },
    ],
  }),
  component: CommandCenter,
});

const DOMAIN_ICONS: Record<string, any> = {
  it: Server, cloud: Cloud, network: Network, appsec: Globe, endpoint: Cpu, iam: KeyRound, api: Radio,
};

const PULSE_INTERVAL_MS = 5000;

interface CombatLogEntry {
  id: number;
  domain: string;
  severity: string;
  message: string;
  timestamp: string;
  formatted: string;
}

function CommandCenter() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [activeDomain, setActiveDomain] = useState("endpoint");
  const [domainStatuses, setDomainStatuses] = useState(INITIAL_DOMAINS);
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([]);
  const [showLockdownModal, setShowLockdownModal] = useState(false);
  const [lockdownRunning, setLockdownRunning] = useState(false);
  const [telemetry, setTelemetry] = useState<any>({
    it_infra: "Initializing...",
    network: "Initializing...",
    iam: "Initializing...",
    endpoint: "Initializing...",
    cloud: "Initializing...",
    api: "Initializing...",
    app_sec: "Initializing...",
    status: "INITIALIZING",
    uptime: "99.9%",
    windows_username: "—",
  });

  useEffect(() => {
    const ok = isAuthenticated();
    setAuthed(ok);
    if (!ok) navigate({ to: "/" });

    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/telemetry`);
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
          if (data.domain_status) {
            const statusMap: Record<string, DomainStatus> = {
              SECURED: "Secured",
              DANGER: "Danger",
            };
            const keyToId: Record<string, string> = {
              it_infra: "it",
              network: "network",
              endpoint: "endpoint",
              iam: "iam",
              cloud: "cloud",
              api: "api",
              app_sec: "appsec",
            };
            setDomainStatuses((prev) =>
              prev.map((d) => {
                const backendKey = Object.entries(keyToId).find(([, id]) => id === d.id)?.[0];
                const raw = backendKey ? data.domain_status[backendKey] : null;
                return raw && statusMap[raw] ? { ...d, status: statusMap[raw] } : d;
              })
            );
          }
        }
      } catch {
        console.log("Telemetry sync paused...");
      }
    };

    const fetchCombatLogs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/logs`);
        if (res.ok) {
          const data = await res.json();
          setCombatLogs(data.logs || []);
        }
      } catch {
        console.log("Combat feed sync paused...");
      }
    };

    fetchTelemetry();
    fetchCombatLogs();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchCombatLogs();
    }, PULSE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [navigate]);

  async function initiateLockdown() {
    setLockdownRunning(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lockdown`, { method: "POST" });
      if (res.ok) {
        const logsRes = await fetch(`${BACKEND_URL}/api/logs`);
        if (logsRes.ok) {
          const data = await logsRes.json();
          setCombatLogs(data.logs || []);
        }
      }
    } catch {
      console.error("Lockdown protocol failed");
    } finally {
      setLockdownRunning(false);
      setShowLockdownModal(false);
    }
  }

  if (!authed) return null;

  return (
    <main className="relative min-h-screen font-inter">
      <CyberBackground />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-6 py-6">
        <DomainSidebar
          activeDomain={activeDomain}
          onActiveDomainChange={setActiveDomain}
          telemetry={telemetry}
          domainStatuses={domainStatuses}
          onLogout={() => { signOut(); navigate({ to: "/" }); }}
        />
        <div className="min-w-0 flex-1 flex flex-col gap-6">
          <CommandWorkspace
            activeDomain={activeDomain}
            onActiveDomainChange={setActiveDomain}
            telemetry={telemetry}
            domainStatuses={domainStatuses}
            setDomainStatuses={setDomainStatuses}
            onLockdownClick={() => setShowLockdownModal(true)}
          />
          <LiveCombatFeed logs={combatLogs} />
        </div>
      </div>

      <AnimatePresence>
        {showLockdownModal && (
          <LockdownModal
            running={lockdownRunning}
            onConfirm={initiateLockdown}
            onCancel={() => setShowLockdownModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

interface SidebarProps {
  activeDomain: string;
  onActiveDomainChange: (v: string) => void;
  telemetry: any;
  domainStatuses: any[];
  onLogout: () => void;
}

function DomainSidebar({ activeDomain, onActiveDomainChange, telemetry, domainStatuses, onLogout }: SidebarProps) {
  return (
    <aside className="hidden w-[300px] shrink-0 lg:block">
      <div className="glass sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 border border-white/5 bg-black/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan shadow-[0_0_15px_#00f2fe]">
            <Shield className="h-6 w-6 text-black" />
          </div>
          <div className="font-black uppercase text-sm tracking-tighter text-white">SentinAI SOC</div>
        </div>

        <div className="mb-6 rounded-xl border border-success/30 bg-success/5 p-4 text-center">
          <div className="text-success font-black text-[10px] uppercase tracking-widest animate-pulse">Neural Core Active</div>
          <div className="text-[9px] text-muted-foreground mt-1 uppercase italic">Uptime: {telemetry.uptime}</div>
          <div className="text-[9px] text-cyan/80 mt-1 font-mono uppercase">Pulse: 5s</div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {domainStatuses.map((d) => {
            const Icon = DOMAIN_ICONS[d.id] ?? Shield;
            const isActive = activeDomain === d.id;
            let liveMetric = d.metric;
            if (d.id === "it") liveMetric = telemetry.it_infra;
            if (d.id === "network") liveMetric = telemetry.network;
            if (d.id === "iam") liveMetric = telemetry.iam;
            if (d.id === "endpoint") liveMetric = telemetry.endpoint;
            if (d.id === "cloud") liveMetric = telemetry.cloud;
            if (d.id === "api") liveMetric = telemetry.api;
            if (d.id === "appsec") liveMetric = telemetry.app_sec;

            return (
              <button key={d.id} onClick={() => onActiveDomainChange(d.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isActive ? "border-cyan/50 bg-cyan/10 shadow-[0_0_20px_-10px_#00f2fe]" : "border-transparent hover:bg-white/5"
                }`}>
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan" : "text-muted-foreground"}`} />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-[11px] font-black uppercase text-white/90 tracking-wider">{d.name}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-mono text-[9px] text-cyan/70 font-bold truncate pr-1">{liveMetric}</span>
                    <StatusDot status={d.status} />
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 py-3 rounded-xl bg-danger/10 text-danger text-[10px] font-black uppercase border border-danger/20 hover:bg-danger/20 transition">
          <LogOut className="h-4 w-4" /> Terminate Session
        </button>
      </div>
    </aside>
  );
}

function StatusDot({ status }: { status: DomainStatus }) {
  const isDanger = status === "Danger";
  return (
    <span className={`h-2 w-2 shrink-0 rounded-full ${
      isDanger ? "bg-danger animate-ping shadow-danger" : "bg-success shadow-success"
    } shadow-[0_0_8px]`} />
  );
}

function LiveCombatFeed({ logs }: { logs: CombatLogEntry[] }) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass rounded-2xl border border-danger/20 bg-black/60 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-danger/10 bg-black/40">
        <Terminal className="h-4 w-4 text-danger animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-danger/90 font-black">Live Combat Feed</span>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground">{logs.length} entries</span>
      </div>
      <div
        ref={feedRef}
        className="h-[140px] overflow-y-auto custom-scrollbar px-5 py-3 font-mono text-[11px] leading-relaxed"
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground/60 italic">Awaiting combat telemetry...</div>
        ) : (
          logs.map((entry) => (
            <div key={entry.id} className="text-cyan/80 hover:text-cyan transition-colors">
              <span className="text-muted-foreground">{entry.timestamp || "—"}</span>
              {" - "}
              <span className="text-danger/90">[{entry.domain}]</span>
              {" - "}
              <span className={entry.message.includes("NEUTRALIZED") ? "text-success" : "text-cyan/70"}>
                {entry.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LockdownModal({ running, onConfirm, onCancel }: { running: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong max-w-md w-full mx-4 rounded-2xl border-2 border-danger/50 bg-black/90 p-8 shadow-[0_0_60px_-10px_var(--emergency-red)]"
      >
        <div className="flex items-center gap-4 mb-6">
          <ShieldAlert className="h-10 w-10 text-danger animate-pulse" />
          <div>
            <h2 className="text-xl font-black uppercase text-danger tracking-wider">Emergency Protocol</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Global Lockdown Authorization Required</p>
          </div>
        </div>
        <p className="text-sm text-white/80 mb-6 leading-relaxed">
          This will immediately terminate all browser processes, enable all Windows Firewall profiles,
          and flush the DNS cache. Confirm to initiate global lockdown.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={running}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 text-[11px] font-black uppercase hover:bg-white/5 transition disabled:opacity-40"
          >
            Abort
          </button>
          <button
            onClick={onConfirm}
            disabled={running}
            className="flex-1 py-3 rounded-xl bg-danger text-white text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition disabled:opacity-40 shadow-[0_0_20px_var(--emergency-red)]"
          >
            {running ? "EXECUTING..." : "Confirm Lockdown"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const INITIAL_AGENTS: AgentState[] = [
  { id: "hunter", name: "Threat Hunter", role: "Identify", status: "idle", progress: 0, message: "Standby — Neural Core Synced." },
  { id: "compliance", name: "Compliance Analyst", role: "SOC2/GDPR", status: "idle", progress: 0, message: "Governance layer active." },
  { id: "responder", name: "Action Unit", role: "Neutralize", status: "idle", progress: 0, message: "Ready for Active Mitigation." },
];

function CommandWorkspace({ activeDomain, onActiveDomainChange, telemetry, domainStatuses, setDomainStatuses, onLockdownClick }: any) {
  const [playbookId, setPlaybookId] = useState(PLAYBOOKS[0].id);
  const [log, setLog] = useState(PLAYBOOKS[0].log);
  const [running, setRunning] = useState(false);
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [killCommands, setKillCommands] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);

  const domainObj = domainStatuses.find((d: any) => d.id === activeDomain)!;

  async function execute() {
    if (running || !log.trim()) return;
    setRunning(true); setAnalysis(null); setClassification(null); setFingerprint(null); setKillCommands(null); setSyncProgress(0);
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: "scanning", progress: 20, message: "Neural synchronization..." })));

    const syncTimer = setInterval(() => setSyncProgress(p => (p >= 92 ? 92 : p + 4)), 150);

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log, domain: domainObj.name }),
      });
      const data = await res.json();

      setAnalysis(data.analysis);
      setClassification(data.classification);
      setFingerprint(data.fingerprint || null);
      setKillCommands(data.action_taken || null);
      setSyncProgress(100);
      setAgents(prev => prev.map(a => ({ ...a, progress: 100, status: "complete", message: "Neutralization Successful." })));

      setDomainStatuses((prev: any) => prev.map((d: any) =>
        d.id === activeDomain ? { ...d, status: "Secured" } : d
      ));
    } catch {
      setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: "idle", message: "Backend sync error." })));
    } finally {
      clearInterval(syncTimer);
      setRunning(false);
    }
  }

  return (
    <section className="min-w-0 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
      <HeaderBar telemetry={telemetry} onLockdownClick={onLockdownClick} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {domainStatuses.map((d: any) => {
          const Icon = DOMAIN_ICONS[d.id] ?? Shield;
          const isTarget = activeDomain === d.id;
          let liveMetric = d.metric;
          if (d.id === "it") liveMetric = telemetry.it_infra;
          if (d.id === "network") liveMetric = telemetry.network;
          if (d.id === "iam") liveMetric = telemetry.iam;
          if (d.id === "endpoint") liveMetric = telemetry.endpoint;
          if (d.id === "cloud") liveMetric = telemetry.cloud;
          if (d.id === "api") liveMetric = telemetry.api;
          if (d.id === "appsec") liveMetric = telemetry.app_sec;

          return (
            <motion.button key={d.id} onClick={() => onActiveDomainChange(d.id)}
              className={`glass relative overflow-hidden rounded-2xl p-5 text-left transition-all ${isTarget ? "ring-2 ring-cyan shadow-[0_0_30px_-5px_#00f2fe]" : "opacity-80"}`}>
              <div className="flex items-start justify-between">
                <Icon className="h-6 w-6 text-cyan" />
                <StatusBadge status={d.status} />
              </div>
              <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-cyan/70">{d.name}</div>
              <div className="mt-1 text-sm font-bold text-white uppercase truncate">{liveMetric}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="glass-strong scanline rounded-2xl p-6 border border-cyan/20 bg-black/40">
          <div className="flex items-center gap-3 mb-6 uppercase tracking-tighter font-black"><Zap className="h-6 w-6 text-cyan" /> Neural Intake Feed</div>
          <select value={playbookId} onChange={(e) => { setPlaybookId(e.target.value); setLog(e.target.value === "manual" ? "" : PLAYBOOKS.find(p => p.id === e.target.value)?.log || ""); }}
            className="w-full rounded-xl bg-background/80 p-4 font-mono text-xs text-cyan border border-cyan/20 focus:border-cyan/50 outline-none mb-4">
            {PLAYBOOKS.map(p => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
            <option value="manual" className="bg-black">Manual Entry - Custom Injection</option>
          </select>
          <textarea value={log} onChange={(e) => setLog(e.target.value)} className="w-full bg-black/60 p-5 font-mono text-[11px] text-cyan/90 border border-cyan/10 rounded-2xl outline-none min-h-[250px]" placeholder="// Neural intake ready..." />
          <button onClick={execute} disabled={running} className="w-full mt-6 bg-gradient-to-r from-cyan to-blue-600 py-4 rounded-xl font-black tracking-[0.3em] text-white hover:brightness-110 active:scale-[0.98] disabled:opacity-40 shadow-[0_0_20px_#00f2fe]">
            {running ? "MITIGATION IN PROGRESS..." : "INITIATE NEURAL MITIGATION"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="font-mono text-[11px] uppercase text-cyan/60 tracking-[0.4em] px-2 flex items-center gap-2"><Bot className="h-4 w-4" /> Global Agents</div>
          {agents.map((a) => (
            <div key={a.id} className="glass p-5 rounded-2xl border border-white/5 bg-white/5">
              <div className="flex justify-between items-center mb-3 text-xs font-black text-cyan uppercase tracking-widest">
                <span>{a.name}</span>
                <span className="text-[9px] bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">{a.status}</span>
              </div>
              <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${a.progress}%` }} className="h-full bg-cyan shadow-[0_0_10px_#00f2fe]" />
              </div>
              <div className="mt-3 text-[10px] font-mono text-muted-foreground italic">&ldquo;{a.message}&rdquo;</div>
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong p-8 rounded-2xl border border-cyan/30 bg-black/40 shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4"><ShieldCheck className="text-success h-8 w-8" /><h2 className="text-2xl font-black uppercase tracking-widest text-white">Active Intelligence Report</h2></div>
          {!!analysis && !running && (
            <button onClick={() => {
              const selectedPlaybook = playbookId === "manual"
                ? { id: "manual", name: "Manual Intelligence Feed", category: "Manual", log }
                : PLAYBOOKS.find(p => p.id === playbookId) ?? { id: "unknown", name: "Unknown Playbook", category: "Unknown", log };
              generateIncidentReport(selectedPlaybook as any, log, analysis ?? undefined, domainObj.name, classification ?? undefined, fingerprint ?? undefined, killCommands ?? undefined);
            }} className="bg-success text-black px-6 py-3 rounded-xl font-black uppercase text-[11px] shadow-lg hover:brightness-110 transition-all">Save to Docs</button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <MetadataItem label="Windows Identity" value={telemetry.windows_username || "—"} color="text-success" />
          <MetadataItem label="Domain" value={domainObj.name} color="text-cyan" />
          <MetadataItem label="Pattern" value={classification || (analysis ? "Identified" : "Scanning...")} color={analysis ? "text-danger" : "text-muted-foreground"} />
          <MetadataItem label="Mitigation" value={analysis ? "NEUTRALIZED" : "IDLE"} color={analysis ? "text-success" : "text-muted-foreground"} />
        </div>
        <div className="bg-[#05070a] p-8 rounded-3xl border border-cyan/10 font-mono text-sm leading-relaxed text-cyan/80 min-h-[250px] shadow-inner whitespace-pre-wrap">
          {analysis || (running ? "Analyzing telemetry signatures..." : "Command Hub idle. Deploy system intake feed.")}
        </div>
      </motion.div>
    </section>
  );
}

function MetadataItem({ label, value, color }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
      <div className={`font-black text-xs truncate uppercase ${color}`}>{value}</div>
    </div>
  );
}

function HeaderBar({ telemetry, onLockdownClick }: { telemetry: any; onLockdownClick: () => void }) {
  const operatorName = getOperator()?.name || "Neural Operator";
  const winUser = telemetry.windows_username || "—";

  return (
    <div className="glass flex flex-wrap items-center justify-between gap-4 px-8 py-5 rounded-2xl border-white/5 bg-black/20 shadow-2xl">
      <div className="flex items-center gap-5">
        <Fingerprint className="h-8 w-8 text-cyan animate-pulse" />
        <div>
          <div className="font-mono text-[10px] uppercase text-cyan/60 tracking-[0.4em]">Authorized Identity</div>
          <div className="text-xl font-black text-white uppercase">
            {operatorName}
            <span className="text-[10px] text-cyan ml-2 font-mono bg-cyan/10 px-2 py-1 rounded border border-cyan/30">Tier-1 Root</span>
          </div>
          <div className="font-mono text-[9px] text-success/80 mt-1 uppercase tracking-widest">
            Windows Session: {winUser}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right font-mono">
          <div className="text-[9px] uppercase text-muted-foreground tracking-[0.2em]">Global Pulse</div>
          <div className={`text-[10px] font-black uppercase ${
            telemetry.status === "OPERATIONAL" ? "text-success"
              : telemetry.status === "CRITICAL" ? "text-danger animate-pulse"
                : "text-warning"
          }`}>NODE: SENTINAI [{telemetry.status}]</div>
        </div>
        <button
          onClick={onLockdownClick}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-danger/20 border-2 border-danger/60 text-danger text-[10px] font-black uppercase tracking-wider hover:bg-danger/30 hover:shadow-[0_0_25px_var(--emergency-red)] transition-all animate-pulse"
        >
          <ShieldAlert className="h-4 w-4" />
          Initiate Global Lockdown
        </button>
      </div>
    </div>
  );
}
