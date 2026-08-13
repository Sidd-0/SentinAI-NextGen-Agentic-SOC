import os
from crewai import Agent, Task, Crew


GROQ_API_KEY = "YOUR_GROQ_API_KEY"


os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile' 
os.environ["OPENAI_API_KEY"] = GROQ_API_KEY

# --- AGENTS ---

hunter = Agent(
    role="Threat Hunter",
    goal="Identify the type of cyber attack in logs.",
    backstory="Expert detective in finding hacker footprints.",
    verbose=True,
    allow_delegation=False
)

analyst = Agent(
    role="Security Analyst",
    goal="Analyze the impact of the detected attack.",
    backstory="Professional who explains how dangerous an attack is.",
    verbose=True,
    allow_delegation=False
)

# NAYA AGENT: Jo attack ko rokne ka tarika batayega
responder = Agent(
    role="Incident Responder",
    goal="Provide 3 immediate steps to block the attack and defend the system.",
    backstory="A fast-acting security engineer who knows how to stop hackers instantly.",
    verbose=True,
    allow_delegation=False
)



task1 = Task(
    description="Check this log: 'IP: 172.16.0.5, Action: Massive_Login_Attempts, Status: 500 requests per second'.",
    expected_output="Identify the type of attack.",
    agent=hunter
)

task2 = Task(
    description="Explain why this attack is dangerous for our server.",
    expected_output="Impact analysis of the attack.",
    agent=analyst
)


task3 = Task(
    description="Based on the attack found, give 3 technical steps to block this IP and stop the attack.",
    expected_output="3 clear action points to defend the system.",
    agent=responder
)

# --- THE TEAM (CREW) ---
cyber_crew = Crew(
    agents=[hunter, analyst, responder],
    tasks=[task1, task2, task3]
)

print("\n--- DAY 3: FULL DEFENSE TEAM STARTING ---\n")
result = cyber_crew.kickoff()

print("\n--- FINAL DEFENSE PLAN ---")
print(result)