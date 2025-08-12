

import React, { useRef, useState } from 'react';

import { StatusCard, RunInfoCard } from './Widgets';
import Papa from 'papaparse';
import './App.css';


function App() {
  const fileInput = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('upload'); // 'upload' | 'status' | 'runinfo'
  const [statusData, setStatusData] = useState({ status: 'AAA', progress: 100, passed: true });
  const [runInfo, setRunInfo] = useState([]);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Solo se permiten archivos .csv');
      return;
    }
    setFileName(file.name);
    setUploading(true);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data;
            const total = rows.length;
            const passed = rows.filter(r => {
              const values = [r['success'], r['Success'], r['status'], r['Status'], r['responseMessage']]
                .map(v => (v || '').toString().toLowerCase());
              return values.some(val => val === 'true' || val === 'ok');
            }).length;
            const failed = total - passed;
            const status = failed === 0 ? 'AAA' : 'ERR';
            const progress = total > 0 ? (passed / total) * 100 : 0;
            // Calcular promedio de elapsed
            let meanElapsed = '';
            let medianElapsed = '';
            let minElapsed = '';
            let maxElapsed = '';
            let elapsedVals = [];
            if (rows.length > 0 && rows[0].elapsed !== undefined) {
              elapsedVals = rows.map(r => Number(r.elapsed)).filter(v => !isNaN(v));
              if (elapsedVals.length > 0) {
                // Media
                meanElapsed = (elapsedVals.reduce((a, b) => a + b, 0) / elapsedVals.length).toFixed(2);
                // Mediana
                const sorted = [...elapsedVals].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                if (sorted.length % 2 === 0) {
                  medianElapsed = ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
                } else {
                  medianElapsed = sorted[mid].toFixed(2);
                }
                // Mínimo
                minElapsed = Math.min(...elapsedVals).toFixed(2);
                // Máximo
                maxElapsed = Math.max(...elapsedVals).toFixed(2);
              }
            }
            // Calcular duración en segundos
            let durationS = '';
            if (rows.length > 0 && rows[0].timeStamp !== undefined) {
              // Buscar el menor y mayor timestamp
              const timeStamps = rows.map(r => Number(r.timeStamp)).filter(v => !isNaN(v));
              if (timeStamps.length > 0) {
                const minTS = Math.min(...timeStamps);
                const maxTS = Math.max(...timeStamps);
                durationS = ((maxTS - minTS) / 1000).toFixed(2);
              }
            }
            // Calcular Throughput - tps
            let throughput = '';
            if (total > 0 && durationS && !isNaN(Number(durationS)) && Number(durationS) > 0) {
              throughput = (total / Number(durationS)).toFixed(2);
            }
            // Calcular Sent KBytes per sec
            let sentKBytesPerSec = '';
            if (rows.length > 0 && rows[0].sentBytes !== undefined && durationS && !isNaN(Number(durationS)) && Number(durationS) > 0) {
              const sentBytesVals = rows.map(r => Number(r.sentBytes)).filter(v => !isNaN(v));
              if (sentBytesVals.length > 0) {
                const totalSentBytes = sentBytesVals.reduce((a, b) => a + b, 0);
                sentKBytesPerSec = ((totalSentBytes / 1024) / Number(durationS)).toFixed(2);
              }
            }
            // Calcular Received KBytes per sec
            let receivedKBytesPerSec = '';
            if (rows.length > 0 && rows[0].bytes !== undefined && durationS && !isNaN(Number(durationS)) && Number(durationS) > 0) {
              const bytesVals = rows.map(r => Number(r.bytes)).filter(v => !isNaN(v));
              if (bytesVals.length > 0) {
                const totalBytes = bytesVals.reduce((a, b) => a + b, 0);
                receivedKBytesPerSec = ((totalBytes / 1024) / Number(durationS)).toFixed(2);
              }
            }
            // Calcular Start time y End time
            let startTime = '';
            let endTime = '';
            if (rows.length > 0 && rows[0].timeStamp !== undefined) {
              const timeStamps = rows.map(r => Number(r.timeStamp)).filter(v => !isNaN(v));
              if (timeStamps.length > 0) {
                const minTS = Math.min(...timeStamps);
                const maxTS = Math.max(...timeStamps);
                const dateStart = new Date(minTS);
                const dateEnd = new Date(maxTS);
                startTime = dateStart.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
                endTime = dateEnd.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
              }
            }
            const runInfoArr = [
              { label: 'Total samples', value: total },
              { label: 'Samples passed', value: passed },
              { label: 'Samples failed', value: failed },
              { label: 'Time mean response (ms):', value: meanElapsed },
              { label: 'Time median response (ms):', value: medianElapsed },
              { label: 'Time min response (ms):', value: minElapsed },
              { label: 'Time max response (ms):', value: maxElapsed },
              { label: 'Throughput - tps:', value: throughput },
              { label: 'Sent KBytes per sec:', value: sentKBytesPerSec },
              { label: 'Received KBytes per sec:', value: receivedKBytesPerSec },
              { label: 'Start time:', value: startTime },
              { label: 'End time:', value: endTime },
              { label: 'Duration (s):', value: durationS },
            ];
            // El gráfico y status se basan en runInfo
            const percentPassed = total > 0 ? (passed / total) * 100 : 0;
            setStatusData({ status: failed === 0 ? 'AAA' : 'ERR', progress: percentPassed, passed: failed === 0 });
            setRunInfo(runInfoArr);
            setView('status');
          },
          error: () => setError('Error al leer el archivo'),
        });
      }
    }, 120);
  };

  return (
    <div>
      <header className="santander-header">
        <span className="santander-header-title">Santander - Generador de Evidencias</span>
        <span className="santander-header-avatar">QA</span>
      </header>
      <main className="santander-main-centered">
        {view === 'upload' && (
          <div className="santander-container">
            <h1 className="santander-title">Subir archivo .csv de JMeter</h1>
            <div className="santander-upload-box">
              <input
                type="file"
                accept=".csv"
                ref={fileInput}
                onChange={handleFileChange}
                disabled={uploading}
                className="santander-file-input"
              />
              {fileName && <div className="santander-filename">{fileName}</div>}
              {error && <div className="santander-error">{error}</div>}
              <div className="santander-progress-bar-bg">
                <div
                  className="santander-progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <button
                className="santander-btn"
                onClick={() => fileInput.current && fileInput.current.click()}
                disabled={uploading}
              >
                Seleccionar archivo
              </button>
            </div>
          </div>
        )}
        {view === 'status' && (
          <>
            <div className="dashboard-flex">
              <StatusCard
                progress={statusData.progress}
                runInfo={runInfo}
              />
              <RunInfoCard
                runInfo={runInfo}
              />
            </div>
            {/* Nuevos widgets de gráficos en fila */}
            <div className="dashboard-graphs-row">
              <section className="dashboard-card dashboard-graph-card">
                <div className="dashboard-card-title">Gráfico 1</div>
                <div style={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 24}}>
                  Aquí irá el gráfico 1 (línea o barras)
                </div>
              </section>
              <section className="dashboard-card dashboard-graph-card">
                <div className="dashboard-card-title">Gráfico 2</div>
                <div style={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 24}}>
                  Aquí irá el gráfico 2 (línea o barras)
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
