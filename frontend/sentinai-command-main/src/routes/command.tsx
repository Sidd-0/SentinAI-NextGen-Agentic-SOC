import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertOctagon, Bot, Brain, Cloud, Cpu, Download, FileText, Fingerprint, Globe,
  KeyRound, LogOut, Network, PlayCircle, Power, Radio, Server, Shield, ShieldAlert,
  ShieldCheck, Sparkles, Target, Terminal, Zap,
} from "lucide-react";
import { CyberBackground } from "@/components/CyberBackground";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DOMAINS as INITIAL_DOMAINS, PLAYBOOKS, isAuthenticated, signOut, getOperator, type AgentState, type DomainStatus,
} from "@/lib/sentinai-store";
import { generateIncidentReport } from "@/lib/generate-report";

export const Route = createFileRoute("/command")({
  component: CommandCenter,
});

const DOMAIN_ICONS: Record<string, any> = {
  it: Server, cloud: Cloud, network: Network, appsec: Globe, endpoint: Cpu, iam: KeyRound, api: Radio,
};

const BACKEND_URL = "http://127.0.0.1:8000";

function CommandCenter() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [activeDomain, setActiveDomain] = useState("endpoint");
  const [domainStatuses, setDomainStatuses] = useState(INITIAL_DOMAINS);
  const [log, setLog] = useState("");
  const [playbookId, setPlaybookId] = useState("manual");
  const [running, setRunning] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState({ it_infra: "Scanning...", network: "Analyzing...", iam: "1", status: "Healthy", uptime: "99.9%" });

  const [agents, setAgents] = useState<AgentState[]>([
    { id: "hunter", name: "Threat Hunter", role: "Identify", status: "idle", progress: 0, message: "Standing by." },
    { id: "compliance", name: "Compliance Analyst", role: "SOC2 Mapping", status: "idle", progress: 0, message: "Policies Loaded." },
    { id: "responder", name: "Action Unit", role: "Defend / Kill", status: "idle", progress: 0, message: "Shell Ready." },
  ]);

  useEffect(() => {
    const ok = isAuthenticated(); setAuthed(ok);
    if (!ok) navigate({ to: "/" });

    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/telemetry`);
        if (res.ok) { const data = await res.json(); setTelemetry(data); }
      } catch (e) { console.log("Sync..."); }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const domainObj = useMemo(() => domainStatuses.find(d => d.id === activeDomain)!, [activeDomain, domainStatuses]);

  async function execute() {
    if (running || !log.trim()) return;
    setRunning(true); setAnalysis(null); setClassification(null);
    setAgents(prev => prev.map(a => ({ ...a, status: "scanning", progress: 30 })));

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log, domain: domainObj.name }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setClassification(data.classification);
      setAgents(prev => prev.map(a => ({ ...a, status: "complete", progress: 100, message: "Neural Defense Success." })));
      setDomainStatuses(prev => prev.map(d => d.id === activeDomain ? { ...d, status: "Secured" as DomainStatus } : d));
    } catch (err) { alert("Backend bridge failure."); }
    finally { setRunning(false); }
  }

  // --- 🏆 FIXING YOUR ERROR: ADDING MISSING 'LOG' PROPERTY ---
  async function downloadReport() {
    if (!analysis) return;
    
    // Yahan humne 'log' property jodh di hai taaki error na aaye
    const currentPlaybook = PLAYBOOKS.find(p => p.id === playbookId) || { 
      id: "manual", 
      name: "Manual Intelligence Feed", 
      category: "Forensic Analysis",
      log: log // YE RAHI WOH PROPERTY JO MISSING THI
    };

    await generateIncidentReport(currentPlaybook, log, analysis, domainObj.name, classification || "Classified Threat");
  }

  if (!authed) return null;

  return (
    <main className="relative min-h-screen bg-[#05070a] text-white p-6 font-inter">
      <CyberBackground />
      <div className="relative mx-auto flex max-w-[1600px] gap-6 min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-[300px] shrink-0 glass p-5 rounded-2xl border border-white/5 bg-black/40">
           <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 bg-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_#00f2fe]"><Shield className="text-black h-6" /></div>
              <div className="font-black uppercase text-sm">SentinAI SOC</div>
           </div>
           <nav className="space-y-2">
              {domainStatuses.map(d => {
                const Icon = DOMAIN_ICONS[d.id] ?? Shield;
                return (
                  <button key={d.id} onClick={() => setActiveDomain(d.id)} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${activeDomain === d.id ? "border-cyan bg-cyan/10 shadow-[0_0_15px_-5px_#00f2fe]" : "border-transparent opacity-70"}`}>
                    <Icon className={`h-4 w-4 ${activeDomain === d.id ? "text-cyan" : ""}`} />
                    <div className="text-left flex-1 ml-3"><div className="text-[10px] font-black uppercase">{d.name}</div><div className="text-[9px] text-muted-foreground">{d.id==='it' ? telemetry.it_infra : d.metric}</div></div>
                    <div className={`h-1.5 w-1.5 rounded-full ${d.status === 'Secured' ? 'bg-success' : 'bg-danger animate-ping'}`} />
                  </button>
                );
              })}
           </nav>
        </aside>

        {/* WORKSPACE */}
        <section className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <header className="glass p-6 rounded-2xl flex justify-between items-center border border-white/5">
              <div className="flex items-center gap-4"><Fingerprint className="text-cyan h-8 w-8 animate-pulse" /><div><div className="text-[9px] uppercase text-cyan/60">Operator ID</div><div className="text-lg font-black uppercase tracking-tight">{getOperator()?.name}</div></div></div>
              <div className="text-right font-mono text-success text-[10px] font-bold uppercase tracking-widest shadow-success">Node: Alpha [LIVE] ✅</div>
          </header>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-strong p-6 rounded-2xl border border-cyan/20 bg-black/40">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2 tracking-tighter"><Zap className="h-5 w-5 text-cyan" /> Neural Feed</h2>
                <select value={playbookId} onChange={(e) => {setPlaybookId(e.target.value); setLog(e.target.value==='manual'?"":PLAYBOOKS.find(p=>p.id===e.target.value)?.log || "")}} className="w-full rounded-xl bg-background/80 p-4 font-mono text-xs text-cyan border border-cyan/20 mb-4 outline-none">
                    {PLAYBOOKS.map(p => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
                    <option value="manual" className="bg-black">✎ Manual Feed - Custom Injection</option>
                </select>
                <textarea value={log} onChange={(e) => setLog(e.target.value)} className="w-full bg-black/60 p-5 font-mono text-xs text-cyan/90 border border-cyan/10 rounded-2xl outline-none min-h-[250px]" placeholder="// Awaiting telemetry..." />
                <button onClick={execute} disabled={running} className="w-full mt-6 bg-gradient-to-r from-cyan to-blue-600 py-4 rounded-xl font-black text-white active:scale-95 transition-all shadow-lg tracking-widest uppercase">
                    {running ? "MITIGATING..." : "⚡ INITIATE NEURAL MITIGATION"}
                </button>
            </div>

            <div className="space-y-4">
                {agents.map(a => (
                    <div key={a.id} className="glass p-5 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase text-cyan"><span>{a.name}</span><span>{a.status}</span></div>
                        <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden">
                            <motion.div animate={{width: `${a.progress}%`}} className="h-full bg-cyan shadow-[0_0_10px_#00f2fe]" />
                        </div>
                        <div className="mt-2 text-[10px] text-muted-foreground">{a.message}</div>
                    </div>
                ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong p-8 rounded-2xl border border-cyan/30 bg-black/40 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4"><ShieldCheck className="text-success h-8 w-8" /><h2 className="text-xl font-black uppercase tracking-widest text-white">Active Intelligence</h2></div>
                    {analysis && <button onClick={downloadReport} className="bg-success text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg hover:brightness-110 transition-all">Save to Docs</button>}
                </div>
                <div className="bg-[#05070a] p-6 rounded-2xl border border-cyan/10 font-mono text-[12px] leading-relaxed text-cyan/80 min-h-[250px] whitespace-pre-wrap shadow-inner overflow-y-auto">
                    {classification && <div className="text-danger font-black mb-4 border-b border-danger/30 pb-2 uppercase tracking-widest text-center italic">Classification: {classification}</div>}
                    {analysis || "Command Hub idle. Deploy system telemetry feed."}
                </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}