import streamlit as st

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

        col_a, col_b, col_c = st.columns([2, 1, 2])
        with col_b:
            st.image("TechCongress Logo (black).png", use_container_width=True)
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

# ============ PAGE NAVIGATION ============
current_fellows = st.Page("pages/current-fellows-page.py", title="Current Fellows", default=True)

pg = st.navigation([current_fellows])
pg.run()
