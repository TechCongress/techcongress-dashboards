# TechCongress Fellows Dashboard

A Streamlit-based dashboard for managing and monitoring TechCongress fellow placements.

## Features

- **Fellow Management** — Add, edit, and view fellow profiles
- **Status Tracking** — Monitor Active, Flagged, and Ending Soon fellows
- **Check-in History** — Log and track all fellow check-ins over time
- **Filtering** — Filter by status, fellow type, party, chamber, and cohort
- **Secure Access** — Password-protected login

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/TechCongress/techcongress-dashboards.git
cd techcongress-dashboards
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure secrets
Create a `.streamlit/secrets.toml` file:
```toml
[airtable]
api_key = "your_airtable_api_key"
base_id = "your_base_id"
table_name = "Fellows"

[auth]
username = "your_username"
password = "your_password"
```

### 4. Run locally
```bash
streamlit run app.py
```

## Deployment

This app is deployed on [Streamlit Community Cloud](https://share.streamlit.io).

To deploy your own instance:
1. Push code to GitHub
2. Connect your repo on Streamlit Cloud
3. Add secrets in the Streamlit Cloud settings

## Airtable Setup

The dashboard connects to two Airtable tables:

**Fellows** — Name, Email, Phone Number, Fellow Type, Party, Office, Chamber, LinkedIn, Start Date, End Date, Cohort, Status, Last Check-in, Prior Role, Education, Notes

**Check-ins** — Fellow (linked), Date, Check-in Type, Notes, Staff Member
