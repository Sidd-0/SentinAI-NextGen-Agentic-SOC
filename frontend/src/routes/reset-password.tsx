import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { CyberBackground } from "@/components/CyberBackground";
import { resetAccessCodeRemote } from "@/lib/sentinai-store";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Access Code — SentinAI" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) return setError("Missing token.");
    if (newPass.length < 8) return setError("Access code must be at least 8 characters.");
    if (newPass !== confirm) return setError("Codes do not match.");
    setStatus("submitting");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPass }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Reset failed.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setTimeout(() => navigate({ to: "/" }), 1800);
    } catch (e: any) {
      setError("Network error.");
      setStatus("error");
    }
  }

  return (
    <main className="relative min-h-screen">
      <CyberBackground />
      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-10">
        <motion.div className="glass-strong p-8 rounded-3xl w-full max-w-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-center justify-between">
            <div className="font-mono text-[10px] text-cyan">RESET ACCESS CODE</div>
            <button onClick={() => navigate({ to: "/" })} className="text-cyan/70"><ArrowLeft className="h-4 w-4"/></button>
          </div>

          {status === "success" ? (
            <div className="text-center py-10">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <h2 className="mt-4 text-xl font-black">Access Code Updated</h2>
              <p className="mt-2 text-sm text-muted-foreground">You will be redirected to the gateway shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="font-mono text-[11px] text-cyan/70">New Access Code</label>
                <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" className="w-full rounded-xl p-3 mt-2 bg-black/60 text-cyan" />
              </div>
              <div>
                <label className="font-mono text-[11px] text-cyan/70">Confirm Access Code</label>
                <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="w-full rounded-xl p-3 mt-2 bg-black/60 text-cyan" />
              </div>
              {error && <div className="text-sm text-danger">{error}</div>}
              <button type="submit" disabled={status === "submitting"} className="w-full bg-gradient-to-r from-cyan to-blue-600 py-3 rounded-xl font-black text-white">{status === "submitting" ? "Updating…" : "Update Access Code"}</button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
