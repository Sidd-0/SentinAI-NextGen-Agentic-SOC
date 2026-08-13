import os
from crewai import Agent, Task, Crew

os.environ["GROQ_API_KEY"] = "YOUR_GROQ_API_KEY"

# Settings (Llama 3.3 model)
os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile' 
os.environ["OPENAI_API_KEY"] = os.environ["GROQ_API_KEY"]

# --- AGENT: AWS Expert ---

aws_architect = Agent(
    role="AWS Cloud Security Architect",
    goal="Design a 5-step deployment plan to move our Cyber AI to AWS Cloud.",
    backstory="You are an expert in Amazon Web Services (AWS). You know how to integrate Agentic AI with AWS Bedrock and SageMaker.",
    verbose=True,
    allow_delegation=False
)

# --- TASK: Cloud Planning ---
task_cloud = Task(
    description="Explain how to host this Agentic AI project on AWS Cloud using Bedrock and Pinecone in 5 simple steps.",
    expected_output="A professional 5-step roadmap for AWS Cloud deployment for a cyber security product.",
    agent=aws_architect
)

# --- THE CREW ---
cloud_crew = Crew(
    agents=[aws_architect],
    tasks=[task_cloud]
)

print("\n--- DAY 7: PLANNING AWS CLOUD INTEGRATION ---\n")
result = cloud_crew.kickoff()

print("\n--- FINAL AWS DEPLOYMENT ROADMAP ---")
print(result)