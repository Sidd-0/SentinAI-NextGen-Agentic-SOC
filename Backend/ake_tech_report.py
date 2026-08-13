import pandas as pd

data = {
    "Category": ["Cognitive Engine", "Orchestration", "Backend Engine", "Database", "Memory Layer", "Governance", "Playbooks", "Infrastructure", "Reporting", "Frontend"],
    "Project Component": ["Core Brain (LLM)", "Multi-Agent Framework", "API Gateway & Bridge", "Identity & Forensic DB", "Threat Intelligence", "Security Layer", "Response Logic", "Cloud Readiness", "Automated Docs", "SOC Dashboard"],
    "Tools & Technologies": ["Groq Cloud API", "CrewAI & LangChain", "Python 3.12 / FastAPI", "SQLite", "Pinecone Vector DB", "Python Sanitization", "playbook_data.py", "AWS Stacks", "python-docx", "React.js / Node.js"],
    "Specific Model / Standard": ["Meta Llama 3.3 (70B)", "Agentic Workflow", "RESTful Architecture", "SHA-256 Hashing", "RAG (Retrieval Augmented Gen)", "Secure-by-Design", "NIST SP 800-61 / OWASP", "AWS Bedrock / SageMaker", "Forensic Template v2.0", "Glassmorphism UI/UX"],
    "Implementation Purpose": ["High-speed reasoning", "Managing Agent collaboration", "Connecting UI to AI Core", "Persistent Operator storage", "Long-term threat memory", "Filtering Prompt Injection", "Standardized SOPs", "Enterprise scaling", "Professional Word/PDF reports", "3D visual monitoring"]
}

df = pd.DataFrame(data)
file_name = "SentinAI_Technical_Architecture.xlsx"
df.to_excel(file_name, index=False)
print(f"✅ Done! Excel file '{file_name}' aapke folder mein ban gayi hai.")