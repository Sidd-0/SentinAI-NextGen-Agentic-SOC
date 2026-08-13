import os
from crewai import Agent, Task, Crew


os.environ["GROQ_API_KEY"] = "YOUR_GROQ_API_KEY"
PINECONE_API_KEY = "YOUR_PINECONE_API_KEY"


os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile' 
os.environ["OPENAI_API_KEY"] = os.environ["GROQ_API_KEY"]


database_expert = Agent(
    role="Vector Database Specialist",
    goal="Retrieve past cyber attack patterns from Pinecone cloud.",
    backstory=f"You are a master of Vector Databases. Using Pinecone Key: {PINECONE_API_KEY}, you can find hidden patterns in millions of logs.",
    verbose=True,
    allow_delegation=False
)


task = Task(
    description="Search the database for 'Advanced Persistent Threat (APT)' patterns and suggest a prevention strategy.",
    expected_output="A professional strategy based on past database records.",
    agent=database_expert
)

# --- CREW ---
crew = Crew(agents=[database_expert], tasks=[task])

print("\n--- DAY 6: AI CONNECTING TO PINECONE CLOUD MEMORY ---\n")
print(crew.kickoff())