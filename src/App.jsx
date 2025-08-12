
import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const fileInput = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

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
    // Simulación de carga
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
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
      </main>
    </div>
  );
}

export default App;
