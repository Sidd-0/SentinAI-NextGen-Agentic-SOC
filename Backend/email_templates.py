"""
Professional Email Templates for SentinAI
Dark Theme (#05070a) + Cyan Accents (#00f2fe)
Enterprise-Grade HTML Templates
"""

# Color Palette
DARK_BG = "#05070a"
CYAN_ACCENT = "#00f2fe"
WHITE_TEXT = "#ffffff"
LIGHT_GRAY = "#e0e0e0"
ORANGE_ACCENT = "#ff6b35"


def email_footer():
    """Professional email footer with branding."""
    return f"""
    <div style="text-align: center; padding-top: 30px; border-top: 1px solid {CYAN_ACCENT}; margin-top: 40px;">
        <p style="font-size: 12px; color: {LIGHT_GRAY}; margin: 10px 0;">
            Secured by <strong>SentinAI Agentic Engine</strong> | Powered by <strong>Llama 3.3</strong>
        </p>
        <p style="font-size: 11px; color: #888888; margin: 5px 0;">
            © 2026 SentinAI. All rights reserved. | Enterprise Security Intelligence
        </p>
    </div>
    """


def email_template_welcome(name: str, email: str) -> str:
    """Welcome Email - Amazon/Flipkart Style Dark Theme."""
    return f"""
    <html>
      <head>
        <style>
          body {{ font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #0d0f14; }}
          .container {{ max-width: 650px; margin: 0 auto; background-color: {DARK_BG}; border: 1px solid {CYAN_ACCENT}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 242, 254, 0.1); }}
          .header {{ background: linear-gradient(135deg, {DARK_BG}, #0f1419); padding: 40px 30px; text-align: center; border-bottom: 2px solid {CYAN_ACCENT}; }}
          .header h1 {{ color: {CYAN_ACCENT}; font-size: 32px; margin: 0; font-weight: 700; text-shadow: 0 0 20px rgba(0, 242, 254, 0.3); }}
          .header p {{ color: {LIGHT_GRAY}; margin: 8px 0 0 0; font-size: 14px; }}
          .content {{ padding: 40px 30px; }}
          .content p {{ color: {LIGHT_GRAY}; line-height: 1.7; margin: 15px 0; font-size: 14px; }}
          .highlight {{ background-color: rgba(0, 242, 254, 0.05); border-left: 4px solid {CYAN_ACCENT}; padding: 20px; border-radius: 4px; margin: 20px 0; }}
          .highlight code {{ background-color: rgba(0, 242, 254, 0.1); color: {CYAN_ACCENT}; padding: 4px 8px; border-radius: 3px; font-family: 'Courier New', monospace; }}
          .cta-button {{ display: inline-block; background-color: {CYAN_ACCENT}; color: {DARK_BG}; padding: 16px 40px; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: 700; font-size: 16px; text-align: center; }}
          .cta-button:hover {{ background-color: #00e8f5; box-shadow: 0 0 20px rgba(0, 242, 254, 0.5); }}
          .info-box {{ background-color: rgba(0, 242, 254, 0.02); border: 1px solid {CYAN_ACCENT}; padding: 15px; border-radius: 4px; margin: 15px 0; }}
          .info-box strong {{ color: {CYAN_ACCENT}; }}
          .badge {{ display: inline-block; background-color: {CYAN_ACCENT}; color: {DARK_BG}; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-right: 8px; }}
          ul {{ color: {LIGHT_GRAY}; padding-left: 20px; }}
          li {{ margin: 8px 0; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to SentinAI Elite</h1>
            <p>Autonomous Forensic Intelligence Platform</p>
          </div>
          
          <div class="content">
            <p>Hi <strong style="color: {CYAN_ACCENT};">{name}</strong>,</p>
            
            <p>Welcome aboard! Your <strong>SentinAI Elite</strong> account has been successfully created. You now have access to enterprise-grade threat detection, forensic analysis, and autonomous security response capabilities.</p>
            
            <div class="highlight">
              <p><strong>Your Account Status:</strong></p>
              <p style="margin: 5px 0;"><span class="badge">ACTIVE</span> Email: <code>{email}</code></p>
              <p style="margin: 5px 0; font-size: 12px; color: #999;">Keep your access code secure. Never share it with unauthorized personnel.</p>
            </div>
            
            <p><strong>Get Started in 3 Steps:</strong></p>
            <ul>
              <li>🔐 Log in to the SentinAI Command Center</li>
              <li>⚙️ Configure your security policies and response playbooks</li>
              <li>📊 Monitor threats and deploy countermeasures in real-time</li>
            </ul>
            
            <center>
              <a href="http://localhost:8080" class="cta-button">Get Started Now →</a>
            </center>
            
            <div class="info-box">
              <p><strong>🔒 Security Notice:</strong> If you did not create this account or have concerns about unauthorized access, immediately contact our security team.</p>
            </div>
          </div>
          
          {email_footer()}
        </div>
      </body>
    </html>
    """


def email_template_login_alert(name: str, email: str, timestamp: str, ip_address: str = "N/A") -> str:
    """Login Alert - Security Notification."""
    return f"""
    <html>
      <head>
        <style>
          body {{ font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #0d0f14; }}
          .container {{ max-width: 650px; margin: 0 auto; background-color: {DARK_BG}; border: 1px solid {CYAN_ACCENT}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 242, 254, 0.1); }}
          .alert-header {{ background: linear-gradient(135deg, {ORANGE_ACCENT}, #f7931e); padding: 30px; text-align: center; border-bottom: 2px solid {CYAN_ACCENT}; }}
          .alert-header h1 {{ color: {WHITE_TEXT}; font-size: 28px; margin: 0; font-weight: 700; }}
          .content {{ padding: 40px 30px; }}
          .content p {{ color: {LIGHT_GRAY}; line-height: 1.7; margin: 15px 0; font-size: 14px; }}
          .details-box {{ background-color: rgba(255, 107, 53, 0.05); border-left: 4px solid {ORANGE_ACCENT}; padding: 20px; border-radius: 4px; margin: 20px 0; }}
          .details-box div {{ margin: 10px 0; display: flex; justify-content: space-between; }}
          .details-box strong {{ color: {CYAN_ACCENT}; }}
          .time-badge {{ background-color: {ORANGE_ACCENT}; color: {WHITE_TEXT}; padding: 8px 16px; border-radius: 4px; font-weight: 700; font-size: 12px; }}
          .action-box {{ background-color: rgba(0, 242, 254, 0.02); border: 1px solid {CYAN_ACCENT}; padding: 20px; border-radius: 4px; margin: 20px 0; }}
          .action-button {{ display: inline-block; background-color: {ORANGE_ACCENT}; color: {WHITE_TEXT}; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 10px; font-weight: 700; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert-header">
            <h1>⚠️ New Login Detected</h1>
          </div>
          
          <div class="content">
            <p>Hi <strong>{name}</strong>,</p>
            
            <p>A new login to your <strong>SentinAI Elite</strong> account was detected. Review the details below to confirm this was you.</p>
            
            <div class="details-box">
              <div><strong>Account:</strong> <span>{email}</span></div>
              <div><strong>Login Time:</strong> <span class="time-badge">{timestamp}</span></div>
              <div><strong>IP Address:</strong> <span>{ip_address}</span></div>
              <div><strong>Device:</strong> <span>Web Browser</span></div>
            </div>
            
            <p><strong>Was this you?</strong></p>
            <p>If you recognize this login, you can safely ignore this message. If you do NOT recognize this activity, take immediate action:</p>
            
            <div class="action-box">
              <p><strong>Suspicious Activity Detected?</strong></p>
              <a href="http://localhost:8080" class="action-button">Change Your Password Now</a>
              <p style="font-size: 12px; color: #999; margin-top: 10px;">Or contact our security team immediately.</p>
            </div>
          </div>
          
          {email_footer()}
        </div>
      </body>
    </html>
    """


def email_template_password_reset(name: str, reset_link: str) -> str:
    """Password Reset - Flipkart-Style UI."""
    return f"""
    <html>
      <head>
        <style>
          body {{ font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #0d0f14; }}
          .container {{ max-width: 650px; margin: 0 auto; background-color: {DARK_BG}; border: 1px solid {CYAN_ACCENT}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 242, 254, 0.1); }}
          .header {{ background: linear-gradient(135deg, {DARK_BG}, #0f1419); padding: 40px 30px; text-align: center; border-bottom: 2px solid {CYAN_ACCENT}; }}
          .header h1 {{ color: {CYAN_ACCENT}; font-size: 32px; margin: 0; font-weight: 700; text-shadow: 0 0 20px rgba(0, 242, 254, 0.3); }}
          .header p {{ color: {LIGHT_GRAY}; margin: 8px 0 0 0; font-size: 14px; }}
          .content {{ padding: 40px 30px; text-align: center; }}
          .content p {{ color: {LIGHT_GRAY}; line-height: 1.7; margin: 15px 0; font-size: 14px; text-align: left; }}
          .warning-box {{ background-color: rgba(255, 193, 7, 0.05); border: 1px solid #ffc107; padding: 20px; border-radius: 6px; margin: 20px 0; }}
          .warning-box p {{ color: #ffc107; font-size: 13px; margin: 5px 0; text-align: center; }}
          .cta-button {{ display: inline-block; background-color: {CYAN_ACCENT}; color: {DARK_BG}; padding: 18px 50px; text-decoration: none; border-radius: 8px; margin: 30px 0; font-weight: 700; font-size: 16px; }}
          .cta-button:hover {{ background-color: #00e8f5; box-shadow: 0 0 30px rgba(0, 242, 254, 0.6); }}
          .timer {{ background-color: rgba(0, 242, 254, 0.05); border-left: 4px solid {CYAN_ACCENT}; padding: 15px; border-radius: 4px; margin: 20px 0; }}
          .timer strong {{ color: {ORANGE_ACCENT}; }}
          .timer p {{ margin: 5px 0; font-size: 13px; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Reset Your Password</h1>
            <p>SentinAI Security Action Required</p>
          </div>
          
          <div class="content">
            <p>Hi <strong style="color: {CYAN_ACCENT};">{name}</strong>,</p>
            
            <p>You requested a password reset for your <strong>SentinAI Elite</strong> account. Click the button below to create a new, secure access code.</p>
            
            <a href="{reset_link}" class="cta-button">Reset Your Password →</a>
            
            <div class="timer">
              <p><strong>⏱️ This link expires in 1 hour</strong></p>
              <p>For your security, this reset link is only valid for 60 minutes. If you don't use it by then, you'll need to request a new reset.</p>
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid {CYAN_ACCENT};">
              <strong>Didn't request this?</strong><br>
              If you did not initiate this password reset, ignore this email and your account remains secure. Your password has not been changed.
            </p>
            
            <div class="warning-box">
              <p>🔒 Never share this link or your password with anyone, including SentinAI staff.</p>
            </div>
          </div>
          
          {email_footer()}
        </div>
      </body>
    </html>
    """


def email_template_threat_alert(threat_type: str, details: str, action_taken: str, admin_name: str = "Admin") -> str:
    """Threat Mitigation Alert - Forensic Combat Alert for Admin."""
    from datetime import datetime
    
    return f"""
    <html>
      <head>
        <style>
          body {{ font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #0d0f14; }}
          .container {{ max-width: 700px; margin: 0 auto; background-color: {DARK_BG}; border: 1px solid #ff0000; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(255, 0, 0, 0.2); }}
          .alert-header {{ background: linear-gradient(135deg, #ff0000, #8b0000); padding: 30px; text-align: center; border-bottom: 2px solid {ORANGE_ACCENT}; }}
          .alert-header h1 {{ color: {WHITE_TEXT}; font-size: 32px; margin: 0; font-weight: 700; text-transform: uppercase; }}
          .content {{ padding: 40px 30px; }}
          .content p {{ color: {LIGHT_GRAY}; line-height: 1.7; margin: 15px 0; font-size: 14px; }}
          .threat-box {{ background-color: rgba(255, 0, 0, 0.08); border: 2px solid #ff0000; padding: 20px; border-radius: 6px; margin: 20px 0; }}
          .threat-box h2 {{ color: {ORANGE_ACCENT}; margin: 0 0 10px 0; font-size: 18px; }}
          .threat-box div {{ margin: 10px 0; padding: 10px; background-color: rgba(0, 0, 0, 0.3); border-left: 3px solid {CYAN_ACCENT}; }}
          .threat-box strong {{ color: {CYAN_ACCENT}; }}
          .action-box {{ background-color: rgba(0, 242, 254, 0.05); border: 2px solid {CYAN_ACCENT}; padding: 20px; border-radius: 6px; margin: 20px 0; }}
          .action-box h3 {{ color: {CYAN_ACCENT}; margin: 0 0 10px 0; }}
          .action-box p {{ color: {LIGHT_GRAY}; margin: 8px 0; }}
          .status-badge {{ display: inline-block; background-color: #00b500; color: {WHITE_TEXT}; padding: 8px 16px; border-radius: 4px; font-weight: 700; font-size: 12px; }}
          ul {{ color: {LIGHT_GRAY}; padding-left: 20px; }}
          li {{ margin: 8px 0; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert-header">
            <h1>🛡️ Forensic Combat Alert</h1>
          </div>
          
          <div class="content">
            <p>Hi <strong>{admin_name}</strong>,</p>
            
            <p><strong style="color: #ff0000;">A critical security threat has been detected and autonomous mitigation measures have been deployed.</strong></p>
            
            <div class="threat-box">
              <h2>📊 Threat Classification</h2>
              <div><strong>Type:</strong> {threat_type}</div>
              <div><strong>Detection Time:</strong> {datetime.now().isoformat()}</div>
              <div><strong>Status:</strong> <span class="status-badge">NEUTRALIZED</span></div>
            </div>
            
            <div class="threat-box">
              <h2>🔍 Threat Details</h2>
              <div>{details}</div>
            </div>
            
            <div class="action-box">
              <h3>✅ Mitigation Actions Performed</h3>
              <p>{action_taken}</p>
            </div>
            
            <p><strong>Recommended Actions:</strong></p>
            <ul>
              <li>Review forensic analysis and incident timeline</li>
              <li>Validate all user sessions and authentication logs</li>
              <li>Cross-check with external threat intelligence</li>
              <li>Update security policies based on findings</li>
            </ul>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid {CYAN_ACCENT}; font-size: 12px; color: #999;">
              This is an automated alert from the <strong>SentinAI Forensic Engine</strong>. All threat analysis and mitigation actions are logged in your security dashboard.
            </p>
          </div>
          
          {email_footer()}
        </div>
      </body>
    </html>
    """
