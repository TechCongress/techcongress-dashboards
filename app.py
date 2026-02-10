import streamlit as st
import requests
from datetime import datetime, timedelta
import pandas as pd

# ============ PAGE CONFIG ============
st.set_page_config(
    page_title="TechCongress Fellows Dashboard",
    page_icon="🏛️",
    layout="wide"
)

# ============ AUTHENTICATION ============
def check_password():
    """Returns True if the user has entered correct credentials."""

    def login_form():
        """Display login form."""
        st.markdown("""
        <style>
            .login-container {
                max-width: 400px;
                margin: 100px auto;
                padding: 2rem;
                background: white;
                border-radius: 1rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
        </style>
        """, unsafe_allow_html=True)

        st.markdown("<h1 style='text-align: center; color: #1f2937;'>TechCongress Fellows Dashboard</h1>", unsafe_allow_html=True)
        st.markdown("<p style='text-align: center; color: #6b7280;'>Please log in to continue</p>", unsafe_allow_html=True)

        with st.form("login_form"):
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            submitted = st.form_submit_button("Log in", use_container_width=True)

            if submitted:
                if username == st.secrets["auth"]["username"] and password == st.secrets["auth"]["password"]:
                    st.session_state["authenticated"] = True
                    st.rerun()
                else:
                    st.error("Invalid username or password")

    if st.session_state.get("authenticated"):
        return True

    login_form()
    return False

# Check authentication before showing anything else
if not check_password():
    st.stop()

# Initialize session state early (before any UI)
if "show_add_form" not in st.session_state:
    st.session_state.show_add_form = False
if "editing_fellow" not in st.session_state:
    st.session_state.editing_fellow = None
if "selected_fellow" not in st.session_state:
    st.session_state.selected_fellow = None
if "show_checkin_form" not in st.session_state:
    st.session_state.show_checkin_form = False

# ============ AIRTABLE CONFIG ============
AIRTABLE_API_KEY = st.secrets["airtable"]["api_key"]
AIRTABLE_BASE_ID = st.secrets["airtable"]["base_id"]
AIRTABLE_TABLE_NAME = st.secrets["airtable"]["table_name"]
CHECKINS_TABLE_NAME = "Check-ins"

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
            "notes": fields.get("Notes", "")
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


# ============ CUSTOM CSS ============
st.markdown("""
<style>
    .stApp {
        background-color: #f8fafc;
    }

    /* Force light mode styling */
    [data-testid="stAppViewContainer"] {
        background-color: #f8fafc;
    }

    [data-testid="stHeader"] {
        background-color: #f8fafc;
    }

    h1, h2, h3, p, span, label {
        color: #1f2937 !important;
    }
    .stat-card {
        background: white;
        padding: 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
    }
    .stat-label {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
    }
    .fellow-card {
        background: white;
        padding: 1.25rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .fellow-card:hover {
        border-color: #93c5fd;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    .status-on-track { background: #dcfce7; color: #166534; border-radius: 9999px; }
    .status-flagged { background: #fef9c3; color: #854d0e; border-radius: 9999px; }
    .status-ending-soon { background: #ffedd5; color: #9a3412; border-radius: 9999px; }
    .party-democrat { background: #dbeafe; color: #1d4ed8; }
    .party-republican { background: #fee2e2; color: #dc2626; }
    .party-independent { background: #f3e8ff; color: #7c3aed; }
    .fellow-type-senior { background: #e0e7ff; color: #4338ca; }
    .fellow-type-cif { background: #f1f5f9; color: #475569; }
    .needs-checkin { background: #fef9c3; color: #854d0e; }
    div[data-testid="stMetric"] {
        background-color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
    }

    div[data-testid="stMetric"] label {
        color: #6b7280 !important;
    }

    div[data-testid="stMetric"] div[data-testid="stMetricValue"] {
        color: #1f2937 !important;
    }

    /* Help icon (question mark) styling */
    [data-testid="stMetric"] svg {
        color: #6b7280 !important;
        stroke: #6b7280 !important;
    }

    /* Tooltip styling */
    [data-testid="stTooltipIcon"] {
        color: #6b7280 !important;
    }

    [data-testid="stTooltipIcon"] svg {
        color: #6b7280 !important;
        stroke: #6b7280 !important;
    }

    /* Tooltip popup content */
    div[data-baseweb="tooltip"] {
        background-color: #1f2937 !important;
        color: #ffffff !important;
    }

    div[data-baseweb="tooltip"] div {
        color: #ffffff !important;
    }

    [data-testid="stSidebar"] {
        background-color: #ffffff !important;
    }

    [data-testid="stSidebar"] * {
        color: #1f2937 !important;
    }

    [data-testid="stSidebar"] h1,
    [data-testid="stSidebar"] h2,
    [data-testid="stSidebar"] h3,
    [data-testid="stSidebar"] h4,
    [data-testid="stSidebar"] p,
    [data-testid="stSidebar"] span,
    [data-testid="stSidebar"] a {
        color: #1f2937 !important;
    }

    [data-testid="stSidebar"] hr {
        border-color: #e5e7eb !important;
    }

    [data-testid="stSidebarContent"] {
        background-color: #ffffff !important;
    }

    .stButton button {
        background-color: #3b82f6 !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 0.5rem !important;
    }

    .stButton button:hover {
        background-color: #2563eb !important;
        color: #ffffff !important;
    }

    .stSelectbox label, .stTextInput label {
        color: #1f2937 !important;
    }

    [data-testid="stExpander"] {
        background-color: white;
        border-radius: 0.75rem;
    }

    [data-testid="stExpander"] summary {
        color: #1f2937 !important;
    }

    [data-testid="stExpander"] summary span {
        color: #1f2937 !important;
    }

    [data-testid="stExpander"] div {
        color: #1f2937 !important;
    }

    [data-testid="stExpanderDetails"] {
        color: #1f2937 !important;
    }

    [data-testid="stExpanderDetails"] p {
        color: #1f2937 !important;
    }
</style>
""", unsafe_allow_html=True)


# ============ MAIN APP ============

def main():
    # Header
    col1, col2 = st.columns([4, 1])
    with col1:
        st.title("TechCongress Fellows Dashboard")
    with col2:
        if st.button("Logout", use_container_width=True):
            st.session_state["authenticated"] = False
            st.rerun()

    st.caption("Monitor and manage current fellow placements")

    btn_col, _ = st.columns([1, 4])
    with btn_col:
        if st.button("Add Fellow", type="primary", use_container_width=True):
            st.session_state.show_add_form = True
            st.session_state.editing_fellow = None
            st.rerun()

    # Fetch data
    with st.spinner("Loading fellows..."):
        fellows = fetch_fellows()

    if not fellows:
        st.warning("No fellows found. Add your first fellow to get started!")
        if st.session_state.show_add_form:
            show_fellow_form()
        return

    # Calculate stats
    total = len(fellows)
    on_track = len([f for f in fellows if f["status"] in ["on-track", "Active"]])
    flagged = len([f for f in fellows if f["status"] in ["flagged", "Flagged"]])
    ending_soon = len([f for f in fellows if f["status"] in ["ending-soon", "Ending Soon"]])
    needs_checkin = len([f for f in fellows if calculate_days_since(f["last_check_in"]) > 210 and f["status"] in ["on-track", "Active"]])

    # Stats row
    st.markdown("---")
    col1, col2, col3, col4, col5 = st.columns(5)

    with col1:
        st.metric("Total Fellows", total, help="Currently placed")
    with col2:
        st.metric("Active", on_track, help="No issues")
    with col3:
        st.metric("Needs Check-in", needs_checkin, help="7+ months since contact")
    with col4:
        st.metric("Flagged", flagged, help="Needs attention")
    with col5:
        st.metric("Ending Soon", ending_soon, help="Within 90 days")

    st.markdown("---")

    # Filters
    with st.expander("Filters", expanded=True):
        col1, col2, col3, col4, col5 = st.columns(5)

        with col1:
            search = st.text_input("Search", placeholder="Name or office...")
        with col2:
            status_options = ["All Statuses", "Active", "Flagged", "Ending Soon"]
            status_filter = st.selectbox("Status", status_options)
        with col3:
            fellow_type_options = ["All Types", "Senior Congressional Innovation Fellow", "Congressional Innovation Fellow"]
            fellow_type_filter = st.selectbox("Fellow Type", fellow_type_options)
        with col4:
            party_options = ["All Parties", "Democrat", "Republican", "Independent"]
            party_filter = st.selectbox("Party", party_options)
        with col5:
            chamber_options = ["All Chambers", "Senate", "House"]
            chamber_filter = st.selectbox("Chamber", chamber_options)

        # Cohort filter
        col1, col2 = st.columns(2)
        with col1:
            cohorts = sorted(set([f["cohort"] for f in fellows if f["cohort"]]), reverse=True)
            cohort_options = ["All Cohorts"] + cohorts
            cohort_filter = st.selectbox("Cohort", cohort_options)
        with col2:
            sort_options = ["Priority (Flagged first)", "Name (A-Z)", "Name (Z-A)", "Last Check-in (oldest first)", "Last Check-in (newest first)", "End Date (soonest first)", "End Date (latest first)", "Cohort (newest first)", "Cohort (oldest first)"]
            sort_by = st.selectbox("Sort by", sort_options)

    # Apply filters
    filtered_fellows = fellows.copy()

    if search:
        search_lower = search.lower()
        filtered_fellows = [f for f in filtered_fellows if
            search_lower in f["name"].lower() or
            search_lower in f["office"].lower()]

    if status_filter != "All Statuses":
        filtered_fellows = [f for f in filtered_fellows if f["status"] == status_filter]

    if fellow_type_filter != "All Types":
        filtered_fellows = [f for f in filtered_fellows if f["fellow_type"] == fellow_type_filter]

    if party_filter != "All Parties":
        filtered_fellows = [f for f in filtered_fellows if f["party"] == party_filter]

    if chamber_filter != "All Chambers":
        filtered_fellows = [f for f in filtered_fellows if f["chamber"] == chamber_filter]

    if cohort_filter != "All Cohorts":
        filtered_fellows = [f for f in filtered_fellows if f["cohort"] == cohort_filter]

    # Sort based on selected option
    if sort_by == "Priority (Flagged first)":
        def sort_key(f):
            status_priority = {"flagged": 0, "Flagged": 0, "ending-soon": 1, "Ending Soon": 1, "on-track": 2, "Active": 2}.get(f["status"], 3)
            days_since = calculate_days_since(f["last_check_in"])
            return (status_priority, -days_since)
        filtered_fellows.sort(key=sort_key)
    elif sort_by == "Name (A-Z)":
        filtered_fellows.sort(key=lambda f: f["name"].lower())
    elif sort_by == "Name (Z-A)":
        filtered_fellows.sort(key=lambda f: f["name"].lower(), reverse=True)
    elif sort_by == "Last Check-in (oldest first)":
        filtered_fellows.sort(key=lambda f: f["last_check_in"] or "0000-00-00")
    elif sort_by == "Last Check-in (newest first)":
        filtered_fellows.sort(key=lambda f: f["last_check_in"] or "0000-00-00", reverse=True)
    elif sort_by == "End Date (soonest first)":
        filtered_fellows.sort(key=lambda f: f["end_date"] or "9999-99-99")
    elif sort_by == "End Date (latest first)":
        filtered_fellows.sort(key=lambda f: f["end_date"] or "0000-00-00", reverse=True)
    elif sort_by == "Cohort (newest first)":
        filtered_fellows.sort(key=lambda f: f["cohort"] or "", reverse=True)
    elif sort_by == "Cohort (oldest first)":
        filtered_fellows.sort(key=lambda f: f["cohort"] or "")

    # Show count
    st.caption(f"Showing {len(filtered_fellows)} of {total} fellows")

    # Show add/edit form if needed
    if st.session_state.show_add_form or st.session_state.editing_fellow:
        show_fellow_form()

    # Show selected fellow details
    if st.session_state.selected_fellow:
        show_fellow_details()

    # Display fellows in cards
    cols = st.columns(3)
    for idx, fellow in enumerate(filtered_fellows):
        with cols[idx % 3]:
            show_fellow_card(fellow)


def show_fellow_card(fellow):
    """Display a fellow card"""
    days_since_checkin = calculate_days_since(fellow["last_check_in"])
    needs_checkin = days_since_checkin > 210 and fellow["status"] in ["on-track", "Active"]
    days_until_end = calculate_days_until(fellow["end_date"])

    # Status badge colors - handle both Airtable values and internal values
    status_colors = {
        "on-track": ("#4ade80", "#166534"),
        "Active": ("#4ade80", "#166534"),
        "flagged": ("#fde047", "#854d0e"),
        "Flagged": ("#fde047", "#854d0e"),
        "ending-soon": ("#f87171", "#991b1b"),
        "Ending Soon": ("#f87171", "#991b1b")
    }
    status_label = {"on-track": "Active", "flagged": "Flagged", "ending-soon": "Ending Soon"}.get(fellow["status"], fellow["status"])
    bg_color, text_color = status_colors.get(fellow["status"], ("#4ade80", "#166534"))

    # Fellow type badge
    type_label = ""
    type_bg = ""
    type_text = "#ffffff"
    if fellow["fellow_type"]:
        type_label = "Senior CIF" if "Senior" in fellow["fellow_type"] else "CIF"
        type_bg = "#6366f1" if "Senior" in fellow["fellow_type"] else "#93c5fd"
        type_text = "#ffffff" if "Senior" in fellow["fellow_type"] else "#1e40af"

    # Build parts separately
    checkin_badge = ""
    if needs_checkin:
        checkin_badge = '<span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:500;background-color:#eab308;color:#ffffff;margin-left:0.25rem;">Needs Check-in</span>'

    type_html = ""
    if type_label:
        type_html = f'<span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:500;background-color:{type_bg};color:{type_text};margin-right:0.25rem;">{type_label}</span>'

    # Party badge
    party_html = ""
    if fellow["party"]:
        if fellow["party"] == "Republican":
            party_html = '<span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:500;background-color:#ef4444;color:#ffffff;">R</span>'
        elif fellow["party"] == "Democrat":
            party_html = '<span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:500;background-color:#3b82f6;color:#ffffff;">D</span>'
        elif fellow["party"] == "Independent":
            party_html = '<span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:500;background-color:#8b5cf6;color:#ffffff;">I</span>'

    office_html = ""
    if fellow["office"]:
        office_html = f'<div style="color:#374151;font-size:0.875rem;margin-bottom:0.25rem;">{fellow["office"]}</div>'

    term_html = ""
    if fellow["start_date"] and fellow["end_date"]:
        term_html = f'<div style="color:#6b7280;font-size:0.8rem;margin-bottom:0.25rem;">Fellowship Term: {fellow["start_date"]} - {fellow["end_date"]}</div>'

    checkin_html = ""
    if fellow["last_check_in"]:
        checkin_html = f'<div style="color:#6b7280;font-size:0.8rem;">Last check-in: {fellow["last_check_in"]}</div>'

    card_html = f'<div style="background-color:white;padding:1.25rem;border-radius:0.75rem;border:1px solid #e5e7eb;margin-bottom:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);"><div style="font-weight:600;font-size:1.1rem;margin-bottom:0.25rem;color:#1f2937;">{fellow["name"]}</div><div style="color:#6b7280;font-size:0.875rem;margin-bottom:0.75rem;">Cohort: {fellow["cohort"]}</div><div style="margin-bottom:0.5rem;"><span style="display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:500;background-color:{bg_color};color:{text_color};">{status_label}</span>{checkin_badge}</div><div style="margin-bottom:0.5rem;">{type_html}{party_html}</div>{office_html}{term_html}{checkin_html}</div>'

    st.markdown(card_html, unsafe_allow_html=True)

    # Action buttons
    col1, col2 = st.columns(2)
    with col1:
        if st.button("View", key=f"view_{fellow['id']}", use_container_width=True):
            st.session_state.selected_fellow = fellow
            st.rerun()
    with col2:
        if st.button("Edit", key=f"edit_{fellow['id']}", use_container_width=True):
            st.session_state.editing_fellow = fellow
            st.session_state.show_add_form = False
            st.rerun()


def show_fellow_details():
    """Show detailed view of a fellow"""
    fellow = st.session_state.selected_fellow

    with st.sidebar:
        st.markdown("### Fellow Details")

        if st.button("Close", use_container_width=True):
            st.session_state.selected_fellow = None
            st.rerun()

        st.markdown("---")

        # Name and avatar
        st.markdown(f"## {fellow['name']}")

        if fellow["cohort"]:
            st.caption(f"Cohort: {fellow['cohort']}")

        # Status
        status_label = {"on-track": "Active", "flagged": "Flagged", "ending-soon": "Ending Soon"}.get(fellow["status"], fellow["status"])
        st.markdown(f"**Status:** {status_label}")

        if fellow["fellow_type"]:
            st.markdown(f"**Fellow Type:** {fellow['fellow_type']}")

        st.markdown("---")

        # Contact info
        st.markdown("#### Contact")
        if fellow["email"]:
            st.markdown(f"[{fellow['email']}](mailto:{fellow['email']})")
        if fellow["phone"]:
            st.markdown(f"{fellow['phone']}")
        if fellow["linkedin"]:
            st.markdown(f"[LinkedIn]({fellow['linkedin']})")

        st.markdown("---")

        # Placement
        st.markdown("#### Placement")
        if fellow["office"]:
            st.markdown(f"{fellow['office']}")
        if fellow["chamber"]:
            st.markdown(f"**Chamber:** {fellow['chamber']}")
        if fellow["party"]:
            st.markdown(f"**Party:** {fellow['party']}")

        st.markdown("---")

        # Dates
        st.markdown("#### Fellowship Period")
        if fellow["start_date"]:
            st.markdown(f"**Start:** {fellow['start_date']}")
        if fellow["end_date"]:
            st.markdown(f"**End:** {fellow['end_date']}")
        if fellow["last_check_in"]:
            days_since = calculate_days_since(fellow["last_check_in"])
            st.markdown(f"**Last Check-in:** {fellow['last_check_in']} ({days_since} days ago)")

        st.markdown("---")

        # Background
        st.markdown("#### Background")
        if fellow["prior_role"]:
            st.markdown(f"**Prior Role:** {fellow['prior_role']}")
        if fellow["education"]:
            st.markdown(f"**Education:** {fellow['education']}")

        if fellow["notes"]:
            st.markdown("---")
            st.markdown("#### Notes")
            st.markdown(fellow["notes"])

        st.markdown("---")

        # Check-in History
        st.markdown("#### Check-in History")

        if st.button("+ Log Check-in", use_container_width=True):
            st.session_state.show_checkin_form = True
            st.rerun()

        # Show check-in form if toggled
        if st.session_state.show_checkin_form:
            with st.form("checkin_form"):
                checkin_date = st.date_input("Date", value=datetime.now())
                checkin_type = st.selectbox("Check-in Type", ["Email", "Phone", "Zoom", "In-person", "Slack", "Text"])
                checkin_notes = st.text_area("Notes")
                staff_member = st.text_input("Staff Member")

                col1, col2 = st.columns(2)
                with col1:
                    if st.form_submit_button("Save", use_container_width=True):
                        checkin_data = {
                            "fellow_id": fellow["id"],
                            "date": checkin_date.strftime("%Y-%m-%d"),
                            "check_in_type": checkin_type,
                            "notes": checkin_notes,
                            "staff_member": staff_member
                        }
                        if add_checkin(checkin_data):
                            # Also update the fellow's Last Check-in date
                            if update_fellow_checkin(fellow["id"], checkin_date.strftime("%Y-%m-%d")):
                                st.success("Check-in logged!")
                            else:
                                st.warning("Check-in logged but failed to update Last Check-in date")
                            st.session_state.show_checkin_form = False
                            import time
                            time.sleep(2)  # Give time to see any error messages
                            st.rerun()
                with col2:
                    if st.form_submit_button("Cancel", use_container_width=True):
                        st.session_state.show_checkin_form = False
                        st.rerun()

        # Display check-in history
        checkins = fetch_checkins(fellow["id"])
        if checkins:
            for checkin in checkins:
                st.markdown(f"""
                <div style="background-color:#f8fafc;padding:0.75rem;border-radius:0.5rem;margin-bottom:0.25rem;border-left:3px solid #3b82f6;">
                    <div style="font-weight:600;color:#1f2937;font-size:0.9rem;">{checkin['date']} • {checkin['check_in_type']}</div>
                    <div style="color:#4b5563;font-size:0.85rem;margin-top:0.25rem;">{checkin['notes']}</div>
                    <div style="color:#6b7280;font-size:0.75rem;margin-top:0.25rem;">— {checkin['staff_member']}</div>
                </div>
                """, unsafe_allow_html=True)
                if st.button("Delete", key=f"delete_checkin_{checkin['id']}", use_container_width=True):
                    if delete_checkin(checkin["id"]):
                        st.success("Check-in deleted!")
                        import time
                        time.sleep(1)
                        st.rerun()
                st.markdown("<div style='margin-bottom:1rem;'></div>", unsafe_allow_html=True)
        else:
            st.caption("No check-ins recorded yet.")

        st.markdown("---")

        if st.button("Edit Fellow", use_container_width=True, type="primary"):
            st.session_state.editing_fellow = fellow
            st.session_state.selected_fellow = None
            st.rerun()


def show_fellow_form():
    """Show add/edit fellow form"""
    is_editing = st.session_state.editing_fellow is not None
    fellow = st.session_state.editing_fellow or {}

    with st.form("fellow_form"):
        st.markdown(f"### {'Edit' if is_editing else 'Add New'} Fellow")

        col1, col2 = st.columns(2)

        with col1:
            name = st.text_input("Name *", value=fellow.get("name", ""))
            email = st.text_input("Email", value=fellow.get("email", ""))
            phone = st.text_input("Phone", value=fellow.get("phone", ""))
            linkedin = st.text_input("LinkedIn URL", value=fellow.get("linkedin", ""))

        with col2:
            fellow_type = st.selectbox(
                "Fellow Type",
                ["", "Congressional Innovation Fellow", "Senior Congressional Innovation Fellow"],
                index=["", "Congressional Innovation Fellow", "Senior Congressional Innovation Fellow"].index(fellow.get("fellow_type", "")) if fellow.get("fellow_type", "") in ["", "Congressional Innovation Fellow", "Senior Congressional Innovation Fellow"] else 0
            )
            party = st.selectbox(
                "Party",
                ["", "Democrat", "Republican", "Independent"],
                index=["", "Democrat", "Republican", "Independent"].index(fellow.get("party", "")) if fellow.get("party", "") in ["", "Democrat", "Republican", "Independent"] else 0
            )
            chamber = st.selectbox(
                "Chamber",
                ["", "Senate", "House"],
                index=["", "Senate", "House"].index(fellow.get("chamber", "")) if fellow.get("chamber", "") in ["", "Senate", "House"] else 0
            )
            status = st.selectbox(
                "Status",
                ["Active", "Flagged", "Ending Soon"],
                index=["Active", "Flagged", "Ending Soon"].index(fellow.get("status", "Active")) if fellow.get("status", "Active") in ["Active", "Flagged", "Ending Soon"] else 0
            )

        office = st.text_input("Office", value=fellow.get("office", ""), placeholder="e.g., Sen. Maria Cantwell (D-WA)")
        cohort = st.text_input("Cohort", value=fellow.get("cohort", ""), placeholder="e.g., 2025")

        col1, col2, col3 = st.columns(3)
        with col1:
            start_date = st.date_input(
                "Start Date",
                value=datetime.strptime(fellow["start_date"], "%Y-%m-%d") if fellow.get("start_date") else None,
                format="YYYY-MM-DD"
            )
        with col2:
            end_date = st.date_input(
                "End Date",
                value=datetime.strptime(fellow["end_date"], "%Y-%m-%d") if fellow.get("end_date") else None,
                format="YYYY-MM-DD"
            )
        with col3:
            last_check_in = st.date_input(
                "Last Check-in",
                value=datetime.strptime(fellow["last_check_in"], "%Y-%m-%d") if fellow.get("last_check_in") else None,
                format="YYYY-MM-DD"
            )

        prior_role = st.text_input("Prior Role", value=fellow.get("prior_role", ""), placeholder="e.g., ML Engineer at Google")
        education = st.text_input("Education", value=fellow.get("education", ""), placeholder="e.g., PhD Computer Science, Stanford")
        notes = st.text_area("Notes", value=fellow.get("notes", ""))

        col1, col2 = st.columns(2)
        with col1:
            cancel = st.form_submit_button("Cancel", use_container_width=True)
        with col2:
            submit = st.form_submit_button(
                "Save" if is_editing else "Add Fellow",
                type="primary",
                use_container_width=True
            )

        if cancel:
            st.session_state.show_add_form = False
            st.session_state.editing_fellow = None
            st.rerun()

        if submit:
            if not name:
                st.error("Name is required")
            else:
                fellow_data = {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "fellow_type": fellow_type,
                    "party": party,
                    "office": office,
                    "chamber": chamber,
                    "linkedin": linkedin,
                    "start_date": start_date.strftime("%Y-%m-%d") if start_date else "",
                    "end_date": end_date.strftime("%Y-%m-%d") if end_date else "",
                    "cohort": cohort,
                    "status": status,
                    "last_check_in": last_check_in.strftime("%Y-%m-%d") if last_check_in else "",
                    "prior_role": prior_role,
                    "education": education,
                    "notes": notes
                }

                if is_editing:
                    success = update_fellow(fellow["id"], fellow_data)
                    if success:
                        st.success("Fellow updated successfully!")
                        st.session_state.editing_fellow = None
                        st.rerun()
                    else:
                        st.error("Failed to update fellow")
                else:
                    success = create_fellow(fellow_data)
                    if success:
                        st.success("Fellow added successfully!")
                        st.session_state.show_add_form = False
                        st.rerun()
                    else:
                        st.error("Failed to add fellow")


if __name__ == "__main__":
    main()
