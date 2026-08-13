import type { DomainStatus } from "@/lib/sentinai-store";
import { ShieldCheck, Activity, AlertOctagon } from "lucide-react";

export function StatusBadge({ status, size = "sm" }: { status: DomainStatus; size?: "sm" | "md" }) {
  const map = {
    Secured: {
      cls: "text-success border-success/40 bg-success/10",
      dot: "bg-success shadow-[0_0_10px_var(--neon-green)]",
      Icon: ShieldCheck,
    },
    Monitoring: {
      cls: "text-cyan border-cyan/40 bg-cyan/10",
      dot: "bg-cyan shadow-[0_0_10px_var(--neon-cyan)]",
      Icon: Activity,
    },
    "Threat Detected": {
      cls: "text-danger border-danger/50 bg-danger/10",
      dot: "bg-danger shadow-[0_0_12px_var(--emergency-red)] animate-pulse",
      Icon: AlertOctagon,
    },
  } as const;
  const { cls, dot, Icon } = map[status];
  const padding = size === "md" ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[10px]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${padding} font-mono uppercase tracking-wider ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
