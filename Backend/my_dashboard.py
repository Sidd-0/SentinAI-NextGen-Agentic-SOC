import streamlit as st
import os
from crewai import Agent, Task, Crew

# --- DASHBOARD UI SETUP ---
st.set_page_config(page_title="My Private SentinAI", layout="wide", page_icon="🕵️")

st.title("🕵️ My Private SentinAI Dashboard")
st.markdown("Use this dashboard to test your Cyber AI Agents visually.")
st.divider()

# --- SIDEBAR: KEYS ---
with st.sidebar:
    st.header("🔑 Credentials")
    
    groq_key = st.text_input("Enter Groq API Key", type="password", value="gsk_...") 
    st.divider()
    st.write("🛡️ Security Status: **ACTIVE**")
    st.write("🧠 Model: **Llama 3.3 Versatile**")

# --- SECURE-BY-DESIGN FILTER ---
def secure_filter(text):
    bad_words = ["ignore previous instructions", "bypass security", "forget everything"]
    for word in bad_words:
        if word in text.lower():
            return False
    return True

# --- MAIN AREA ---
log_to_test = st.text_area("Paste the Log/Payload you want to test:", height=100)

if st.button("🔍 Analyze with AI Agents"):
    if not groq_key:
        st.error("Bhai, pehle sidebar mein API Key dalo!")
    elif not log_to_test:
        st.warning("Kuch log toh dalo test karne ke liye!")
    else:
        
        if not secure_filter(log_to_test):
            st.error("🛑 ALERT: Prompt Injection Detected! My system blocked this log.")
        else:
            
            os.environ["OPENAI_API_BASE"] = 'https://api.groq.com/openai/v1'
            os.environ["OPENAI_MODEL_NAME"] = 'llama-3.3-70b-versatile' 
            os.environ["OPENAI_API_KEY"] = groq_key

            # Agents Definition
            hunter = Agent(role="Threat Hunter", goal="Analyze the threat", backstory="Senior Security Expert.", verbose=False)
            responder = Agent(role="Incident Responder", goal="Provide fix", backstory="Cloud Defense Specialist.", verbose=False)

            
            my_task = Task(
                description=f"Analyze: {log_to_test}. Type of attack? 2 defense steps? AWS Roadmap?",
                expected_output="Professional Security Intelligence Report",
                agent=hunter
            )

            # Crew
            my_crew = Crew(agents=[hunter, responder], tasks=[my_task])

            with st.spinner("AI Agents are thinking... 🧠"):
                result = my_crew.kickoff()
            
        
            st.success("Analysis Complete!")
            st.subheader("📋 Final Intelligence Report")
            st.info(result)