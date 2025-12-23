import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileBadge, ArrowRight, Loader2, AlertOctagon, 
  ShieldAlert, AlertTriangle, Info, CheckCircle2, 
  FileCode, Terminal
} from 'lucide-react';
import './ComplianceAuditor.css';

// --- Helper: Severity Badge ---
const SeverityBadge = ({ level }) => {
  const styles = {
    Critical: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', icon: AlertOctagon }, // Red
    High: { bg: 'rgba(249, 115, 22, 0.2)', color: '#f97316', icon: ShieldAlert },     // Orange
    Medium: { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', icon: AlertTriangle },  // Yellow
    Low: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', icon: Info }              // Blue
  };

  const style = styles[level] || styles.Low;
  const Icon = style.icon;

  return (
    <span className="severity-badge" style={{ background: style.bg, color: style.color }}>
      <Icon size={12} /> {level}
    </span>
  );
};

const getScoreColor = (score) => {
  if (score > 80) return "#4ade80"; // Green
  if (score > 50) return "#eab308"; // Yellow
  return "#ef4444";               // Red
};

// --- Helper: Score Gauge ---
const ScoreGauge = ({ score }) => {
  const color = getScoreColor(score);

  return (
    <div className="audit-score-box" style={{ borderColor: color }}>
      <span className="score-val" style={{ color }}>{score}/100</span>
      <span className="score-lbl">Quality Score</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ComplianceAuditor = () => {
  // Inputs
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("");
  const [standardContext, setStandardContext] = useState("");

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // Validation
    if (!codeSnippet.trim()) return setError("Please paste a code snippet to audit.");
    if (!language.trim()) return setError("Language is required (e.g., Python, Java).");

    setIsLoading(true);

    const payload = {
      code_snippet: codeSnippet,
      language: language,
      standard_context: standardContext || "General Best Practices"
    };

    try {

      const API_URL = "https://sdlc.testproject.live/api/v1/compliance/";

      // API Call
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":"supersecret123",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Server Error (500). Backend crashed.");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Audit failed.");

      setResult(data);

      // Save History
      const history = JSON.parse(localStorage.getItem('analysis_history') || "[]");
      history.unshift({
        toolName: "Compliance Auditor",
        date: new Date().toLocaleDateString(),
        score: data.overall_score || 0,
        timestamp: Date.now()
      });
      localStorage.setItem("analysis_history", JSON.stringify(history));

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="compliance-container">
      
      {/* LEFT: INPUTS */}
      <div className="compliance-input-panel">
        <div className="panel-header">
          <FileBadge size={24} className="text-cyan-400" />
          <h2>Code Audit</h2>
        </div>

        <div className="compliance-form">
          <div className="form-group">
            <label className="form-label">Code Snippet</label>
            <div className="code-editor-wrapper">
              <textarea 
                className="code-textarea" 
                rows="6"
                placeholder="// Paste your code here..."
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
              />
            </div>
          </div>

          <div className="row-group">
            <div className="form-group half">
              <label className="form-label">Language</label>
              <input 
                className="compliance-input" 
                placeholder="Enter Code Programming Language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Standards / Context</label>
              <input 
                className="compliance-input" 
                placeholder="e.g. PEP8, ISO 27001..."
                value={standardContext}
                onChange={e => setStandardContext(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-message-text">{error}</div>}

          <button 
            className="compliance-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Auditing...</> : <>Run Compliance Check <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="compliance-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <ShieldAlert size={48} className="text-slate-600 mb-4" />
            <h3>Ready to Scan</h3>
            <p>Check your code for security flaws, style violations, and bad practices.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-cyan-400 animate-spin mb-4" />
            <h3>Scanning Codebase...</h3>
            <p>Validating against {standardContext || "standard protocols"}...</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-content">
            
            {/* 1. SCORECARD Header */}
            <div className="audit-header" style={{ borderColor: getScoreColor(result.overall_score) }}>
              <div className="audit-summary">
                <h4>Audit Report</h4>
                <p>{result.summary}</p>
              </div>
              <ScoreGauge score={result.overall_score} />
            </div>

            {/* 2. FINDINGS LIST */}
            <h4 className="section-title">Detected Issues ({result.findings.length})</h4>
            <div className="findings-list">
              {result.findings.map((item, idx) => (
                <div key={idx} className="finding-card">
                  <div className="finding-top">
                    <div className="line-badge">
                      <Terminal size={12} /> Line {item.line}
                    </div>
                    <SeverityBadge level={item.severity} />
                  </div>
                  
                  <div className="finding-body">
                    <span className="finding-type">{item.type}</span>
                    <p>{item.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {result.findings.length === 0 && (
              <div className="perfect-score">
                <CheckCircle2 size={32} className="text-green-400" />
                <p>Clean code! No issues found.</p>
              </div>
            )}

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default ComplianceAuditor;