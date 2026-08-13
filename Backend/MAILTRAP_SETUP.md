# SentinAI SMTP Setup Guide (Mailtrap Integration)

## Overview
This guide walks you through setting up Mailtrap for email testing in SentinAI.

---

## Step 1: Sign Up for Mailtrap (Free)

1. Go to **https://mailtrap.io**
2. Click **Sign Up** and create a free account
3. Verify your email address
4. Log in to your Mailtrap dashboard

---

## Step 2: Create a Project

1. On the Mailtrap dashboard, click **+ Create Project**
2. Name it: **SentinAI Testing**
3. Click **Save**

---

## Step 3: Get Your SMTP Credentials

1. Click on your **SentinAI Testing** project
2. In the left sidebar, go to **Integrations > SMTP** (or just click the **SMTP** button)
3. You will see a box like this:

```
Host: smtp.mailtrap.io
Port: 2525 (or 465 for TLS)
Username: YOUR_USERNAME
Password: YOUR_PASSWORD
```

**Copy these values** — you'll need them for the `.env` file.

---

## Step 4: Update Your .env File

In `Backend/.env`, replace the placeholder values:

```env
SENDER_EMAIL=noreply@sentinai.io
SMTP_SERVER=smtp.mailtrap.io
SMTP_PORT=2525
SENDER_APP_PASSWORD=YOUR_MAILTRAP_USERNAME_HERE
SMTP_PASSWORD=YOUR_MAILTRAP_PASSWORD_HERE
GROQ_API_KEY=enter your groq key here 
```

**Important:**
- `SENDER_APP_PASSWORD` = Mailtrap **Username** (not your account email)
- `SMTP_PASSWORD` = Mailtrap **Password**
- `SENDER_EMAIL` = Any email address you want to appear as the sender (Mailtrap will override it, but set it anyway for logs)

---

## Step 5: Start the Backend

From `k:\sentinai\Backend`, run:

```powershell
python -m uvicorn sentinai_enterprise_backend:app --host 127.0.0.1 --port 8000 --reload
```

You should see:
```
[✓] SQLite Database initialized at sentinai_users.db
INFO: Uvicorn running on http://127.0.0.1:8000
```

---

## Step 6: Test Email Sending

### Option A: Using PowerShell

```powershell
$body = @{
    email = "test@example.com"
    subject = "SentinAI Test Email"
    body = "<p>This is a test email from SentinAI with Mailtrap.</p>"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/email-test' `
  -Method POST `
  -Body $body `
  -ContentType 'application/json'
```

Expected response:
```json
{
  "ok": true
}
```

### Option B: Using curl

```bash
curl -X POST http://127.0.0.1:8000/api/email-test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","subject":"Test","body":"<p>Test email</p>"}'
```

---

## Step 7: Check Mailtrap Inbox

1. Go back to your Mailtrap dashboard
2. Click on your **SentinAI Testing** project
3. Click the **Inbox** tab
4. You should see your test email in the list

---

## Testing the Full Signup Flow

1. Go to **http://localhost:8080** (frontend)
2. Click **Sign Up**
3. Fill in the form:
   - **Operator Name:** Your Name
   - **Email:** test-email@example.com
   - **Access Code:** YourPassword123
4. Click **Register**
5. Check your Mailtrap inbox for the welcome email

---

## Troubleshooting

### Email not appearing in Mailtrap?

1. **Check backend logs** for errors:
   ```
   [✓ EMAIL] Sent 'Welcome to SentinAI...' to test-email@example.com
   ```
   or
   ```
   [✗ EMAIL ERROR] Could not send email to test-email@example.com: ...
   ```

2. **Verify .env file** is in `Backend/` directory:
   ```powershell
   Test-Path 'K:\sentinai\Backend\.env'
   ```

3. **Check SMTP credentials** via the diagnostic endpoint:
   ```powershell
   Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/email-config' -Method GET | ConvertTo-Json -Depth 5
   ```
   Should show your SMTP server and port.

4. **Restart the backend** after updating `.env`:
   ```powershell
   # Kill the running uvicorn process
   # Then restart it
   ```

5. **Mailtrap credentials format:**
   - Username and Password should **NOT** contain `@` or quotes
   - Copy them exactly as shown in Mailtrap dashboard

---

## Moving to Production

When you're ready to go live:

1. **Use SendGrid, AWS SES, or another transactional email provider** instead of Mailtrap
2. **Update your `.env` file** with production SMTP credentials
3. **Use a proper domain email** (e.g., `noreply@yourdomain.com`) for `SENDER_EMAIL`
4. **Enable SPF and DKIM records** in your domain DNS for better deliverability

---

## Quick Reference

| Setting | Mailtrap Value | Production Value |
|---------|---|---|
| SMTP_SERVER | smtp.mailtrap.io | smtp.sendgrid.net (or your provider) |
| SMTP_PORT | 2525 | 587 or 465 |
| SENDER_EMAIL | noreply@sentinai.io | noreply@yourdomain.com |
| SENDER_APP_PASSWORD | Mailtrap Username | SendGrid API Username |
| SMTP_PASSWORD | Mailtrap Password | SendGrid API Password |

---

**Need help?** Check the Mailtrap docs: https://mailtrap.io/inboxes
