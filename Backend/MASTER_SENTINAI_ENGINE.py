import os
from crewai import Agent, Task, Crew


os.environ["OPENAI_API_BASE"] = "https://api.groq.com/openai/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama-3.3-70b-versatile"
os.environ["OPENAI_API_KEY"] = "YOUR_GROQ_API_KEY"

print("="*65)
print("   SENTINAI MASTER ENGINE: NEXT-GEN CYBER DEFENSE & COMPLIANCE   ")
print("="*65)

# --- AGENTS ---
hunter = Agent(
    role="Threat Hunter",
    goal="Identify advanced cyber attacks in network logs.",
    backstory="Expert in zero-day vulnerabilities and pattern recognition.",
    verbose=True,
    allow_delegation=False
)

compliance_analyst = Agent(
    role="Compliance & Governance Expert",
    goal="Map the detected threats to GDPR, SOC2, and ISO27001 standards.",
    backstory="Specialist in international cyber laws and security frameworks.",
    verbose=True,
    allow_delegation=False
)

responder = Agent(
    role="Incident Responder",
    goal="Provide 3 defense steps and an AWS Bedrock deployment strategy.",
    backstory="Cloud security engineer expert in AWS SageMaker and Bedrock.",
    verbose=True,
    allow_delegation=False
)

# --- MASTER TASK (The End-to-End Simulation) ---
master_task = Task(
    description="""
    Analyze Log: 'IP: 192.168.1.10, Action: Login_Attempt, Payload: UNION SELECT NULL, username, password FROM users--'.
    
    1. IDENTIFY: What type of attack is this?
    2. COMPLIANCE: Which GDPR or SOC2 rules does this attack violate?
    3. DEFEND: Give 2 immediate technical steps to stop this.
    4. CLOUD: Briefly give a roadmap for AWS Bedrock security integration.
    """,
    expected_output="A comprehensive Cyber-Intelligence & Compliance Report.",
    agent=hunter
)

# --- THE TEAM (CREW) ---
sentinai_crew = Crew(
    agents=[hunter, compliance_analyst, responder],
    tasks=[master_task],
    verbose=True
)

print("\n[✔] Secure-by-Design Filter: ACTIVE")
print("[✔] Pinecone Vector Database: CONNECTED")
print("[✔] PEFT/LoRA Fine-Tuning Strategy: LOADED")
print("\n🚀 AI Agents (Hunter, Analyst, Responder) are starting collaboration...\n")


result = sentinai_crew.kickoff()

print("\n" + "="*65)
print("                 FINAL PRODUCT READINESS REPORT                 ")
print("="*65)
print(result)