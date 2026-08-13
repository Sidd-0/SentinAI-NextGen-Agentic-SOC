# SentinAI - Compliance & Governance Module
# Purpose: Mapping detected threats to International Standards (SOC2/GDPR/ISO27001)

def get_compliance_mapping(attack_type):
    mapping = {
        "SQL Injection": "Violation: GDPR Article 32 (Security of Processing), SOC2 (Privacy & Security Criteria)",
        "XSS Attack": "Violation: ISO 27001 (Control A.12.6.1), SOC2 (Confidentiality)",
        "Brute Force": "Violation: SOC2 (Access Control), NIST Framework (Detection & Protection)"
    }
    return mapping.get(attack_type, "Standard Security Protocol Violation")

print("--- Compliance Mapping Engine Loaded ---")
# Example check
print(f"SQL Injection Mapping: {get_compliance_mapping('SQL Injection')}")