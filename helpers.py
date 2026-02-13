import streamlit as st
import requests
from datetime import datetime, timedelta

# ============ AIRTABLE CONFIG ============
AIRTABLE_API_KEY = st.secrets["airtable"]["api_key"]
AIRTABLE_BASE_ID = st.secrets["airtable"]["base_id"]
AIRTABLE_TABLE_NAME = st.secrets["airtable"]["table_name"]
CHECKINS_TABLE_NAME = "Check-ins"
STATUS_REPORTS_TABLE_NAME = "Status Reports"
ALUMNI_TABLE_NAME = "Alumni"
GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1cUr9l0mmdXkGqy0grAbR4GieNES5-hnRQiNkjnFg19U/edit?usp=sharing"

# ============ HELPER FUNCTIONS ============

def fetch_fellows():
    """Fetch all fellows from Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        st.error(f"Failed to fetch data: {response.status_code}")
        return []

    data = response.json()
    fellows = []

    for record in data.get("records", []):
        fields = record.get("fields", {})
        fellows.append({
            "id": record["id"],
            "name": fields.get("Name", ""),
            "email": fields.get("Email", ""),
            "phone": fields.get("Phone Number", ""),
            "fellow_type": fields.get("Fellow Type", ""),
            "party": fields.get("Party", ""),
            "office": fields.get("Office", ""),
            "chamber": fields.get("Chamber", ""),
            "linkedin": fields.get("LinkedIn", ""),
            "start_date": fields.get("Start Date", ""),
            "end_date": fields.get("End Date", ""),
            "cohort": fields.get("Cohort", ""),
            "status": fields.get("Status", "Active"),
            "last_check_in": fields.get("Last Check-in", ""),
            "prior_role": fields.get("Prior Role", ""),
            "education": fields.get("Education", ""),
            "notes": fields.get("Notes", ""),
            "requires_monthly_reports": fields.get("Requires Monthly Reports", False),
            "report_start_date": fields.get("Report Start Date", ""),
            "report_end_month": fields.get("Report End Month", "")
        })

    return fellows


def create_fellow(fellow_data):
    """Create a new fellow in Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {
        "Name": fellow_data.get("name"),
        "Email": fellow_data.get("email"),
        "Phone Number": fellow_data.get("phone"),
        "Fellow Type": fellow_data.get("fellow_type"),
        "Party": fellow_data.get("party"),
        "Office": fellow_data.get("office"),
        "Chamber": fellow_data.get("chamber"),
        "LinkedIn": fellow_data.get("linkedin"),
        "Start Date": fellow_data.get("start_date"),
        "End Date": fellow_data.get("end_date"),
        "Cohort": fellow_data.get("cohort"),
        "Status": fellow_data.get("status", "Active"),
        "Last Check-in": fellow_data.get("last_check_in"),
        "Prior Role": fellow_data.get("prior_role"),
        "Education": fellow_data.get("education"),
        "Notes": fellow_data.get("notes")
    }

    # Remove empty fields
    fields = {k: v for k, v in fields.items() if v}

    response = requests.post(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Airtable error {response.status_code}: {response.text}")
    return response.status_code == 200


def update_fellow(record_id, fellow_data):
    """Update an existing fellow in Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{record_id}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {
        "Name": fellow_data.get("name"),
        "Email": fellow_data.get("email"),
        "Phone Number": fellow_data.get("phone"),
        "Fellow Type": fellow_data.get("fellow_type"),
        "Party": fellow_data.get("party"),
        "Office": fellow_data.get("office"),
        "Chamber": fellow_data.get("chamber"),
        "LinkedIn": fellow_data.get("linkedin"),
        "Start Date": fellow_data.get("start_date"),
        "End Date": fellow_data.get("end_date"),
        "Cohort": fellow_data.get("cohort"),
        "Status": fellow_data.get("status", "Active"),
        "Last Check-in": fellow_data.get("last_check_in"),
        "Prior Role": fellow_data.get("prior_role"),
        "Education": fellow_data.get("education"),
        "Notes": fellow_data.get("notes")
    }

    # Remove empty fields
    fields = {k: v for k, v in fields.items() if v}

    response = requests.patch(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Airtable error {response.status_code}: {response.text}")
    return response.status_code == 200


def update_fellow_checkin(record_id, checkin_date):
    """Update just the Last Check-in field for a fellow"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{record_id}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {"Last Check-in": checkin_date}

    response = requests.patch(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Failed to update Last Check-in: {response.status_code} - {response.text}")
        return False
    return True


def fetch_checkins(fellow_id):
    """Fetch all check-ins for a specific fellow"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{CHECKINS_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    # Fetch all check-ins sorted by date descending
    params = {
        "sort[0][field]": "Date",
        "sort[0][direction]": "desc"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return []

    data = response.json()
    checkins = []

    for record in data.get("records", []):
        fields = record.get("fields", {})
        # Fellow field contains array of linked record IDs
        fellow_ids = fields.get("Fellow", [])
        # Only include check-ins for this fellow
        if fellow_id in fellow_ids:
            checkins.append({
                "id": record["id"],
                "fellow": fellow_ids,
                "date": fields.get("Date", ""),
                "check_in_type": fields.get("Check-in Type", ""),
                "notes": fields.get("Notes", ""),
                "staff_member": fields.get("Staff Member", "")
            })

    return checkins


def add_checkin(checkin_data):
    """Add a new check-in to Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{CHECKINS_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {
        "Fellow": [checkin_data.get("fellow_id")],
        "Date": checkin_data.get("date"),
        "Check-in Type": checkin_data.get("check_in_type"),
        "Notes": checkin_data.get("notes"),
        "Staff Member": checkin_data.get("staff_member")
    }

    # Remove empty fields
    fields = {k: v for k, v in fields.items() if v}

    response = requests.post(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Airtable error {response.status_code}: {response.text}")
    return response.status_code == 200


def delete_checkin(record_id):
    """Delete a check-in from Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{CHECKINS_TABLE_NAME}/{record_id}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.delete(url, headers=headers)
    if response.status_code != 200:
        st.error(f"Failed to delete check-in: {response.status_code} - {response.text}")
        return False
    return True


def fetch_status_reports(fellow_id):
    """Fetch all status reports for a specific fellow"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{STATUS_REPORTS_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    params = {
        "sort[0][field]": "Month",
        "sort[0][direction]": "asc"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return []

    data = response.json()
    reports = []

    for record in data.get("records", []):
        fields = record.get("fields", {})
        fellow_ids = fields.get("Fellow", [])
        if fellow_id in fellow_ids:
            reports.append({
                "id": record["id"],
                "fellow": fellow_ids,
                "month": fields.get("Month", ""),
                "submitted": fields.get("Submitted", False),
                "date_submitted": fields.get("Date Submitted", ""),
                "notes": fields.get("Notes", "")
            })

    return reports


def add_status_report(report_data):
    """Add a new status report to Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{STATUS_REPORTS_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {
        "Fellow": [report_data.get("fellow_id")],
        "Month": report_data.get("month"),
        "Submitted": report_data.get("submitted", False),
        "Date Submitted": report_data.get("date_submitted"),
        "Notes": report_data.get("notes")
    }

    fields = {k: v for k, v in fields.items() if v is not None and v != ""}

    response = requests.post(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Airtable error {response.status_code}: {response.text}")
        return False
    return True


def update_status_report(record_id, submitted, date_submitted=None):
    """Update a status report's submitted status"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{STATUS_REPORTS_TABLE_NAME}/{record_id}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {"Submitted": submitted}
    if date_submitted:
        fields["Date Submitted"] = date_submitted

    response = requests.patch(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Failed to update status report: {response.status_code} - {response.text}")
        return False
    return True


def get_required_report_months(fellow):
    """Calculate which months a fellow needs to submit reports for"""
    if not fellow.get("requires_monthly_reports") or not fellow.get("report_start_date"):
        return []

    # Parse start date
    try:
        start_date = datetime.strptime(fellow["report_start_date"], "%Y-%m-%d")
    except:
        return []

    # Determine end month
    if fellow.get("report_end_month"):
        # Manual override
        end_month_str = fellow["report_end_month"]
    else:
        # Calculate from fellow type
        if "Senior" in (fellow.get("fellow_type") or ""):
            end_month_str = "Nov 2026"
        else:
            end_month_str = "Sep 2026"

    # Parse end month
    month_map = {
        "Feb 2026": (2026, 2), "Mar 2026": (2026, 3), "Apr 2026": (2026, 4),
        "May 2026": (2026, 5), "Jun 2026": (2026, 6), "Jul 2026": (2026, 7),
        "Aug 2026": (2026, 8), "Sep 2026": (2026, 9), "Oct 2026": (2026, 10),
        "Nov 2026": (2026, 11), "Dec 2026": (2026, 12)
    }

    if end_month_str not in month_map:
        return []

    end_year, end_month = month_map[end_month_str]

    # Generate list of required months
    required_months = []
    current_year = start_date.year
    current_month = start_date.month

    while (current_year < end_year) or (current_year == end_year and current_month <= end_month):
        month_name = datetime(current_year, current_month, 1).strftime("%b %Y")
        required_months.append(month_name)
        current_month += 1
        if current_month > 12:
            current_month = 1
            current_year += 1

    return required_months


def calculate_report_streak(reports, required_months):
    """Calculate current submission streak and status"""
    if not required_months:
        return {"streak": 0, "gift_card_eligible": False, "at_risk": False, "reimbursements_paused": False, "missed_count": 0}

    # Get submitted months
    submitted_months = set()
    for report in reports:
        if report.get("submitted"):
            submitted_months.add(report.get("month"))

    # Calculate streak (consecutive submissions from most recent)
    streak = 0
    today = datetime.now()
    current_month_str = today.strftime("%b %Y")

    # Find months where the due date (last day of month) has passed
    past_months = []
    for month in required_months:
        try:
            month_date = datetime.strptime(month, "%b %Y")
            # Get last day of month (the due date)
            if month_date.month == 12:
                last_day = datetime(month_date.year + 1, 1, 1) - timedelta(days=1)
            else:
                last_day = datetime(month_date.year, month_date.month + 1, 1) - timedelta(days=1)
            # Only count as past if due date has passed
            if last_day < today:
                past_months.append(month)
        except:
            continue

    # Count streak from most recent
    for month in reversed(past_months):
        if month in submitted_months:
            streak += 1
        else:
            break

    # Count consecutive misses
    missed_count = 0
    for month in reversed(past_months):
        if month not in submitted_months:
            missed_count += 1
        else:
            break

    return {
        "streak": streak,
        "gift_card_eligible": streak >= 3,
        "at_risk": missed_count == 1,
        "reimbursements_paused": missed_count >= 2,
        "missed_count": missed_count
    }


def calculate_days_since(date_str):
    """Calculate days since a given date"""
    if not date_str:
        return 999
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
        return (datetime.now() - date).days
    except:
        return 999


def calculate_days_until(date_str):
    """Calculate days until a given date"""
    if not date_str:
        return 999
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
        return (date - datetime.now()).days
    except:
        return 999


# ============ ALUMNI FUNCTIONS ============

def fetch_alumni():
    """Fetch all alumni from Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{ALUMNI_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    all_records = []
    offset = None

    while True:
        params = {}
        if offset:
            params["offset"] = offset

        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            st.error(f"Failed to fetch alumni data: {response.status_code}")
            return []

        data = response.json()

        for record in data.get("records", []):
            fields = record.get("fields", {})
            all_records.append({
                "id": record["id"],
                "name": fields.get("Name", ""),
                "email": fields.get("Email", ""),
                "phone": fields.get("Phone Number", ""),
                "cohort": fields.get("Cohort", ""),
                "fellow_types": fields.get("Fellow Type", []),
                "office_served": fields.get("Office Served", ""),
                "chamber": fields.get("Chamber", ""),
                "party": fields.get("Party", ""),
                "current_role": fields.get("Current Role", ""),
                "current_org": fields.get("Current Organization", ""),
                "sector": fields.get("Sector", ""),
                "location": fields.get("Location", ""),
                "linkedin": fields.get("LinkedIn", ""),
                "last_engaged": fields.get("Last Engaged", ""),
                "engagement_notes": fields.get("Engagement Notes", ""),
                "notes": fields.get("Notes", ""),
                "prior_role": fields.get("Prior Role", ""),
                "education": fields.get("Education", "")
            })

        offset = data.get("offset")
        if not offset:
            break

    return all_records


def create_alumni(alumni_data):
    """Create a new alumni record in Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{ALUMNI_TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {
        "Name": alumni_data.get("name"),
        "Email": alumni_data.get("email"),
        "Phone Number": alumni_data.get("phone"),
        "Cohort": alumni_data.get("cohort"),
        "Fellow Type": alumni_data.get("fellow_types", []),
        "Office Served": alumni_data.get("office_served"),
        "Chamber": alumni_data.get("chamber"),
        "Party": alumni_data.get("party"),
        "Current Role": alumni_data.get("current_role"),
        "Current Organization": alumni_data.get("current_org"),
        "Sector": alumni_data.get("sector"),
        "Location": alumni_data.get("location"),
        "LinkedIn": alumni_data.get("linkedin"),
        "Last Engaged": alumni_data.get("last_engaged"),
        "Engagement Notes": alumni_data.get("engagement_notes"),
        "Notes": alumni_data.get("notes"),
        "Prior Role": alumni_data.get("prior_role"),
        "Education": alumni_data.get("education")
    }

    # Remove empty fields (but keep Fellow Type even if empty list)
    fields = {k: v for k, v in fields.items() if v or k == "Fellow Type"}

    response = requests.post(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Airtable error {response.status_code}: {response.text}")
    return response.status_code == 200


def update_alumni(record_id, alumni_data):
    """Update an existing alumni record in Airtable"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{ALUMNI_TABLE_NAME}/{record_id}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }

    fields = {
        "Name": alumni_data.get("name"),
        "Email": alumni_data.get("email"),
        "Phone Number": alumni_data.get("phone"),
        "Cohort": alumni_data.get("cohort"),
        "Fellow Type": alumni_data.get("fellow_types", []),
        "Office Served": alumni_data.get("office_served"),
        "Chamber": alumni_data.get("chamber"),
        "Party": alumni_data.get("party"),
        "Current Role": alumni_data.get("current_role"),
        "Current Organization": alumni_data.get("current_org"),
        "Sector": alumni_data.get("sector"),
        "Location": alumni_data.get("location"),
        "LinkedIn": alumni_data.get("linkedin"),
        "Last Engaged": alumni_data.get("last_engaged"),
        "Engagement Notes": alumni_data.get("engagement_notes"),
        "Notes": alumni_data.get("notes"),
        "Prior Role": alumni_data.get("prior_role"),
        "Education": alumni_data.get("education")
    }

    # Remove empty fields (but keep Fellow Type even if empty list)
    fields = {k: v for k, v in fields.items() if v or k == "Fellow Type"}

    response = requests.patch(url, headers=headers, json={"fields": fields})
    if response.status_code != 200:
        st.error(f"Airtable error {response.status_code}: {response.text}")
    return response.status_code == 200
