// Simple client-side auth store using localStorage
export const AUTH_KEY = "sentinai_auth_v2";
export const USERS_KEY = "sentinai_users_v2";
export const OPERATOR_KEY = "sentinai_operator_v2";
export const BACKEND_URL = "http://127.0.0.1:8000";

export function setOperator(op: { name: string; email: string }) {
  try { window.localStorage.setItem(OPERATOR_KEY, JSON.stringify(op)); } catch {}
}
export function getOperator(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(OPERATOR_KEY) || "null"); } catch { return null; }
}

export async function signInRemote(email: string, password: string): Promise<{ ok: boolean; error?: string; name?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    const data = await res.json().catch(() => ({} as any));
    const msg = (data?.message || data?.status || "").toString();
    const granted = res.ok && (msg.toLowerCase().includes("access granted") || data?.ok === true || data?.success === true);
    if (!granted) return { ok: false, error: data?.error || data?.message || "Access denied by backend." };
    const name = (data?.name as string) || email.split("@")[0];
    window.localStorage.setItem(AUTH_KEY, "1");
    setOperator({ name, email: email.trim().toLowerCase() });
    return { ok: true, name };
  } catch (e: any) {
    return { ok: false, error: `Backend unreachable at ${BACKEND_URL}/api/login. Is your Python server running?` };
  }
}

export async function signUpRemote(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!name.trim()) return { ok: false, error: "Operator name required." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Invalid email." };
  if (password.length < 8) return { ok: false, error: "Access code must be at least 8 characters." };
  try {
    const res = await fetch(`${BACKEND_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
    });
    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) return { ok: false, error: data?.error || data?.message || `Signup rejected (${res.status}).` };
    window.localStorage.setItem(AUTH_KEY, "1");
    setOperator({ name: name.trim(), email: email.trim().toLowerCase() });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: `Backend unreachable at ${BACKEND_URL}/api/signup. Is your Python server running?` };
  }
}


export const ADMIN_EMAIL = "admin@sentinai.com";
export const ADMIN_PASSWORD = "sentinai123";

interface StoredUser { name: string; email: string; password: string; }

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(u: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export function signIn(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  if (e === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  const user = loadUsers().find((u) => u.email === e && u.password === password);
  if (user) {
    window.localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}

export function signUp(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const e = email.trim().toLowerCase();
  if (!name.trim()) return { ok: false, error: "Operator name required." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { ok: false, error: "Invalid department email." };
  if (password.length < 8) return { ok: false, error: "Access code must be at least 8 characters." };
  const users = loadUsers();
  if (e === ADMIN_EMAIL || users.some((u) => u.email === e)) {
    return { ok: false, error: "Operator already deployed with this email." };
  }
  users.push({ name: name.trim(), email: e, password });
  saveUsers(users);
  window.localStorage.setItem(AUTH_KEY, "1");
  return { ok: true };
}

export function resetAccessCode(email: string): { ok: boolean; error?: string } {
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { ok: false, error: "Invalid email." };
  return { ok: true };
}

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  const score = Math.min(4, s) as 0 | 1 | 2 | 3 | 4;
  const labels = ["Empty", "Weak", "Fair", "Strong", "Fortress"];
  return { score, label: labels[score] };
}

export function signOut() {
  window.localStorage.removeItem(AUTH_KEY);
}

export type DomainStatus = "Secured" | "Monitoring" | "Threat Detected";

export interface Domain {
  id: string;
  name: string;
  short: string;
  status: DomainStatus;
  metric: string;
}

export const DOMAINS: Domain[] = [
  { id: "it", name: "IT Infrastructure", short: "INFRA", status: "Secured", metric: "412 nodes" },
  { id: "cloud", name: "Cloud Security (AWS/Azure)", short: "CLOUD", status: "Monitoring", metric: "18 accounts" },
  { id: "network", name: "Network Security", short: "NET", status: "Monitoring", metric: "9.2 Gbps" },
  { id: "appsec", name: "Application Security", short: "APPSEC", status: "Secured", metric: "146 apps" },
  { id: "endpoint", name: "Endpoint Protection", short: "EDR", status: "Threat Detected", metric: "3 alerts" },
  { id: "iam", name: "Identity & Access Mgmt (IAM)", short: "IAM", status: "Secured", metric: "8.4k users" },
  { id: "api", name: "API Security", short: "API", status: "Monitoring", metric: "1,204 endpoints" },
];

export interface Playbook {
  id: string;
  name: string;
  category: string;
  log: string;
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: "lockbit",
    name: "Ransomware — LockBit 3.0",
    category: "Ransomware",
    log: `[2026-05-18T03:14:22Z] EDR_ALERT host=fin-srv-04 user=svc_backup process=svchost.exe parent=powershell.exe
[2026-05-18T03:14:23Z] FS_EVENT  action=mass_rename ext=.lockbit count=4821 path=\\\\fin-srv-04\\shares
[2026-05-18T03:14:25Z] NETWORK   dst=185.220.101.45 port=443 bytes_out=2.1GB tag=tor_exit_node
[2026-05-18T03:14:26Z] PROCESS   cmd="vssadmin delete shadows /all /quiet" pid=8124
[2026-05-18T03:14:27Z] PROCESS   cmd="bcdedit /set {default} recoveryenabled No"
[2026-05-18T03:14:30Z] RANSOM_NOTE file=RESTORE-MY-FILES.txt hash=9f4c...lockbit3
SIGNATURE: LockBit 3.0 (BlackMatter lineage) — encryption + exfiltration double extortion.`,
  },
  {
    id: "wannacry",
    name: "WannaCry Worm Outbreak",
    category: "Worm",
    log: `[ALERT] SMBv1 exploitation detected — CVE-2017-0144 (EternalBlue)
src=10.42.7.18 -> dst=10.42.7.0/24 port=445 payload=DoublePulsar shellcode
PROCESS: mssecsvc.exe spawned tasksche.exe
FS: t.wnry, b.wnry, s.wnry, taskdl.exe, taskse.exe dropped
NET: kill-switch domain query iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com -> NXDOMAIN
SPREAD: 217 hosts in 4 minutes via SMB lateral movement
SIGNATURE: WannaCry / WCry ransomworm (DPRK Lazarus attribution).`,
  },
  {
    id: "solarwinds",
    name: "SolarWinds Supply Chain (SUNBURST)",
    category: "Supply Chain",
    log: `[BUILD_INTEGRITY] SolarWinds.Orion.Core.BusinessLayer.dll modified — hash mismatch
Signed-by: Solarwinds Worldwide LLC (valid cert, post-compromise)
BACKDOOR: SUNBURST class OrionImprovementBusinessLayer
C2: avsvmcloud[.]com — DGA subdomain beacon every 12-14 days
LATERAL: ADFS token signing key extraction (Golden SAML)
POST-EX: TEARDROP loader -> Cobalt Strike Beacon
DWELL_TIME: 287 days
SIGNATURE: APT29 / NOBELIUM supply-chain implant.`,
  },
  {
    id: "s3leak",
    name: "AWS S3 Bucket Public Leak",
    category: "Cloud Misconfig",
    log: `[CLOUDTRAIL] PutBucketAcl bucket=prod-customer-pii actor=arn:aws:iam::449201::user/devops-ci
PolicyChange: Principal "*" granted s3:GetObject, s3:ListBucket
[GUARDDUTY] Finding: Policy:S3/BucketAnonymousAccessGranted severity=HIGH
[ACCESS_LOG] 14,221 anonymous GETs in 6h from 89 unique IPs
EXPOSED: 2.4M customer records (name, email, SSN-last4, address)
COMPLIANCE: GDPR Art.32 breach, SOC2 CC6.1 control failure.`,
  },
  {
    id: "mfa",
    name: "MFA Fatigue / Push Bombing",
    category: "Identity",
    log: `[AZURE_AD] User: jane.kapoor@corp principal_id=8c41...
03:02:11 MFA push #1 from 41.203.18.9 (Lagos, NG) — DENIED
03:02:14 MFA push #2 — DENIED
03:02:17 MFA push #3 — DENIED
... 47 push notifications in 6 minutes ...
03:08:42 MFA push #48 — APPROVED
03:09:01 Sign-in success — risky_ip=true impossible_travel=true
03:09:15 OAuth consent: "eM Client" granted Mail.ReadWrite, offline_access
03:11:02 Inbox rule created: move "*invoice*" -> RSS Feeds (hide)
SIGNATURE: 0ktapus / Scattered Spider TTP — MFA bombing + AiTM.`,
  },
];

export interface AgentState {
  id: string;
  name: string;
  role: string;
  status: "idle" | "scanning" | "alerting" | "responding" | "complete";
  progress: number;
  message: string;
}
