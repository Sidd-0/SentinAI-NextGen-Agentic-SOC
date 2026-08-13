import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";

export function FingerprintScanner({
  scanning,
  verified,
  onClick,
}: {
  scanning: boolean;
  verified: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mx-auto flex h-48 w-48 items-center justify-center rounded-full transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_25px_var(--neon-cyan)]"
      style={{ perspective: 600 }}
    >
      {/* Rotating rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-3 rounded-full border border-electric/30 border-dashed"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.88 0.18 200 / 0.25), transparent 70%)",
        }}
        animate={{ scale: scanning ? [1, 1.15, 1] : 1, opacity: scanning ? [0.5, 1, 0.5] : 0.6 }}
        transition={{ duration: 1.4, repeat: scanning ? Infinity : 0 }}
      />

      {/* Core */}
      <motion.div
        className={`relative flex h-32 w-32 items-center justify-center rounded-full glass-strong ${
          verified ? "glow-cyan" : "ring-cyber"
        }`}
        animate={{
          rotateY: scanning ? [0, 12, -12, 0] : 0,
          rotateX: scanning ? [0, -8, 8, 0] : 0,
        }}
        transition={{ duration: 2.4, repeat: scanning ? Infinity : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Fingerprint
          className={`h-20 w-20 transition-colors ${
            verified ? "text-success" : scanning ? "text-cyan" : "text-cyan/80"
          }`}
          strokeWidth={1.2}
        />
        {/* Scan line */}
        {scanning && (
          <motion.div
            className="absolute left-2 right-2 h-[2px] rounded-full bg-cyan shadow-[0_0_12px_var(--neon-cyan)]"
            initial={{ top: "10%" }}
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </button>
  );
}
