import os
from crewai import Agent, Task, Crew


GROQ_API_KEY = "YOUR_GROQ_API_KEY"
os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile' 
os.environ["OPENAI_API_KEY"] = GROQ_API_KEY

# 1. RAG Concept: Knowledge Base Read karna
with open("security_policy.txt", "r") as file:
    company_policy = file.read()

# --- AGENT ---
# Is agent ke paas ab humari company ki memory hai
smart_hunter = Agent(
    role="Policy-Aware Threat Hunter",
    goal="Identify threats based on company security rules.",
    backstory=f"You are a security expert who follows these rules: {company_policy}",
    verbose=True,
    allow_delegation=False
)

# --- TASK ---
task = Task(
    description="Check this log: 'IP: 10.0.0.9, Action: Injection attempt'. What should you do according to RULE 1?",
    expected_output="Identify the attack and tell the specific action mentioned in RULE 1.",
    agent=smart_hunter
)

# --- CREW ---
crew = Crew(agents=[smart_hunter], tasks=[task])

print("\n--- DAY 5: AI IS LOOKING INTO MEMORY (RAG CONCEPT) ---\n")
print(crew.kickoff())