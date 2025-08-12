

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
            const runInfoArr = [
              { label: 'Total samples', value: total },
              { label: 'Samples passed', value: passed },
              { label: 'Samples failed', value: failed },
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
          <div className="dashboard-flex">
            <StatusCard
              progress={statusData.progress}
              runInfo={runInfo}
            />
            <RunInfoCard
              runInfo={runInfo}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
