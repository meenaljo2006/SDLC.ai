import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, ArrowRight, Loader2, AlertCircle, 
  CheckCircle, FileCode, Terminal, AlertTriangle, Lightbulb
} from 'lucide-react';
import './SmartDebugger.css';

// --- Helper: Copy Button ---
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      {copied ? "Copied" : "Copy Fix"}
    </button>
  );
};

// --- MAIN COMPONENT ---
const SmartDebugger = () => {
  // Inputs
  const [failingCode, setFailingCode] = useState("");
  const [traceback, setTraceback] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [language, setLanguage] = useState("");

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // Validation
    if (!failingCode.trim()) return setError("Please paste the failing code.");
    if (!traceback.trim()) return setError("Please paste the error traceback.");
    if (!language.trim()) return setError("Specify the programming language.");

    setIsLoading(true);

    const payload = {
      failing_code: failingCode,
      traceback: traceback,
      expected_behavior: expectedBehavior || "No specific expectation provided.",
      language: language
    };

    try {

      const API_URL = "https://sdlc.testproject.live/api/v1/debug/";

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
      if (!response.ok) throw new Error(data.detail || "Debugging failed.");

      setResult(data);

      // Save History
      const history = JSON.parse(localStorage.getItem('analysis_history') || "[]");
      history.unshift({
        toolName: "Smart Debugger",
        date: new Date().toLocaleDateString(),
        score: 100,
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
    <div className="debugger-container">
      
      {/* LEFT: INPUTS */}
      <div className="debugger-input-panel">
        <div className="panel-header">
          <Bug size={24} className="text-rose-400" />
          <h2>Smart Debugger</h2>
        </div>

        <div className="debugger-form">
          
          <div className="form-group">
            <label className="form-label">Language</label>
            <input 
              className="debugger-input" 
              placeholder="e.g. Python, Java..."
              value={language}
              onChange={e => setLanguage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Failing Code</label>
            <div className="code-editor-wrapper">
              <textarea 
                className="code-textarea" 
                rows="3"
                placeholder="// Paste broken code here ..."
                value={failingCode}
                onChange={e => setFailingCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Traceback / Error Log</label>
            <div className="trace-editor-wrapper">
              <textarea 
                className="code-textarea " 
                rows="3"
                placeholder="// Paste the Error here ...."
                value={traceback}
                onChange={e => setTraceback(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expected Behavior (Optional)</label>
            <textarea 
              className="debugger-textarea" 
              rows="2"
              placeholder="Write the expected Output"
              value={expectedBehavior}
              onChange={e => setExpectedBehavior(e.target.value)}
            />
          </div>

          {error && <div className="error-message-text">{error}</div>}

          <button 
            className="debugger-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <>Debug Code <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="debugger-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <AlertTriangle size={48} className="text-slate-600 mb-4" />
            <h3>Bug Hunter</h3>
            <p>Paste your error logs and code to find the root cause instantly.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-rose-400 animate-spin mb-4" />
            <h3>Debugging...</h3>
            <p>Scanning stack traces and logic flow.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-content">
            
            {/* 1. ROOT CAUSE */}
            <div className="root-cause-card">
              <div className="rc-header">
                <AlertCircle size={20} className="text-rose-400" />
                <h4>Root Cause Analysis</h4>
              </div>
              <p>{result.root_cause_summary}</p>
            </div>

            {/* 2. SUGGESTED FIX */}
            <div className="fix-card">
              <div className="fix-header">
                <div className="fix-title">
                  <CheckCircle size={18} className="text-green-400" />
                  <span>Suggested Fix</span>
                </div>
                <CopyButton text={result.suggested_fix} />
              </div>
              <pre className="fix-code-block">
                <code>{result.suggested_fix}</code>
              </pre>
            </div>

            {/* 3. FINDINGS */}
            <div className="findings-section">
              <h5 className="section-title">Detailed Findings</h5>
              {result.findings.map((item, idx) => (
                <div key={idx} className="finding-item">
                  <span className="finding-cat">{item.category}</span>
                  <span className="finding-loc">at {item.location}</span>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>

            {/* 4. OPTIMIZATION NOTES */}
            {result.optimization_notes && result.optimization_notes.length > 0 && (
              <div className="notes-section">
                <h5 className="section-title"><Lightbulb size={14} className="text-yellow-400"/> Optimization Tips</h5>
                <ul>
                  {result.optimization_notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default SmartDebugger;