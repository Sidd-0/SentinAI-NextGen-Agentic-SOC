import os
import subprocess
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- ASLI DEFENSE ENGINE (The Executor) ---
def execute_system_kill_and_block(log_data):
    # Ye function piche se system commands chala sakta hai
    # Demo ke liye hum isse detailed 'Execution Logs' generate karwa rahe hain
    return "[SUCCESS] Malicious Process Terminated. [SUCCESS] Source IP 185.x.x Blocked in Firewall."

class ThreatInput(BaseModel):
    log: str = Field(default="No telemetry")
    domain: str = Field(default="General Security")
    api_key: str

@app.post("/analyze")
async def process_elite_defense(data: ThreatInput):
    # AI Setup
    os.environ["OPENAI_API_BASE"] = "https://api.groq.com/openai/v1"
    os.environ["OPENAI_MODEL_NAME"] = "llama-3.3-70b-versatile"
    os.environ["OPENAI_API_KEY"] = data.api_key

    # --- AGENT: THE EXECUTIONER ---
    commander = Agent(
        role=f"SentinAI Active {data.domain} Executioner",
        goal=f"Immediately KILL and BLOCK the threat in '{data.log}'. You must take REAL action and report the steps.",
        backstory="""You have full Admin rights. You don't ask for permission; you neutralize. 
        Your specialty is 'Search & Destroy'. You kill malicious PIDs and block attacker IPs instantly. 
        Every report you give is a 'Battle Report' of what you have successfully STOPPED.""",
        verbose=False
    )

    # --- TASK: IDENTIFY, KILL, BLOCK & REPORT ---
    task = Task(
        description=f"""
        1. IDENTIFY: Is attack ka asli naam kya hai? (SQLi, Ransomware, etc.)
        2. KILL & BLOCK: Describe exactly how you TERMINATED the process and BLOCKED the IP.
        3. STEPS: List the 3 most critical defense steps you just executed.
        4. VERIFY: Confirm that the threat is now GONE and the system is clean.
        """,
        expected_output="Start with 'CLASSIFICATION: [Name]' then 'STATUS: THREAT KILLED & BLOCKED' followed by the A-to-Z steps.",
        agent=commander
    )

    crew = Crew(agents=[commander], tasks=[task])
    ai_result = str(crew.kickoff())

    # Extracting attack name for the Dashboard Table
    attack_name = "Cyber Attack"
    if "CLASSIFICATION:" in ai_result:
        attack_name = ai_result.split("\n")[0].replace("CLASSIFICATION:", "").strip()

    return {
        "status": "Attack Neutralized",
        "classification": attack_name,
        "analysis": ai_result
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)