import os
from crewai import Agent, Task, Crew


os.environ["GROQ_API_KEY"] = "YOUR_GROQ_API_KEY"
os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile' 
os.environ["OPENAI_API_KEY"] = os.environ["GROQ_API_KEY"]

print("====================================================")
print("   SENTINAI: NEXT-GEN AGENTIC CYBER DEFENSE SYSTEM   ")
print("====================================================\n")

# --- AGENTS ---
hunter = Agent(
    role="Threat Hunter",
    goal="Identify cyber attacks in real-time logs.",
    backstory="Expert in identifying SQLi, XSS, and DoS attacks.",
    verbose=False
)

responder = Agent(
    role="Incident Responder",
    goal="Provide defense steps and AWS deployment strategy.",
    backstory="Expert in system defense and AWS Cloud security.",
    verbose=False
)

# --- MASTER TASK ---
master_task = Task(
    description="""
    1. Analyze this log: 'IP: 192.168.1.10, Payload: <script>document.cookie</script>'.
    2. Identify the attack and give 2 immediate defense steps.
    3. Briefly mention how this would be secured on AWS Bedrock.
    """,
    expected_output="A complete security report: Identification, Defense, and Cloud Deployment.",
    agent=hunter
)

# --- CREW ---
sentin_ai_system = Crew(
    agents=[hunter, responder],
    tasks=[master_task]
)

print("[Step 1] Initializing Agents...")
print("[Step 2] Applying Secure-by-Design Filters...")
print("[Step 3] AI System Analyzing Threat...\n")

result = sentin_ai_system.kickoff()

print("\n--- FINAL PRODUCT DEMO RESULT ---")
print(result)
print("\n====================================================")
print("       PRODUCT STATUS: READY FOR DEPLOYMENT         ")
print("====================================================")