import React from 'react';
import './App.css';

export function StatusCard({ progress, runInfo }) {
  // Calcular porcentajes reales desde runInfo si está disponible
  let percentPassed = progress;
  let percentFailed = 100 - progress;
  if (runInfo && runInfo.length === 3) {
    const total = Number(runInfo[0].value) || 0;
    const passedVal = Number(runInfo[1].value) || 0;
    const failedVal = Number(runInfo[2].value) || 0;
    percentPassed = total > 0 ? (passedVal / total) * 100 : 0;
    percentFailed = total > 0 ? (failedVal / total) * 100 : 0;
  }
  // Cálculo para los arcos
  // Ajustar radio y stroke para que el donut se aprecie completo
  const donutStroke = 28;
  const r = 55;
  const c = 2 * Math.PI * r;
  const passedLen = c * (percentPassed / 100);
  const failedLen = c * (percentFailed / 100);

  // Estado para tooltip dinámico
  const [hovered, setHovered] = React.useState(null); // 'passed' | 'failed' | null

  // Posición del tooltip (centrado en el círculo)
  const tooltipStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    color: '#222',
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '6px 14px',
    fontWeight: 600,
    fontSize: 16,
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    zIndex: 2,
    minWidth: 80,
    textAlign: 'center',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.2s',
  };

  return (
    <section className="dashboard-card status-card" style={{maxWidth: '340px', minWidth: '280px'}}>
      <div className="dashboard-status-title">Status</div>
      <div className="dashboard-status-legend">
        <span className="legend-passed"><span className="legend-color legend-passed-color"></span>Passed</span>
        <span className="legend-failed"><span className="legend-color legend-failed-color"></span>Failed</span>
      </div>
      <div className="dashboard-donut" style={{position: 'relative', width: 150, height: 150, margin: '0 auto'}}>
        <svg width="150" height="150">
          <circle
            cx="75" cy="75" r={r}
            stroke="#e6e6e6" strokeWidth={donutStroke} fill="none"
          />
          {/* Passed arc */}
          {percentPassed > 0 && (
            <circle
              cx="75" cy="75" r={r}
              stroke="#1ec773"
              strokeWidth={donutStroke}
              fill="none"
              strokeDasharray={`${passedLen} ${c - passedLen}`}
              strokeDashoffset={0}
              style={{ transition: 'stroke-dasharray 0.7s', cursor: 'pointer' }}
              onMouseEnter={() => setHovered('passed')}
              onMouseLeave={() => setHovered(null)}
            />
          )}
          {/* Failed arc */}
          {percentFailed > 0 && (
            <circle
              cx="75" cy="75" r={r}
              stroke="#ec0000"
              strokeWidth={donutStroke}
              fill="none"
              strokeDasharray={`${failedLen} ${c - failedLen}`}
              strokeDashoffset={-passedLen}
              style={{ transition: 'stroke-dasharray 0.7s', cursor: 'pointer' }}
              onMouseEnter={() => setHovered('failed')}
              onMouseLeave={() => setHovered(null)}
            />
          )}
        </svg>
        {/* Tooltip dinámico */}
        {hovered === 'passed' && (
          <div style={{...tooltipStyle, color: '#1ec773', borderColor: '#1ec773'}}>
            Passed<br />{percentPassed.toFixed(2)} %
          </div>
        )}
        {hovered === 'failed' && (
          <div style={{...tooltipStyle, color: '#ec0000', borderColor: '#ec0000'}}>
            Failed<br />{percentFailed.toFixed(2)} %
          </div>
        )}
      </div>
      <div className="dashboard-status-legend-bottom">
        <div className="dashboard-status-legend-row">
          <span className="legend-dot legend-dot-passed">✔</span>
          <span className="legend-label">Passed</span>
          <span className="legend-value">{percentPassed.toFixed(2)} %</span>
        </div>
        <div className="dashboard-status-legend-row">
          <span className="legend-dot legend-dot-failed">&#9888;</span>
          <span className="legend-label">Failed</span>
          <span className="legend-value">{percentFailed.toFixed(2)} %</span>
        </div>
      </div>
    </section>
  );
}

export function RunInfoCard({ runInfo }) {
  // Labels de la imagen adjunta
  const infoLabels = [
    'Total samples:',
    'Samples passed:',
    'Samples failed:',
    'Time mean response (ms):',
    'Time median response (ms):',
    'Time min response (ms):',
    'Time max response (ms):',
    'Throughput - tps:',
    'Sent KBytes per sec:',
    'Received KBytes per sec:',
    'Start time:',
    'End time:',
    'Duration (s):',
  ];
  // Mapear runInfo a objeto para acceso rápido (permitir con o sin dos puntos)
  const runInfoMap = {};
  runInfo.forEach(r => {
    runInfoMap[r.label] = r.value;
    if (!r.label.endsWith(':')) runInfoMap[r.label + ':'] = r.value;
  });
  // Usar exactamente el mismo tamaño que StatusCard (340x470px, paddings iguales)
  // Unificar estilos de letra con StatusCard
  return (
    <section className="dashboard-card runinfo-card" style={{width: 340, height: 470, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '32px 0 24px 0', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: 16, color: '#222'}}>
      <div className="dashboard-status-title" style={{fontWeight: 700, textAlign: 'left', width: '90%', margin: '0 auto 18px auto', fontSize: 24}}>Run info</div>
      <div style={{flex: 1, overflowY: 'auto', width: '90%'}}>
        <table className="dashboard-table" style={{width: '100%', fontSize: 16, color: '#222'}}>
          <tbody>
            {infoLabels.map((label, i) => (
              <tr key={i}>
                <td style={{padding: '4px 0'}}>{label}</td>
                <td style={{padding: '4px 0', textAlign: 'right'}}>{runInfoMap[label] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
