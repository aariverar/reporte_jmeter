import React from 'react';
import './App.css';

function DashboardView({ data }) {
  // data: { status, progress, qualityGates, runInfo }
  // Para demo, usar datos mock si no se pasan props
  const status = data?.status || 'AAA';
  const progress = data?.progress || 100;
  const passed = data?.passed ?? true;
  const qualityGates = data?.qualityGates || [
    { kpi: 'Time mean response', value: 1800, status: true },
    { kpi: 'Errors percent', value: 2.5, status: true },
  ];
  const runInfo = data?.runInfo || [
    { label: 'Total samples', value: 99 },
    { label: 'Samples passed', value: 99 },
    { label: 'Samples failed', value: 0 },
    { label: 'Time mean response (ms)', value: '99,51' },
    { label: 'Time median response (ms)', value: '76,0' },
    { label: 'Time min response (ms)', value: '55,0' },
    { label: 'Time max response (ms)', value: '1213,0' },
    { label: 'Throughput - tps', value: 12 },
    { label: 'Sent KBytes per sec', value: '8,23' },
    { label: 'Received KBytes per sec', value: '16,22' },
    { label: 'Start time', value: '2025-07-31 16:29:57' },
    { label: 'End time', value: '2025-07-31 16:30:07' },
    { label: 'Duration (s)', value: '9,85' },
    { label: 'Application', value: 'demo' },
    { label: 'Business area', value: 'demo' },
    { label: 'Entity', value: 'demo' },
    { label: 'User', value: '' },
    { label: 'Version', value: '1.3.0' },
    { label: 'Operating System', value: '' },
    { label: 'Hostname', value: '' },
    { label: 'Engine', value: 'Jmeter' },
    { label: 'Execution Command', value: 'Show Execution Command' },
  ];

  return (
    <div className="dashboard-flex">
      <section className="dashboard-card status-card">
        <div className="dashboard-donut">
          <svg width="160" height="160">
            <circle
              cx="80" cy="80" r="70"
              stroke="#e6e6e6" strokeWidth="16" fill="none"
            />
            <circle
              cx="80" cy="80" r="70"
              stroke={passed ? '#1ec773' : '#ec0000'}
              strokeWidth="16"
              fill="none"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.7s' }}
            />
            <text x="50%" y="54%" textAnchor="middle" fontSize="2.5rem" fontWeight="bold" fill="#888">{status}</text>
          </svg>
        </div>
        <div className="dashboard-status-labels">
          <div className="dashboard-status-row">
            <span className="dashboard-status-dot passed"></span>
            <span>Status</span>
            <span className="dashboard-status-value">Passed</span>
          </div>
          <div className="dashboard-status-row">
            <span className="dashboard-status-dot failed"></span>
            <span>Failed</span>
            <span className="dashboard-status-value">0.0 %</span>
          </div>
          <div className="dashboard-status-row">
            <span>Progress</span>
            <span className="dashboard-status-value">100.0 %</span>
          </div>
        </div>
      </section>
      <section className="dashboard-card quality-card">
        <div className="dashboard-card-title">Quality gates</div>
        <table className="dashboard-table">
          <thead>
            <tr><th>KPI</th><th>Value</th><th>Status</th></tr>
          </thead>
          <tbody>
            {qualityGates.map((q, i) => (
              <tr key={i}>
                <td>{q.kpi}</td>
                <td>{q.value}</td>
                <td>{q.status ? '✔️' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="dashboard-card runinfo-card">
        <div className="dashboard-card-title">Run info</div>
        <table className="dashboard-table">
          <tbody>
            {runInfo.map((r, i) => (
              <tr key={i}>
                <td>{r.label}</td>
                <td>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default DashboardView;
