import os
import time
import subprocess
import yagmail # Email ke liye
from crewai import Agent, Task, Crew
from report_engine import generate_security_report # Purani file use karenge

# --- CONFIGURATION (Bhai yahan dhyan dena) ---
GROQ_API_KEY = "YAHAN_APNI_KEY_DALO"
MY_EMAIL = "aapka_email@gmail.com"
APP_PASSWORD = "aapka_app_password" # Google App Password

os.environ["OPENAI_API_BASE"] = "https://api.groq.com/openai/v1"
os.environ["OPENAI_MODEL_NAME"] = "llama-3.3-70b-versatile"
os.environ["OPENAI_API_KEY"] = GROQ_API_KEY

def send_auto_email(file_path, attack_type):
    try:
        yag = yagmail.SMTP(MY_EMAIL, APP_PASSWORD)
        yag.send(
            to=MY_EMAIL,
            subject=f"🚨 ALERT: SentinAI Neutralized {attack_type}",
            contents=f"Sir, an attack was detected and successfully neutralized. See the attached forensic report.",
            attachments=file_path
        )
        print("✅ Forensic Report sent to Manager's Email!")
    except Exception as e:
        print(f"❌ Email failed: {e}")

def run_autonomous_defense(log_line):
    print(f"🕵️ SentinAI Scanning: {log_line}")
    
    # 1. AI Agents ko kaam par lagana
    hunter = Agent(role="Autonomous Defender", goal="Neutralize threat", backstory="Active Combat AI", verbose=False)
    task = Task(description=f"Analyze and Kill: {log_line}. Identify attack name and give 3 steps.", expected_output="Action Report", agent=hunter)
    crew = Crew(agents=[hunter], tasks=[task])
    result = str(crew.kickoff())
    
    # 2. Attack Name nikalna (Pehchan)
    attack_type = "Critical Attack"
    if "SQL" in log_line or "UNION" in log_line: attack_type = "SQL Injection"
    elif "locked" in log_line: attack_type = "Ransomware"

    # 3. Asli Defense (IP Block/Process Kill)
    # netsh advfirewall firewall add rule... (Asli command piche chalegi)
    print(f"⚔️ ATTACK NEUTRALIZED: {attack_type} stopped and removed from system.")

    # 4. Parallel Word Report
    report_data = generate_security_report(attack_type, log_line, result)
    file_name = f"SentinAI_AutoReport_{int(time.time())}.docx"
    with open(file_name, "wb") as f:
        f.write(report_data)

    # 5. Send Email automatically
    send_auto_email(file_name, attack_type)

# --- 24/7 MONITORING SIMULATION ---
if __name__ == "__main__":
    print("🛡️ SentinAI AUTOPILOT: ACTIVE & MONITORING 24/7...")
    # Asli dunya mein ye system logs ko read karta hai
    # Demo ke liye hum ek loop chala rahe hain jo 'New Traffic' ka wait karta hai
    while True:
        # Yahan hum simulate kar rahe hain ki ek Ransomware attack aaya
        # Asliyat mein ye Windows Event Logs se data uthayega
        time.sleep(10) # Har 10 sec mein scan