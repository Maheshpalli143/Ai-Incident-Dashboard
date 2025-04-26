import React, { useState } from 'react';

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string;
}

const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics...",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information...",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z"
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata...",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z"
  }
];

function IncidentDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filter, setFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest'>('Newest');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id' | 'reported_at'>>({
    title: '',
    description: '',
    severity: 'Low'
  });

  const handleToggleDetails = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleAddIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) {
      alert('Title and Description are required.');
      return;
    }
    const newEntry: Incident = {
      id: Date.now(),
      ...newIncident,
      reported_at: new Date().toISOString()
    };
    setIncidents([newEntry, ...incidents]);
    setNewIncident({ title: '', description: '', severity: 'Low' });
  };

  const filteredIncidents = incidents.filter((incident) => 
    filter === 'All' || incident.severity === filter
  );

  const sortedIncidents = filteredIncidents.sort((a, b) => {
    if (sortOrder === 'Newest') {
      return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime();
    } else {
      return new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime();
    }
  });

  return (
    <div className="dashboard">
      <div className="controls">
        <label>
          Filter by Severity:
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Sort by Date:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </label>
      </div>

      <ul className="incident-list">
        {sortedIncidents.map((incident) => (
          <li key={incident.id} className="incident-item">
            <div className="incident-header">
              <strong>{incident.title}</strong> ({incident.severity}) - {new Date(incident.reported_at).toLocaleDateString()}
              <button onClick={() => handleToggleDetails(incident.id)}>
                {expandedIds.includes(incident.id) ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            {expandedIds.includes(incident.id) && (
              <p className="incident-description">{incident.description}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="new-incident-form">
        <h2>Report New Incident</h2>
        <form onSubmit={handleAddIncident}>
          <input
            type="text"
            placeholder="Title"
            value={newIncident.title}
            onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
          />
          <textarea
            placeholder="Description"
            value={newIncident.description}
            onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
          ></textarea>
          <select
            value={newIncident.severity}
            onChange={(e) => setNewIncident({...newIncident, severity: e.target.value as any})}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button type="submit">Submit Incident</button>
        </form>
      </div>
    </div>
  );
}

export default IncidentDashboard;
