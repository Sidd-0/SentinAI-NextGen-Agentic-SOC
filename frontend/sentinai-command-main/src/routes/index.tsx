import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Lock, Mail, AlertCircle, CheckCircle2, User, KeyRound, Sparkles, ArrowLeft,
} from "lucide-react";
import { CyberBackground } from "@/components/CyberBackground";
import { FingerprintScanner } from "@/components/FingerprintScanner";
import { signInRemote, signUpRemote, resetAccessCode, passwordStrength } from "@/lib/sentinai-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinAI v2.0 — Neural Gateway" },
      { name: "description", content: "Military-grade biometric entry to the SentinAI Autonomous Cyber Security Command Center." },
    ],
  }),
  component: GatewayPage,
});

type Phase = "form" | "otp" | "signup-success" | "scanning" | "verified" | "reset";
type Mode = "login" | "signup";


function GatewayPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup
  const [opName, setOpName] = useState("");
  const [deptEmail, setDeptEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");

  // Reset
  const [resetEmail, setResetEmail] = useState("");

  function proceedToCommand() {
    setPhase("scanning");
    setTimeout(() => setPhase("verified"), 1800);
    setTimeout(() => navigate({ to: "/command" }), 2800);
  }

  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (submitting) return;
    setSubmitting(true);
    const r = await signInRemote(loginEmail, loginPassword);
    setSubmitting(false);
    if (!r.ok) {
      setError(r.error || "Access denied.");
      return;
    }
    proceedToCommand();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (submitting) return;
    setPhase("otp");
    setSubmitting(true);
    const r = await signUpRemote(opName, deptEmail, accessCode);
    setSubmitting(false);
    if (!r.ok) {
      setPhase("form");
      setError(r.error || "Signup failed.");
      return;
    }
    setTimeout(() => setPhase("signup-success"), 800);
    setTimeout(() => proceedToCommand(), 2600);
  }


  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = resetAccessCode(resetEmail);
    if (!r.ok) { setError(r.error || "Reset failed."); return; }
    setNotice("Neural reset link dispatched to your department inbox.");
  }

  const strength = passwordStrength(accessCode);
  const strengthColors = ["bg-muted", "bg-danger", "bg-warning", "bg-cyan", "bg-success"];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <CyberBackground />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: brand */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--neon-cyan)]" />
                Military Grade · TLS 1.3 · FIPS 140-3
              </div>
              <h1 className="text-6xl font-black leading-[0.95] md:text-7xl">
                <span className="text-gradient-cyber">Sentin</span>
                <span className="text-foreground">AI</span>
                <span className="ml-3 align-top text-2xl font-mono text-cyan/70">v2.0</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Autonomous Cyber Security Command Center. Neural identity verification required to enter the SOC.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { k: "Brain", v: "Llama 3.3 Versatile" },
                { k: "Memory", v: "Pinecone RAG" },
                { k: "Ops", v: "PEFT / LoRA" },
                { k: "Cloud", v: "AWS Bedrock" },
              ].map((s) => (
                <div key={s.k} className="glass rounded-xl p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">{s.k}</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: gateway */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass-strong scanline relative overflow-hidden rounded-3xl p-8 shadow-[var(--shadow-elevated)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                <Lock className="h-3 w-3" /> Biometric Gateway
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">SESSION_INIT</div>
            </div>

            <div className="mb-6 flex justify-center">
              <FingerprintScanner scanning={phase === "scanning"} verified={phase === "verified"} />
            </div>

            {/* Tabs */}
            {phase === "form" && (
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-cyan/15 bg-background/30 p-1">
                {(["login", "signup"] as Mode[]).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setError(null); setNotice(null); }}
                      className="relative rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition"
                    >
                      {active && (
                        <motion.span
                          layoutId="tab-bg"
                          className="absolute inset-0 rounded-lg"
                          style={{ background: "var(--gradient-cyber)", boxShadow: "var(--shadow-glow-cyan)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        />
                      )}
                      <span className={`relative ${active ? "text-primary-foreground" : "text-cyan/70"}`}>
                        {m === "login" ? "Access Command" : "New Deployment"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <AnimatePresence mode="wait">
              {phase === "form" && mode === "login" && (
                <motion.form
                  key="login"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                  transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                  className="space-y-4"
                >
                  <Field icon={Mail} label="Operator Email" value={loginEmail} onChange={setLoginEmail} type="email" autoComplete="off" placeholder="operator@dept.gov" />
                  <Field icon={Lock} label="Access Code" value={loginPassword} onChange={setLoginPassword} type="password" autoComplete="new-password" placeholder="••••••••" />

                  {error && <ErrorBox msg={error} />}

                  <PrimaryButton icon={ShieldCheck}>Initiate Neural Scan</PrimaryButton>

                  <button
                    type="button"
                    onClick={() => { setPhase("reset"); setError(null); setNotice(null); }}
                    className="block w-full text-center font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/70 transition hover:text-cyan hover:drop-shadow-[0_0_8px_var(--neon-cyan)]"
                  >
                    ⟁ Forgot Access Code?
                  </button>
                </motion.form>
              )}

              {phase === "form" && mode === "signup" && (
                <motion.form
                  key="signup"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                  transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                  className="space-y-4"
                >
                  <Field icon={User} label="Operator Name" value={opName} onChange={setOpName} type="text" autoComplete="off" placeholder="Cmdr. Jane Kapoor" />
                  <Field icon={Mail} label="Department Email" value={deptEmail} onChange={setDeptEmail} type="email" autoComplete="off" placeholder="jane@cyberops.gov" />
                  <Field icon={KeyRound} label="Set Access Code" value={accessCode} onChange={setAccessCode} type="password" autoComplete="new-password" placeholder="min 8 chars" />

                  {/* Strength meter */}
                  <div>
                    <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className="text-cyan/70">Code Strength</span>
                      <span className="text-cyan">{strength.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? strengthColors[strength.score] : "bg-muted/40"}`}
                          animate={i <= strength.score ? { boxShadow: ["0 0 0px transparent", "0 0 10px var(--neon-cyan)", "0 0 0px transparent"] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>

                  {error && <ErrorBox msg={error} />}

                  <PrimaryButton icon={Sparkles}>Deploy New Operator</PrimaryButton>
                </motion.form>
              )}

              {phase === "reset" && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
                    Neural Reset Protocol Engaged
                  </div>
                  <form onSubmit={handleReset} className="space-y-4">
                    <Field icon={Mail} label="Department Email" value={resetEmail} onChange={setResetEmail} type="email" autoComplete="off" placeholder="operator@dept.gov" />
                    {error && <ErrorBox msg={error} />}
                    {notice && (
                      <div className="flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {notice}
                      </div>
                    )}
                    <PrimaryButton icon={Sparkles}>Dispatch Reset Beacon</PrimaryButton>
                  </form>
                  <button
                    type="button"
                    onClick={() => { setPhase("form"); setError(null); setNotice(null); }}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/70 hover:text-cyan"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back to gateway
                  </button>
                </motion.div>
              )}

              {phase === "otp" && (
                <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
                  <div className="font-mono text-sm uppercase tracking-[0.25em] text-cyan terminal-cursor">
                    Sending Neural OTP
                  </div>
                  <div className="text-xs text-muted-foreground">Dispatching one-time cipher to {deptEmail || "your inbox"}…</div>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-muted/40">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "var(--gradient-cyber)", boxShadow: "var(--shadow-glow-cyan)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.6, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <motion.span
                        key={i}
                        className="flex h-9 w-7 items-center justify-center rounded-md border border-cyan/30 bg-cyan/5 font-mono text-sm text-cyan"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
                      >
                        {Math.floor(Math.random() * 10)}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "signup-success" && (
                <motion.div
                  key="signup-success"
                  initial={{ opacity: 0, scale: 0.7, rotateX: -45 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d", perspective: 800 }}
                  className="space-y-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                    transition={{ duration: 0.9, ease: "backOut" }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-success/60 bg-success/10 shadow-[0_0_40px_var(--neon-green,#22c55e)]"
                  >
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </motion.div>
                  <div className="font-mono text-sm uppercase tracking-[0.25em] text-success">
                    Identity Secured in Local Database
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Operator <span className="text-cyan">{opName}</span> deployed · Routing to command…
                  </div>
                  <motion.div
                    className="mx-auto h-[2px] w-3/4 rounded-full"
                    style={{ background: "var(--gradient-cyber)", boxShadow: "var(--shadow-glow-cyan)" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.6 }}
                  />
                </motion.div>
              )}



              {phase === "scanning" && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
                  <div className="font-mono text-sm uppercase tracking-[0.25em] text-cyan terminal-cursor">
                    Scanning Neural Signature
                  </div>
                  <div className="text-xs text-muted-foreground">Matching against identity vector store…</div>
                </motion.div>
              )}

              {phase === "verified" && (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-2 font-mono text-sm uppercase tracking-[0.2em] text-success">
                    <CheckCircle2 className="h-4 w-4" /> Neural Identity Verified
                  </div>
                  <div className="text-xs text-muted-foreground">Routing to Command Center…</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {msg}
    </div>
  );
}

function PrimaryButton({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="group relative mt-2 w-full overflow-hidden rounded-xl py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
      style={{ background: "var(--gradient-cyber)", boxShadow: "var(--shadow-glow-cyan)" }}
    >
      <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition" />
      <span className="relative flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" /> {children}
      </span>
    </button>
  );
}

function Field({
  icon: Icon, label, value, onChange, type, autoComplete, placeholder,
}: { icon: any; label: string; value: string; onChange: (v: string) => void; type: string; autoComplete?: string; placeholder?: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan/80">{label}</div>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan/60" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete ?? "off"}
          placeholder={placeholder}
          className="w-full rounded-xl border border-cyan/20 bg-background/40 py-3 pl-10 pr-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/30"
        />
      </div>
    </label>
  );
}
