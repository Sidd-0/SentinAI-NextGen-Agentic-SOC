# SentinAI - ENTERPRISE GLOBAL PLAYBOOK DATABASE (v4.0)
# Aligned with NIST SP 800-61 & OWASP Standards

SECURITY_DOMAINS = [
    "IT Infrastructure", "Cloud Security", "Network Security", 
    "Application Security", "Endpoint Protection", 
    "Identity & Access mgmt.", "API Security"
]

ATTACK_SCENARIOS = {
    "Ransomware: LockBit 3.0": {
        "domain": "Endpoint Protection",
        "log": "[CRITICAL] mass_file_rename detected. Extension '.locked' applied. Shadow copies deleted.",
        "playbook": "[PHASE: CONTAINMENT] Automated VLAN isolation. [PHASE: ERADICATION] Force-kill PID of encrypt.exe."
    },
    "SQL Injection (OWASP A03)": {
        "domain": "Application Security",
        "log": "[WAF_LOG] UNION SELECT detected in /api/v1/auth. Data Exfiltration attempt.",
        "playbook": "[ACTION] Block Source IP. [ACTION] Rotate DB credentials. [COMPLIANCE] Map to GDPR Art. 32."
    },
    "Cloud S3 Data Leak": {
        "domain": "Cloud Security",
        "log": "[AWS_CLOUDTRAIL] Principal: '*' Action: s3:GetObject on bucket: 'finance-prod'.",
        "playbook": "[ACTION] Force Private Lockdown. [ACTION] Revoke IAM credentials. [COMPLIANCE] GDPR Art. 33."
    },
    "DDoS: TCP Syn Flood": {
        "domain": "Network Security",
        "log": "[NET_LOG] 250,000 PPS traffic spike on Port 443. CPU at 99%.",
        "playbook": "[NETWORK_SOP] Route traffic to Scrubbing Center. Apply Anycast Rate Limiting."
    }
}