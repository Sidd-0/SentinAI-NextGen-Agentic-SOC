import streamlit as st
import os
import time
from crewai import Agent, Task, Crew
from playbook_data import SECURITY_DOMAINS, ATTACK_SCENARIOS
from report_generator import create_pro_report

# --- 1. UI SETTINGS (Futuristic SOC Look) ---
st.set_page_config(page_title="SentinAI | Global SOC", layout="wide", page_icon="🛡️")

st.markdown("""
    <style>
    .stApp { background-color: #05070a; color: white; }
    .login-box { background: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 20px; border: 2px solid #38bdf8; text-align: center; margin-top: 50px; }
    .report-card { background-color: #0f172a; padding: 25px; border-radius: 15px; border: 1px solid #38bdf8; color: #e0e0e0; }
    </style>
    """, unsafe_allow_html=True)

# --- 2. AUTHENTICATION LOGIC ---
if 'authenticated' not in st.session_state:
    st.session_state['authenticated'] = False

# --- PAGE 1: LOGIN SCREEN ---
def login_screen():
    col1, col2, col3 = st.columns([1, 1.5, 1])
    with col2:
        st.markdown("<div class='login-box'>", unsafe_allow_html=True)
        st.image("https://cdn-icons-png.flaticon.com/512/2092/2092663.png", width=100)
        st.title("🔐 CORE ACCESS")
        st.write("Enter credentials to access SentinAI SOC Hub")
        
        user_input = st.text_input("Operator ID", key="user_login")
        pass_input = st.text_input("Security Passphrase", type="password", key="pass_login")
        
        if st.button("AUTHENTICATE SYSTEM"):
            if user_input == "admin" and pass_input == "sentinai123":
                st.session_state['authenticated'] = True
                st.success("Identity Verified. Initializing Neural Core...")
                time.sleep(1)
                st.rerun()
            else:
                st.error("Access Denied: Biometric Mismatch")
        st.markdown("</div>", unsafe_allow_html=True)

# --- PAGE 2: MAIN DASHBOARD ---
def main_dashboard():
    with st.sidebar:
        st.title("🛡️ SentinAI v2.0")
        api_key = st.text_input("Neural Core Key (Groq)", type="password")
        st.divider()
        # REQUIREMENT 1: 7 Security Domains
        domain = st.selectbox("🎯 Target Domain", SECURITY_DOMAINS)
        # REQUIREMENT 2: Historical Scenarios (Ransomware, etc.)
        scenario_name = st.selectbox("📂 Historical Intelligence", ["Manual Feed"] + list(ATTACK_SCENARIOS.keys()))
        
        if st.button("TERMINATE SESSION"):
            st.session_state['authenticated'] = False
            st.rerun()

    st.title("🚀 Enterprise Cyber Command Hub")
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Live Threat Level", "HIGH", delta_color="inverse")
    m2.metric("Neural Agents", "3 Online")
    m3.metric("Uptime", "99.99%")
    m4.metric("AWS Sync", "Encrypted")
    st.divider()

    # Load Scenario Log if selected
    log_content = ATTACK_SCENARIOS[scenario_name]["log"] if scenario_name != "Manual Feed" else ""
    
    col_in, col_out = st.columns([1, 1.2])

    with col_in:
        st.subheader("📥 Incoming Telemetry")
        final_log = st.text_area(f"Real-time logs for {domain}:", value=log_content, height=280)
        trigger = st.button("⚡ INITIATE NEURAL MITIGATION")

    with col_out:
        st.subheader("🤖 Agent Reasoning Engine")
        if trigger:
            if not api_key:
                st.error("API Key Required!")
            elif not final_log:
                st.warning("Please provide log data.")
            else:
                # Backend Setup
                os.environ["OPENAI_API_BASE"] = "https://api.groq.com/openai/v1"
                os.environ["OPENAI_MODEL_NAME"] = "llama-3.3-70b-versatile"
                os.environ["OPENAI_API_KEY"] = api_key
                
                # REQUIREMENT 3: Playbook Integration
                playbook = ATTACK_SCENARIOS[scenario_name]["playbook"] if scenario_name != "Manual Feed" else "Standard SOC Playbook"

                with st.status(f"Executing {domain} Playbook...", expanded=True) as status:
                    agent = Agent(role=f"{domain} Lead", goal=f"Neutralize threat using: {playbook}", backstory="Senior SOC Architect", verbose=False)
                    task = Task(description=f"Analyze: {final_log}. Map to GDPR/SOC2.", expected_output="Security Report", agent=agent)
                    crew = Crew(agents=[agent], tasks=[task])
                    result = str(crew.kickoff())
                    status.update(label="Threat Isolated & Analysis Complete!", state="complete")

                st.markdown(f'<div class="report-card">{result}</div>', unsafe_allow_html=True)
                
                # REQUIREMENT 4: Parallel Word Document (Automated Task)
                word_file = create_pro_report(domain, scenario_name, result)
                st.download_button(
                    label="📥 DOWNLOAD PROFESSIONAL WORD REPORT",
                    data=word_file,
                    file_name=f"SentinAI_SOC_Report_{domain}.docx",
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                st.balloons()

# --- APP FLOW CONTROL ---
if st.session_state['authenticated']:
    main_dashboard()
else:
    login_screen()