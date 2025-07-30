# Grafana Email Alerts Setup Guide

## 📧 SMTP Configuration Steps

### 1. **Edit grafana.ini file**
Open `./grafana/grafana.ini` and update these settings:

```ini
[smtp]
enabled = true
host = smtp.gmail.com:587
user = parthdhameliya229@gmail.com
password = Parth@1990
from_address = parthdhameliya229@gmail.com
from_name = Finance Tracker Alerts
```

### 2. **For Gmail Users:**
- Go to Google Account Settings
- Enable 2-Factor Authentication
- Generate App Password:
  - Go to Security → App passwords
  - Select "Mail" and "Other (Custom name)"
  - Use the generated 16-character password in grafana.ini

### 3. **For Other Email Providers:**
Replace SMTP settings accordingly:
- **Outlook/Hotmail:** `smtp-mail.outlook.com:587`
- **Yahoo:** `smtp.mail.yahoo.com:587`
- **Custom SMTP:** Use your provider's settings

### 4. **Restart Grafana:**
```bash
docker-compose down
docker-compose up -d
```

### 5. **Test Email Configuration:**
1. Go to http://localhost:3003
2. Login with admin/admin
3. Go to **Alerting** → **Contact Points**
4. Click on **grafana-default-email**
5. Click **Test** button
6. Check your email (including spam folder)

## 🚨 Setting Up Alerts

### Create Alert Rules:
1. Go to **Alerting** → **Alert Rules**
2. Click **New Rule**
3. Set conditions (e.g., high error rate, server down)
4. Configure notification policy
5. Test the alert

## 🔧 Troubleshooting

- **"SMTP not configured"**: Check grafana.ini is mounted correctly
- **"Authentication failed"**: Verify app password for Gmail
- **"Connection refused"**: Check SMTP host and port
- **No emails received**: Check spam folder and email settings

## 📝 Example Alert Conditions

- **High Error Rate:** `rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1`
- **Server Down:** `up == 0`
- **High Response Time:** `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1`