import React from 'react';
import './App.css';

function RunInfoModal({ runInfo, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title">Run info</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
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
      </div>
    </div>
  );
}

export default RunInfoModal;
