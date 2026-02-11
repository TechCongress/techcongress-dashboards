import { useState } from "react";

const sampleAlumni = [
  {
    id: 1, name: "Jordan Rivera", cohort: "2025", fellowType: "Congressional Innovation Fellow",
    officeServed: "Sen. Maria Cantwell (D-WA)", chamber: "Senate", party: "Democrat",
    currentRole: "Senior Policy Advisor", currentOrg: "White House OSTP", sector: "Government",
    location: "Washington, DC", email: "jordan.rivera@email.com", phone: "(202) 555-0142",
    linkedin: "https://linkedin.com/in/jordanrivera", lastEngaged: "2026-01-15",
    engagementNotes: "Spoke at Jan 2026 cohort orientation. Mentoring two current fellows.",
    notes: "Strong interest in AI policy. Open to future advisory roles."
  },
  {
    id: 2, name: "Priya Sharma", cohort: "2024", fellowType: "Senior Congressional Innovation Fellow",
    officeServed: "Rep. Ro Khanna (D-CA)", chamber: "House", party: "Democrat",
    currentRole: "Director of Technology Policy", currentOrg: "Brookings Institution", sector: "Policy/Think Tank",
    location: "Washington, DC", email: "priya.sharma@email.com", phone: "(202) 555-0198",
    linkedin: "https://linkedin.com/in/priyasharma", lastEngaged: "2025-09-20",
    engagementNotes: "Participated in alumni panel at 2025 annual event.",
    notes: ""
  },
  {
    id: 3, name: "Marcus Thompson", cohort: "2023", fellowType: "Congressional Innovation Fellow",
    officeServed: "Sen. Todd Young (R-IN)", chamber: "Senate", party: "Republican",
    currentRole: "Product Manager", currentOrg: "Google", sector: "Private",
    location: "San Francisco, CA", email: "marcus.t@email.com", phone: "(415) 555-0167",
    linkedin: "https://linkedin.com/in/marcusthompson", lastEngaged: "2025-03-10",
    engagementNotes: "Helped review fellowship job postings.",
    notes: "Relocated to SF after fellowship."
  },
  {
    id: 4, name: "Elena Vasquez", cohort: "2022", fellowType: "Congressional Innovation Scholar",
    officeServed: "Rep. Will Hurd (R-TX)", chamber: "House", party: "Republican",
    currentRole: "Assistant Professor of Computer Science", currentOrg: "Georgetown University", sector: "Academia",
    location: "Washington, DC", email: "elena.v@email.com", phone: "(202) 555-0234",
    linkedin: "https://linkedin.com/in/elenavasquez", lastEngaged: "2024-11-05",
    engagementNotes: "Guest lectured at Georgetown event co-hosted with TechCongress.",
    notes: "Researches tech policy and governance."
  },
  {
    id: 5, name: "David Kim", cohort: "2024", fellowType: "Congressional Innovation Fellow",
    officeServed: "Sen. Ben Sasse (R-NE)", chamber: "Senate", party: "Republican",
    currentRole: "Policy Director", currentOrg: "Electronic Frontier Foundation", sector: "Nonprofit",
    location: "San Francisco, CA", email: "david.kim@email.com", phone: "(415) 555-0189",
    linkedin: "https://linkedin.com/in/davidkim", lastEngaged: "2026-02-01",
    engagementNotes: "Referred a candidate for the 2027 cohort. Active in alumni Slack.",
    notes: ""
  },
  {
    id: 6, name: "Sarah Chen", cohort: "2023", fellowType: "Senior Congressional Innovation Fellow",
    officeServed: "Sen. Mark Warner (D-VA)", chamber: "Senate", party: "Democrat",
    currentRole: "VP of Public Policy", currentOrg: "Stripe", sector: "Private",
    location: "New York, NY", email: "sarah.chen@email.com", phone: "(212) 555-0156",
    linkedin: "https://linkedin.com/in/sarachen", lastEngaged: "2025-06-12",
    engagementNotes: "Hosted a TechCongress networking event in NYC.",
    notes: "Well-connected in fintech policy circles."
  },
  {
    id: 7, name: "Amara Osei", cohort: "2024", fellowType: "Congressional Digital Service Fellow",
    officeServed: "Rep. Derek Kilmer (D-WA)", chamber: "House", party: "Democrat",
    currentRole: "Engineering Manager", currentOrg: "US Digital Service", sector: "Government",
    location: "Washington, DC", email: "amara.osei@email.com", phone: "(202) 555-0271",
    linkedin: "https://linkedin.com/in/amaraosei", lastEngaged: "2026-01-20",
    engagementNotes: "Helped review digital service curriculum for 2026 cohort.",
    notes: "Background in civic tech and open source."
  },
  {
    id: 8, name: "Raj Mehta", cohort: "", fellowType: "AI Security Fellow",
    officeServed: "National Institute of Standards and Technology", chamber: "Executive Branch", party: "",
    currentRole: "Research Scientist", currentOrg: "Center for AI Safety", sector: "Nonprofit",
    location: "San Francisco, CA", email: "raj.mehta@email.com", phone: "(415) 555-0312",
    linkedin: "https://linkedin.com/in/rajmehta", lastEngaged: "2026-02-05",
    engagementNotes: "Provided briefing materials on AI safety for current fellows.",
    notes: "Published researcher in AI alignment."
  },
];

const sampleFellows = [
  { id: 101, name: "Alex Morgan", cohort: "2026", status: "Active", fellowType: "Congressional Innovation Fellow", office: "Sen. Amy Klobuchar (D-MN)", chamber: "Senate", party: "Democrat", lastCheckin: "2026-02-01", endDate: "2027-01-15", needsCheckin: false },
  { id: 102, name: "Taylor Brooks", cohort: "2026", status: "Flagged", fellowType: "Senior Congressional Innovation Fellow", office: "Rep. Mike Gallagher (R-WI)", chamber: "House", party: "Republican", lastCheckin: "2025-12-10", endDate: "2027-01-15", needsCheckin: true },
  { id: 103, name: "Jamie Okafor", cohort: "2025", status: "Ending Soon", fellowType: "Congressional Innovation Fellow", office: "Sen. Chris Coons (D-DE)", chamber: "Senate", party: "Democrat", lastCheckin: "2026-01-28", endDate: "2026-03-15", needsCheckin: false },
  { id: 104, name: "Riley Patel", cohort: "2026", status: "Active", fellowType: "Congressional Innovation Fellow", office: "Rep. Suzan DelBene (D-WA)", chamber: "House", party: "Democrat", lastCheckin: "2026-02-05", endDate: "2027-01-15", needsCheckin: false },
  { id: 105, name: "Nadia Williams", cohort: "", status: "Active", fellowType: "AI Security Fellow", office: "CISA", chamber: "Executive Branch", party: "", lastCheckin: "2026-01-30", endDate: "2027-01-15", needsCheckin: false },
];

const partyColor = { Democrat: "#2563EB", Republican: "#DC2626", Independent: "#7C3AED" };
const sectorColors = { Government: "#1D4ED8", Private: "#059669", Nonprofit: "#D97706", Academia: "#7C3AED", "Policy/Think Tank": "#0891B2" };
const statusColors = { Active: "#16A34A", Flagged: "#DC2626", "Ending Soon": "#F59E0B" };

export default function App() {
  const [page, setPage] = useState("fellows");
  const [search, setSearch] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [selectedFellow, setSelectedFellow] = useState(null);
  const [cohortFilter, setCohortFilter] = useState("All");
  const [fellowTypeFilter, setFellowTypeFilter] = useState("All");
  const [chamberFilter, setChamberFilter] = useState("All");
  const [partyFilter, setPartyFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [sortBy, setSortBy] = useState("cohort-newest");

  const clearFilters = () => {
    setSearch(""); setCohortFilter("All"); setFellowTypeFilter("All");
    setChamberFilter("All"); setPartyFilter("All"); setSectorFilter("All");
  };

  const filteredAlumni = sampleAlumni
    .filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (cohortFilter !== "All" && a.cohort !== cohortFilter) return false;
      if (fellowTypeFilter !== "All" && a.fellowType !== fellowTypeFilter) return false;
      if (chamberFilter !== "All" && a.chamber !== chamberFilter) return false;
      if (partyFilter !== "All" && a.party !== partyFilter) return false;
      if (sectorFilter !== "All" && a.sector !== sectorFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "cohort-newest") return b.cohort.localeCompare(a.cohort);
      if (sortBy === "cohort-oldest") return a.cohort.localeCompare(b.cohort);
      if (sortBy === "name-az") return a.name.localeCompare(b.name);
      if (sortBy === "name-za") return b.name.localeCompare(a.name);
      if (sortBy === "last-engaged") return (a.lastEngaged || "").localeCompare(b.lastEngaged || "");
      return 0;
    });

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F8F9FA", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827" }}>TechCongress Fellows Dashboard</h1>
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: "8px", padding: "3px" }}>
            <button onClick={() => { setPage("fellows"); clearFilters(); }} style={{ padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", background: page === "fellows" ? "white" : "transparent", color: page === "fellows" ? "#111827" : "#6B7280", boxShadow: page === "fellows" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
              Current Fellows
            </button>
            <button onClick={() => { setPage("alumni"); clearFilters(); }} style={{ padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", background: page === "alumni" ? "white" : "transparent", color: page === "alumni" ? "#111827" : "#6B7280", boxShadow: page === "alumni" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
              Alumni
            </button>
          </div>
        </div>
        <button style={{ padding: "8px 16px", background: "#EF4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Logout</button>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* ====== CURRENT FELLOWS PAGE ====== */}
        {page === "fellows" && (
          <>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
              <input placeholder="Search fellows..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: "8px 14px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px", width: "220px" }} />
              <span style={{ color: "#6B7280", fontSize: "13px", marginLeft: "auto" }}>{sampleFellows.length} fellows</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
              {sampleFellows.map(f => (
                <div key={f.id} onClick={() => setSelectedFellow(f)} style={{ background: "white", borderRadius: "10px", padding: "20px", border: "1px solid #E5E7EB", cursor: "pointer", transition: "box-shadow 0.2s", position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "#111827" }}>{f.name}</h3>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600, background: `${statusColors[f.status]}15`, color: statusColors[f.status] }}>{f.status}</span>
                      {f.needsCheckin && <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600, background: "#FEF3C7", color: "#92400E" }}>Needs Check-in</span>}
                    </div>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "14px", color: "#374151" }}>{f.office}</p>
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>Cohort {f.cohort}</span>
                    <span style={{ fontSize: "12px", color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>{f.fellowType.replace("Congressional Innovation ", "")}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: partyColor[f.party] }}>{f.party.charAt(0)}</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>{f.chamber}</span>
                  </div>
                  <div style={{ marginTop: "10px", fontSize: "12px", color: "#9CA3AF" }}>
                    Last check-in: {f.lastCheckin} · Ends: {f.endDate}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ====== ALUMNI PAGE ====== */}
        {page === "alumni" && (
          <>
            {/* Summary stats */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Alumni", value: sampleAlumni.length },
                { label: "Sectors", value: [...new Set(sampleAlumni.map(a => a.sector))].length },
                { label: "Cohorts", value: [...new Set(sampleAlumni.map(a => a.cohort))].length },
              ].map((stat, i) => (
                <div key={i} style={{ background: "white", borderRadius: "10px", padding: "16px 24px", border: "1px solid #E5E7EB", minWidth: "140px" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>{stat.value}</div>
                  <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
              <input placeholder="Search alumni..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: "8px 14px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px", width: "220px" }} />
              {[
                { label: "Cohort", value: cohortFilter, setter: setCohortFilter, options: [...new Set(sampleAlumni.map(a => a.cohort))].sort().reverse() },
                { label: "Fellow Type", value: fellowTypeFilter, setter: setFellowTypeFilter, options: [...new Set(sampleAlumni.map(a => a.fellowType))] },
                { label: "Chamber", value: chamberFilter, setter: setChamberFilter, options: ["Senate", "House"] },
                { label: "Party", value: partyFilter, setter: setPartyFilter, options: ["Democrat", "Republican", "Independent"] },
                { label: "Sector", value: sectorFilter, setter: setSectorFilter, options: ["Government", "Nonprofit", "Academia", "Private", "Policy/Think Tank"] },
              ].map(filter => (
                <select key={filter.label} value={filter.value} onChange={e => filter.setter(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px", color: filter.value === "All" ? "#9CA3AF" : "#111827", background: "white" }}>
                  <option value="All">{filter.label}</option>
                  {filter.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px", background: "white", marginLeft: "auto" }}>
                <option value="cohort-newest">Cohort (newest first)</option>
                <option value="cohort-oldest">Cohort (oldest first)</option>
                <option value="name-az">Name (A-Z)</option>
                <option value="name-za">Name (Z-A)</option>
                <option value="last-engaged">Last Engaged (oldest first)</option>
              </select>
              <span style={{ color: "#6B7280", fontSize: "13px" }}>{filteredAlumni.length} alumni</span>
            </div>

            {/* Alumni cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
              {filteredAlumni.map(alum => (
                <div key={alum.id} onClick={() => setSelectedAlumni(alum)} style={{ background: "white", borderRadius: "10px", padding: "20px", border: "1px solid #E5E7EB", cursor: "pointer", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "#111827" }}>{alum.name}</h3>
                    <a href={alum.linkedin} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#0A66C2", fontSize: "18px", textDecoration: "none", lineHeight: 1 }} title="LinkedIn">in</a>
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#374151" }}>
                    {alum.currentRole} at {alum.currentOrg}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6B7280" }}>
                    {alum.officeServed}
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>Cohort {alum.cohort}</span>
                    <span style={{ fontSize: "12px", color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>{alum.fellowType.replace("Congressional Innovation ", "").replace("Congressional Digital Service ", "").replace("AI Security ", "AI Security ")}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: partyColor[alum.party] }}>{alum.party.charAt(0)}</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>{alum.chamber}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "12px", fontWeight: 500, background: `${sectorColors[alum.sector] || "#6B7280"}15`, color: sectorColors[alum.sector] || "#6B7280" }}>{alum.sector}</span>
                    <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{alum.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ====== ALUMNI MODAL ====== */}
      {selectedAlumni && (
        <div onClick={() => setSelectedAlumni(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "32px", width: "600px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827" }}>{selectedAlumni.name}</h2>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6B7280" }}>Cohort {selectedAlumni.cohort} · {selectedAlumni.fellowType}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ padding: "6px 16px", background: "#2563EB", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Edit</button>
                <button onClick={() => setSelectedAlumni(null)} style={{ padding: "6px 16px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Close</button>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Contact Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "14px", color: "#111827" }}>
                <div><span style={{ color: "#6B7280" }}>Email:</span> {selectedAlumni.email}</div>
                <div><span style={{ color: "#6B7280" }}>Phone:</span> {selectedAlumni.phone}</div>
                <div><span style={{ color: "#6B7280" }}>LinkedIn:</span> <a href={selectedAlumni.linkedin} target="_blank" rel="noreferrer" style={{ color: "#2563EB" }}>Profile</a></div>
                <div><span style={{ color: "#6B7280" }}>Location:</span> {selectedAlumni.location}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Fellowship History</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "14px", color: "#111827" }}>
                <div><span style={{ color: "#6B7280" }}>Office Served:</span> {selectedAlumni.officeServed}</div>
                <div><span style={{ color: "#6B7280" }}>Chamber:</span> {selectedAlumni.chamber}</div>
                <div><span style={{ color: "#6B7280" }}>Party:</span> <span style={{ color: partyColor[selectedAlumni.party], fontWeight: 600 }}>{selectedAlumni.party}</span></div>
                <div><span style={{ color: "#6B7280" }}>Fellow Type:</span> {selectedAlumni.fellowType}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Current Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "14px", color: "#111827" }}>
                <div><span style={{ color: "#6B7280" }}>Role:</span> {selectedAlumni.currentRole}</div>
                <div><span style={{ color: "#6B7280" }}>Organization:</span> {selectedAlumni.currentOrg}</div>
                <div><span style={{ color: "#6B7280" }}>Sector:</span> <span style={{ padding: "1px 8px", borderRadius: "10px", fontSize: "13px", background: `${sectorColors[selectedAlumni.sector] || "#6B7280"}15`, color: sectorColors[selectedAlumni.sector] || "#6B7280" }}>{selectedAlumni.sector}</span></div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Engagement</h3>
              <div style={{ fontSize: "14px", color: "#111827" }}>
                <div style={{ marginBottom: "6px" }}><span style={{ color: "#6B7280" }}>Last Engaged:</span> {selectedAlumni.lastEngaged || "Never"}</div>
                <div><span style={{ color: "#6B7280" }}>Notes:</span> {selectedAlumni.engagementNotes || "No engagement recorded"}</div>
              </div>
            </div>

            {selectedAlumni.notes && (
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Notes</h3>
                <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>{selectedAlumni.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== FELLOW MODAL (simplified for prototype) ====== */}
      {selectedFellow && (
        <div onClick={() => setSelectedFellow(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "32px", width: "600px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827" }}>{selectedFellow.name}</h2>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6B7280" }}>Cohort {selectedFellow.cohort} · {selectedFellow.fellowType}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ padding: "6px 16px", background: "#2563EB", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Edit</button>
                <button style={{ padding: "6px 16px", background: "#7C3AED", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Move to Alumni</button>
                <button onClick={() => setSelectedFellow(null)} style={{ padding: "6px 16px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Close</button>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Placement Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "14px", color: "#111827" }}>
                <div><span style={{ color: "#6B7280" }}>Office:</span> {selectedFellow.office}</div>
                <div><span style={{ color: "#6B7280" }}>Chamber:</span> {selectedFellow.chamber}</div>
                <div><span style={{ color: "#6B7280" }}>Party:</span> <span style={{ color: partyColor[selectedFellow.party], fontWeight: 600 }}>{selectedFellow.party}</span></div>
                <div><span style={{ color: "#6B7280" }}>Status:</span> <span style={{ padding: "1px 8px", borderRadius: "10px", fontSize: "13px", background: `${statusColors[selectedFellow.status]}15`, color: statusColors[selectedFellow.status], fontWeight: 600 }}>{selectedFellow.status}</span></div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Fellowship Period</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "14px", color: "#111827" }}>
                <div><span style={{ color: "#6B7280" }}>End Date:</span> {selectedFellow.endDate}</div>
                <div><span style={{ color: "#6B7280" }}>Last Check-in:</span> {selectedFellow.lastCheckin}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px", background: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 8px" }}>Check-in History</h3>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0, fontStyle: "italic" }}>Check-in history, add/delete functionality shown in full dashboard</p>
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "16px", background: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 8px" }}>Monthly Status Reports</h3>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0, fontStyle: "italic" }}>Status report tracking shown in full dashboard</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}