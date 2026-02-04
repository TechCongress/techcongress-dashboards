import React, { useState, useMemo } from 'react';
import {
  Search, Filter, AlertTriangle, Clock, CheckCircle, User, Calendar,
  ChevronDown, Bell, Users, Building2, Mail, Phone, Linkedin,
  ExternalLink, Edit
} from 'lucide-react';

// ============ SAMPLE DATA ============
// This will be replaced with Airtable data
const fellowsData = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "schen@techcongress.io",
    phone: "(415) 555-0101",
    fellowType: "Congressional Innovation Fellow",
    party: "Democrat",
    office: "Sen. Maria Cantwell (D-WA)",
    chamber: "Senate",
    linkedin: "https://linkedin.com/in/sarahchen",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "on-track",
    lastCheckIn: "2026-01-15",
    priorRole: "ML Engineer at Google",
    education: "PhD Computer Science, Stanford",
    notes: ""
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "mjohnson@techcongress.io",
    phone: "(202) 555-0102",
    fellowType: "Congressional Innovation Fellow",
    party: "Democrat",
    office: "Rep. Ro Khanna (D-CA)",
    chamber: "House",
    linkedin: "https://linkedin.com/in/marcusjohnson",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "on-track",
    lastCheckIn: "2025-12-01",
    priorRole: "Security Researcher at MITRE",
    education: "MS Cybersecurity, Georgia Tech",
    notes: ""
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "erodriguez@techcongress.io",
    phone: "(650) 555-0103",
    fellowType: "Senior Congressional Innovation Fellow",
    party: "Democrat",
    office: "Senate Commerce Committee",
    chamber: "Senate",
    linkedin: "https://linkedin.com/in/emilyrodriguez",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "flagged",
    lastCheckIn: "2026-01-20",
    priorRole: "Policy Analyst at Meta",
    education: "JD/MBA, Harvard",
    notes: "Requested placement change discussion"
  },
  {
    id: 4,
    name: "David Park",
    email: "dpark@techcongress.io",
    phone: "(510) 555-0104",
    fellowType: "Congressional Innovation Fellow",
    party: "Republican",
    office: "Rep. Jay Obernolte (R-CA)",
    chamber: "House",
    linkedin: "https://linkedin.com/in/davidpark",
    startDate: "2025-01-01",
    endDate: "2026-06-30",
    cohort: "2025",
    status: "ending-soon",
    lastCheckIn: "2026-01-25",
    priorRole: "Quantum Computing Researcher at IBM",
    education: "PhD Physics, Caltech",
    notes: "Exploring extension options"
  },
  {
    id: 5,
    name: "Aisha Patel",
    email: "apatel@techcongress.io",
    phone: "(312) 555-0105",
    fellowType: "Congressional Innovation Fellow",
    party: "Democrat",
    office: "House Energy & Commerce Committee",
    chamber: "House",
    linkedin: "https://linkedin.com/in/aishapatel",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "on-track",
    lastCheckIn: "2026-01-28",
    priorRole: "Product Manager at Apple",
    education: "MS HCI, Carnegie Mellon",
    notes: ""
  },
  {
    id: 6,
    name: "James Wilson",
    email: "jwilson@techcongress.io",
    phone: "(703) 555-0106",
    fellowType: "Senior Congressional Innovation Fellow",
    party: "Republican",
    office: "Sen. Todd Young (R-IN)",
    chamber: "Senate",
    linkedin: "https://linkedin.com/in/jameswilson",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "on-track",
    lastCheckIn: "2026-01-22",
    priorRole: "NSA Cybersecurity Analyst",
    education: "MS Computer Science, MIT",
    notes: ""
  },
  {
    id: 7,
    name: "Michael Torres",
    email: "mtorres@techcongress.io",
    phone: "(206) 555-0108",
    fellowType: "Congressional Innovation Fellow",
    party: "Democrat",
    office: "Rep. Suzan DelBene (D-WA)",
    chamber: "House",
    linkedin: "https://linkedin.com/in/michaeltorres",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "on-track",
    lastCheckIn: "2025-12-10",
    priorRole: "Trade Policy Analyst at USTR",
    education: "MPP, Georgetown",
    notes: ""
  },
  {
    id: 8,
    name: "Rachel Kim",
    email: "rkim@techcongress.io",
    phone: "(617) 555-0109",
    fellowType: "Congressional Innovation Fellow",
    party: "Democrat",
    office: "House Science Committee",
    chamber: "House",
    linkedin: "https://linkedin.com/in/rachelkim",
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    cohort: "2025",
    status: "on-track",
    lastCheckIn: "2026-01-30",
    priorRole: "Research Scientist at OpenAI",
    education: "PhD AI, UC Berkeley",
    notes: ""
  }
];

// ============ CONFIG ============
const allCohorts = [...new Set(fellowsData.map(f => f.cohort))].sort((a, b) => b.localeCompare(a));

const statusConfig = {
  'on-track': { label: 'On Track', color: 'bg-green-100 text-green-800', icon: CheckCircle, priority: 2 },
  'flagged': { label: 'Flagged', color: 'bg-red-100 text-red-800', icon: AlertTriangle, priority: 0 },
  'ending-soon': { label: 'Ending Soon', color: 'bg-orange-100 text-orange-800', icon: Clock, priority: 1 }
};

const partyConfig = {
  'Democrat': { color: 'bg-blue-100 text-blue-700' },
  'Republican': { color: 'bg-red-100 text-red-700' },
  'Independent': { color: 'bg-purple-100 text-purple-700' }
};

const fellowTypeConfig = {
  'Senior Congressional Innovation Fellow': { label: 'Senior CIF', color: 'bg-indigo-100 text-indigo-700' },
  'Congressional Innovation Fellow': { label: 'CIF', color: 'bg-slate-100 text-slate-700' }
};

// ============ COMPONENTS ============

function StatCard({ icon: Icon, label, value, subtext, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color || 'text-gray-900'}`}>{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color ? color.replace('text-', 'bg-').replace('-600', '-100').replace('-800', '-100') : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${color || 'text-gray-600'}`} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}

function PartyBadge({ party }) {
  const config = partyConfig[party];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {party}
    </span>
  );
}

function FellowTypeBadge({ fellowType }) {
  const config = fellowTypeConfig[fellowType];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function NeedsCheckInBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Bell className="w-3 h-3" />
      Needs Check-in
    </span>
  );
}

function FellowCard({ fellow, onClick }) {
  const daysUntilEnd = Math.ceil((new Date(fellow.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const daysSinceCheckIn = Math.ceil((new Date() - new Date(fellow.lastCheckIn)) / (1000 * 60 * 60 * 24));
  const needsCheckIn = daysSinceCheckIn > 30;

  return (
    <div
      onClick={() => onClick(fellow)}
      className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-all hover:shadow-md hover:border-blue-200 ${
        fellow.status === 'flagged' ? 'border-l-4 border-l-red-500' :
        fellow.status === 'ending-soon' ? 'border-l-4 border-l-orange-500' :
        needsCheckIn ? 'border-l-4 border-l-yellow-500' :
        'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {fellow.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{fellow.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500">Cohort {fellow.cohort}</span>
              <FellowTypeBadge fellowType={fellow.fellowType} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={fellow.status} />
          {needsCheckIn && fellow.status === 'on-track' && <NeedsCheckInBadge />}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span>{fellow.office}</span>
          <PartyBadge party={fellow.party} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(fellow.startDate).toLocaleDateString()} - {new Date(fellow.endDate).toLocaleDateString()}</span>
          {daysUntilEnd > 0 && daysUntilEnd <= 90 && (
            <span className="text-orange-600 font-medium">({daysUntilEnd} days left)</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Last check-in: {new Date(fellow.lastCheckIn).toLocaleDateString()}</span>
          {needsCheckIn && (
            <span className="text-yellow-600 font-medium">({daysSinceCheckIn} days ago)</span>
          )}
        </div>
      </div>

      {fellow.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">"{fellow.notes}"</p>
        </div>
      )}
    </div>
  );
}

function FellowModal({ fellow, onClose }) {
  if (!fellow) return null;

  const duration = Math.round((new Date(fellow.endDate) - new Date(fellow.startDate)) / (1000 * 60 * 60 * 24 * 30));
  const daysSinceCheckIn = Math.ceil((new Date() - new Date(fellow.lastCheckIn)) / (1000 * 60 * 60 * 24));
  const needsCheckIn = daysSinceCheckIn > 30;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                {fellow.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{fellow.name}</h2>
                <p className="text-gray-500">Cohort {fellow.cohort} • {duration} month fellowship</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={fellow.status} />
            {needsCheckIn && fellow.status === 'on-track' && <NeedsCheckInBadge />}
            <FellowTypeBadge fellowType={fellow.fellowType} />
            <PartyBadge party={fellow.party} />
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href={`mailto:${fellow.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                <Mail className="w-4 h-4" /> {fellow.email}
              </a>
              <a href={`tel:${fellow.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                <Phone className="w-4 h-4" /> {fellow.phone}
              </a>
              {fellow.linkedin && (
                <a href={fellow.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Fellow Type</h4>
              <p className="text-gray-900">{fellow.fellowType}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Placement</h4>
              <p className="text-gray-900 font-medium">{fellow.office}</p>
              <p className="text-sm text-gray-500">{fellow.chamber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Fellowship Period</h4>
              <p className="text-gray-900">{new Date(fellow.startDate).toLocaleDateString()} - {new Date(fellow.endDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{duration} months</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Prior Role</h4>
              <p className="text-gray-900">{fellow.priorRole}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Education</h4>
              <p className="text-gray-900">{fellow.education}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Last Check-in</h4>
              <p className={`text-gray-900 ${needsCheckIn ? 'text-yellow-600 font-medium' : ''}`}>
                {new Date(fellow.lastCheckIn).toLocaleDateString()}
                {needsCheckIn && ` (${daysSinceCheckIn} days ago)`}
              </p>
            </div>
          </div>

          {fellow.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{fellow.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Check-in
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Fellow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN DASHBOARD ============

export default function FellowshipDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [chamberFilter, setChamberFilter] = useState('all');
  const [partyFilter, setPartyFilter] = useState('all');
  const [fellowTypeFilter, setFellowTypeFilter] = useState('all');
  const [selectedFellow, setSelectedFellow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter fellows
  const filteredFellows = useMemo(() => {
    return fellowsData
      .filter(fellow => {
        const matchesSearch = searchTerm === '' ||
          fellow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fellow.office.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || fellow.status === statusFilter;
        const matchesCohort = cohortFilter === 'all' || fellow.cohort === cohortFilter;
        const matchesChamber = chamberFilter === 'all' || fellow.chamber === chamberFilter;
        const matchesParty = partyFilter === 'all' || fellow.party === partyFilter;
        const matchesFellowType = fellowTypeFilter === 'all' || fellow.fellowType === fellowTypeFilter;
        return matchesSearch && matchesStatus && matchesCohort && matchesChamber && matchesParty && matchesFellowType;
      })
      .sort((a, b) => {
        // Sort by status priority, then by needs check-in
        const aPriority = statusConfig[a.status]?.priority ?? 99;
        const bPriority = statusConfig[b.status]?.priority ?? 99;
        if (aPriority !== bPriority) return aPriority - bPriority;

        // Secondary sort: needs check-in
        const aDaysSince = Math.ceil((new Date() - new Date(a.lastCheckIn)) / (1000 * 60 * 60 * 24));
        const bDaysSince = Math.ceil((new Date() - new Date(b.lastCheckIn)) / (1000 * 60 * 60 * 24));
        return bDaysSince - aDaysSince;
      });
  }, [searchTerm, statusFilter, cohortFilter, chamberFilter, partyFilter, fellowTypeFilter]);

  // Stats
  const stats = useMemo(() => {
    const needsCheckInCount = fellowsData.filter(f => {
      const daysSince = Math.ceil((new Date() - new Date(f.lastCheckIn)) / (1000 * 60 * 60 * 24));
      return daysSince > 30 && f.status === 'on-track';
    }).length;

    return {
      total: fellowsData.length,
      onTrack: fellowsData.filter(f => f.status === 'on-track').length,
      flagged: fellowsData.filter(f => f.status === 'flagged').length,
      endingSoon: fellowsData.filter(f => f.status === 'ending-soon').length,
      needsCheckIn: needsCheckInCount
    };
  }, []);

  const clearFilters = () => {
    setStatusFilter('all');
    setCohortFilter('all');
    setChamberFilter('all');
    setPartyFilter('all');
    setFellowTypeFilter('all');
    setSearchTerm('');
  };

  const hasActiveFilters = statusFilter !== 'all' ||
    cohortFilter !== 'all' || chamberFilter !== 'all' || partyFilter !== 'all' ||
    fellowTypeFilter !== 'all' || searchTerm;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TechCongress Fellows Dashboard</h1>
              <p className="text-sm text-gray-500">Monitor and manage current fellow placements</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Add Fellow
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Users} label="Total Fellows" value={stats.total} subtext="Currently placed" color="text-blue-600" />
          <StatCard icon={CheckCircle} label="On Track" value={stats.onTrack} subtext="No issues" color="text-green-600" />
          <StatCard icon={Bell} label="Needs Check-in" value={stats.needsCheckIn} subtext="30+ days since contact" color="text-yellow-600" />
          <StatCard icon={AlertTriangle} label="Flagged" value={stats.flagged} subtext="Needs attention" color="text-red-600" />
          <StatCard icon={Clock} label="Ending Soon" value={stats.endingSoon} subtext="Within 90 days" color="text-orange-600" />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or office..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <div className={`flex flex-col lg:flex-row gap-3 ${showFilters ? '' : 'hidden lg:flex'}`}>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Statuses</option>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select value={fellowTypeFilter} onChange={(e) => setFellowTypeFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Fellow Types</option>
                <option value="Senior Congressional Innovation Fellow">Senior CIF</option>
                <option value="Congressional Innovation Fellow">CIF</option>
              </select>
              <select value={partyFilter} onChange={(e) => setPartyFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Parties</option>
                <option value="Democrat">Democrat</option>
                <option value="Republican">Republican</option>
                <option value="Independent">Independent</option>
              </select>
              <select value={chamberFilter} onChange={(e) => setChamberFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Chambers</option>
                <option value="Senate">Senate</option>
                <option value="House">House</option>
              </select>
              <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Cohorts</option>
                {allCohorts.map(cohort => (
                  <option key={cohort} value={cohort}>{cohort}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">Showing {filteredFellows.length} of {fellowsData.length} fellows</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Clear all filters</button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFellows.map(fellow => (
            <FellowCard key={fellow.id} fellow={fellow} onClick={setSelectedFellow} />
          ))}
        </div>

        {filteredFellows.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No fellows found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Fellow Detail Modal */}
      <FellowModal fellow={selectedFellow} onClose={() => setSelectedFellow(null)} />
    </div>
  );
}
