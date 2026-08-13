import os
from crewai import Agent, Task, Crew

import os
from crewai import Agent, Task, Crew


my_key = "YOUR_GROQ_API_KEY"


os.environ["OPENAI_API_KEY"] = my_key
os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile'



# 1. Pehla Agent: The Hunter (Identify)
hunter = Agent(
    role="Cyber Threat Hunter",
    goal="Identify if there is a cyber attack in the logs.",
    backstory="You are a senior security expert at a top tech firm.",
    verbose=True,
    allow_delegation=False
)

# 2. Dusra Agent: The Analyst (Alert)
analyst = Agent(
    role="Security Analyst",
    goal="Create a clear and professional security alert message.",
    backstory="You explain complex cyber threats to the management team.",
    verbose=True,
    allow_delegation=False
)

# 3. Kaam (Tasks) dena
task1 = Task(
    description="Analyze this log: 'IP: 192.168.1.50, Action: Login_Attempt, Payload: <script>alert(1)</script>'. Is this an attack?",
    expected_output="Identify the attack type.",
    agent=hunter
)

task2 = Task(
    description="Based on the Hunter's finding, write a short alert message for the boss.",
    expected_output="A 2-line security alert message.",
    agent=analyst
)

# 4. Team banana
cyber_crew = Crew(
    agents=[hunter, analyst],
    tasks=[task1, task2]
)

print("\n--- AGENTS ARE STARTING TO WORK ---\n")


result = cyber_crew.kickoff()

print("\n--- FINAL REPORT ---")
print(result)