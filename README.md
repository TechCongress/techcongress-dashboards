# TechCongress Fellows Dashboard

A Streamlit-based dashboard for managing and monitoring TechCongress fellow placements.

## Features

- **Fellow Management** — Add, edit, and view fellow profiles with a modal popup interface
- **Status Tracking** — Monitor Active, Flagged, and Ending Soon fellows
- **Check-in History** — Log and track all fellow check-ins over time
- **Monthly Status Reports** — Track monthly report submissions with streak tracking and incentives
- **Filtering & Sorting** — Filter by status, fellow type, party, chamber, and cohort; sort by various criteria
- **Secure Access** — Password-protected login

## Monthly Status Reports

The dashboard includes a monthly status report tracking system for fellows who require regular check-ins:

**Report Schedule:**
- Jan 2025 extended fellows: Reports start Feb 2026, due on the last day of each month
- Jan 2026 cohort: Reports start Mar 2026, due on the last day of each month
- Congressional Innovation Fellows (CIF): Reports through Sep 2026
- Senior Congressional Innovation Fellows: Reports through Nov 2026
- Manual override available via "Report End Month" field

**Incentives & Consequences:**
- 🔥 **Streak Tracking** — Consecutive submissions are tracked
- 🎁 **Gift Card** — 3 reports in a row earns a $50 gift card
- ⚠️ **At Risk** — 1 missed report triggers a warning
- 🚫 **Reimbursements Paused** — 2+ missed reports pauses reimbursements

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

The dashboard connects to three Airtable tables:

### Fellows Table
| Field | Type | Description |
|-------|------|-------------|
| Name | Single line text | Fellow's full name |
| Email | Email | Contact email |
| Phone Number | Phone | Contact phone |
| Fellow Type | Single select | "Congressional Innovation Fellow" or "Senior Congressional Innovation Fellow" |
| Party | Single select | Democrat, Republican, or Independent |
| Office | Single line text | Placement office (e.g., "Sen. Maria Cantwell (D-WA)") |
| Chamber | Single select | Senate or House |
| LinkedIn | URL | LinkedIn profile link |
| Start Date | Date | Fellowship start date |
| End Date | Date | Fellowship end date |
| Cohort | Single line text | Cohort year (e.g., "2025") |
| Status | Single select | Active, Flagged, or Ending Soon |
| Last Check-in | Date | Most recent check-in date |
| Prior Role | Single line text | Previous job/role |
| Education | Single line text | Educational background |
| Notes | Long text | Additional notes |
| Requires Monthly Reports | Checkbox | Whether fellow must submit monthly reports |
| Report Start Date | Date | When monthly reports begin |
| Report End Month | Single select | Override for when reports end (Feb 2026 - Dec 2026) |

### Check-ins Table
| Field | Type | Description |
|-------|------|-------------|
| Fellow | Link to Fellows | Linked fellow record |
| Date | Date | Check-in date |
| Check-in Type | Single select | Email, Phone, Zoom, In-person, Slack, or Text |
| Notes | Long text | Check-in notes |
| Staff Member | Single line text | Staff member who conducted check-in |

### Status Reports Table
| Field | Type | Description |
|-------|------|-------------|
| Fellow | Link to Fellows | Linked fellow record |
| Month | Single select | Report month (e.g., "Feb 2026", "Mar 2026") |
| Submitted | Checkbox | Whether report was submitted |
| Date Submitted | Date | Submission date |
| Notes | Long text | Additional notes |

## UI Overview

- **Dashboard View** — Card-based grid showing all fellows with key info and status badges
- **Modal Popup** — Click "View" to open a detailed modal with contact info, placement details, check-in history, and status reports
- **Filters** — Filter by search term, status, fellow type, party, chamber, and cohort
- **Sorting** — Sort by priority, name, last check-in, end date, or cohort
