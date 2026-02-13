import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";

const COLORS = {
  blue: "#3b82f6",
  indigo: "#6366f1",
  teal: "#0891b2",
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  amber: "#d97706",
  slate: "#64748b",
};

// Sample data
const cohortData = [
  { cohort: "2016", fellows: 4, alumni: 4 },
  { cohort: "2017", fellows: 6, alumni: 6 },
  { cohort: "2018", fellows: 8, alumni: 8 },
  { cohort: "2019", fellows: 10, alumni: 10 },
  { cohort: "2020", fellows: 8, alumni: 8 },
  { cohort: "2021", fellows: 12, alumni: 12 },
  { cohort: "2022", fellows: 14, alumni: 14 },
  { cohort: "2023", fellows: 16, alumni: 16 },
  { cohort: "2024", fellows: 18, alumni: 15 },
  { cohort: "2025", fellows: 20, alumni: 0 },
];

const sectorData = [
  { name: "Government", value: 35, color: "#3b82f6" },
  { name: "Private", value: 28, color: "#f97316" },
  { name: "Nonprofit", value: 18, color: "#22c55e" },
  { name: "Academia", value: 10, color: "#8b5cf6" },
  { name: "Policy/Think Tank", value: 9, color: "#ec4899" },
];

const partyData = [
  { name: "Democrat", value: 52, color: "#3b82f6" },
  { name: "Republican", value: 38, color: "#ef4444" },
  { name: "Independent", value: 6, color: "#8b5cf6" },
  { name: "Executive Branch", value: 4, color: "#94a3b8" },
];

const chamberData = [
  { name: "Senate", value: 55, color: "#6366f1" },
  { name: "House", value: 38, color: "#0891b2" },
  { name: "Executive Branch", value: 7, color: "#94a3b8" },
];

const fellowTypeData = [
  { name: "CIF", value: 68, color: "#93c5fd" },
  { name: "Senior CIF", value: 20, color: "#6366f1" },
  { name: "CIS", value: 5, color: "#059669" },
  { name: "CDSF", value: 3, color: "#d97706" },
  { name: "AISF", value: 4, color: "#0891b2" },
];

const engagementTrend = [
  { month: "Sep 25", engagements: 8 },
  { month: "Oct 25", engagements: 12 },
  { month: "Nov 25", engagements: 6 },
  { month: "Dec 25", engagements: 15 },
  { month: "Jan 26", engagements: 20 },
  { month: "Feb 26", engagements: 11 },
];

const checkinTrend = [
  { month: "Sep 25", checkins: 22 },
  { month: "Oct 25", checkins: 18 },
  { month: "Nov 25", checkins: 25 },
  { month: "Dec 25", checkins: 14 },
  { month: "Jan 26", checkins: 28 },
  { month: "Feb 26", checkins: 19 },
];

const topOrgs = [
  { org: "Google", count: 5 },
  { org: "Senate Commerce Cmte", count: 4 },
  { org: "OSTP", count: 3 },
  { org: "Meta", count: 3 },
  { org: "Brookings Institution", count: 3 },
  { org: "Microsoft", count: 2 },
  { org: "RAND Corporation", count: 2 },
  { org: "Georgetown University", count: 2 },
];

function StatCard({ label, value, subtitle, color = "#3b82f6" }) {
  return (
    <div style={{
      background: "white",
      padding: "1.25rem",
      borderRadius: "0.75rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 700, color }}>{value}</div>
      {subtitle && <div style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "0.25rem" }}>{subtitle}</div>}
    </div>
  );
}

function ChartCard({ title, children, span = 1 }) {
  return (
    <div style={{
      background: "white",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      gridColumn: `span ${span}`,
    }}>
      <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1f2937", marginBottom: "1rem" }}>{title}</div>
      {children}
    </div>
  );
}

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
      {name} ({value})
    </text>
  );
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "fellows", label: "Current Fellows" },
    { id: "alumni", label: "Alumni" },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "2rem", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1f2937", margin: 0 }}>Analytics</h1>
      </div>
      <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Insights across fellows and alumni</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "0" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#3b82f6" : "#6b7280",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
              cursor: "pointer",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Top Stats */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <StatCard label="Total Fellows (All Time)" value="116" subtitle="Across 10 cohorts" />
            <StatCard label="Current Fellows" value="20" subtitle="2025 cohort" color="#22c55e" />
            <StatCard label="Alumni Network" value="96" subtitle="Across 5 sectors" color="#6366f1" />
            <StatCard label="Offices Served" value="84" subtitle="Senate, House & Executive" color="#0891b2" />
          </div>

          {/* Charts Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {/* Fellows by Cohort */}
            <ChartCard title="Fellows by Cohort" span={2}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={cohortData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="cohort" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  <Legend />
                  <Bar dataKey="fellows" name="Total Fellows" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="alumni" name="Now Alumni" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Party Breakdown */}
            <ChartCard title="Party Breakdown (All Time)">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={partyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={CustomPieLabel}
                  >
                    {partyData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Chamber Breakdown */}
            <ChartCard title="Chamber Breakdown (All Time)">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chamberData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={CustomPieLabel}
                  >
                    {chamberData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Fellow Types */}
            <ChartCard title="Fellow Types (All Time)">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={fellowTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#6b7280" }} width={70} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="value" name="Fellows" radius={[0, 4, 4, 0]}>
                    {fellowTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Check-in Trend */}
            <ChartCard title="Fellow Check-ins (Last 6 Months)">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={checkinTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  <Line type="monotone" dataKey="checkins" name="Check-ins" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Current Fellows Tab */}
      {activeTab === "fellows" && (
        <div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <StatCard label="Total Current" value="20" color="#22c55e" />
            <StatCard label="Active" value="16" color="#22c55e" />
            <StatCard label="Flagged" value="2" color="#eab308" />
            <StatCard label="Ending Soon" value="2" color="#f97316" />
            <StatCard label="Needs Check-in" value="3" color="#ef4444" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Party split for current */}
            <ChartCard title="Current Fellows by Party">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Democrat", value: 11, color: "#3b82f6" },
                      { name: "Republican", value: 6, color: "#ef4444" },
                      { name: "Independent", value: 1, color: "#8b5cf6" },
                      { name: "Executive Branch", value: 2, color: "#94a3b8" },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={CustomPieLabel}
                  >
                    {[
                      { color: "#3b82f6" },
                      { color: "#ef4444" },
                      { color: "#8b5cf6" },
                      { color: "#94a3b8" },
                    ].map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Chamber split for current */}
            <ChartCard title="Current Fellows by Chamber">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Senate", value: 11, color: "#6366f1" },
                      { name: "House", value: 7, color: "#0891b2" },
                      { name: "Executive Branch", value: 2, color: "#94a3b8" },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={CustomPieLabel}
                  >
                    {[
                      { color: "#6366f1" },
                      { color: "#0891b2" },
                      { color: "#94a3b8" },
                    ].map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Check-in frequency */}
            <ChartCard title="Check-in Frequency (Last 6 Months)" span={2}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={checkinTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="checkins" name="Check-ins" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Monthly report compliance */}
            <ChartCard title="Monthly Report Compliance" span={2}>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1rem 0" }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#22c55e" }}>85%</div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>On-time submission rate</div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#f97316" }}>4.2</div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Avg streak length</div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#3b82f6" }}>6</div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Gift cards earned</div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#ef4444" }}>2</div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Reimbursements paused</div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Alumni Tab */}
      {activeTab === "alumni" && (
        <div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <StatCard label="Total Alumni" value="96" color="#6366f1" />
            <StatCard label="Government" value="35" subtitle="36%" color="#3b82f6" />
            <StatCard label="Private" value="28" subtitle="29%" color="#f97316" />
            <StatCard label="Nonprofit / Academia" value="28" subtitle="29%" color="#22c55e" />
            <StatCard label="Policy / Think Tank" value="9" subtitle="9%" color="#ec4899" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Sector Distribution */}
            <ChartCard title="Alumni by Sector">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={CustomPieLabel}
                  >
                    {sectorData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Top Organizations */}
            <ChartCard title="Top Organizations (Alumni)">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {topOrgs.map((org, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ flex: 1, fontSize: "0.875rem", color: "#374151" }}>{org.org}</div>
                    <div style={{
                      width: `${(org.count / 5) * 120}px`,
                      height: "20px",
                      backgroundColor: "#3b82f6",
                      borderRadius: "4px",
                      minWidth: "20px",
                    }} />
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1f2937", width: "20px", textAlign: "right" }}>{org.count}</div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Alumni Engagement Trend */}
            <ChartCard title="Alumni Engagements (Last 6 Months)" span={2}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={engagementTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  <Line type="monotone" dataKey="engagements" name="Engagements" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Alumni by Cohort */}
            <ChartCard title="Alumni by Original Cohort" span={2}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cohortData.filter(d => d.alumni > 0)} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="cohort" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="alumni" name="Alumni" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}
