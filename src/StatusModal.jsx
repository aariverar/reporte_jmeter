import React from 'react';
import './App.css';

function StatusModal({ status, progress, passed, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title">Status</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="dashboard-donut" style={{ margin: '0 auto' }}>
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
            <span className="dashboard-status-value">{passed ? 'Passed' : 'Failed'}</span>
          </div>
          <div className="dashboard-status-row">
            <span>Progress</span>
            <span className="dashboard-status-value">{progress.toFixed(1)} %</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusModal;
