import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle, Lightbulb, 
  Copy, Check, FileCode 
} from 'lucide-react';
import './SmartDebuggerView.css';

// --- HELPER: COPY BUTTON ---
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="sd-copy-btn" onClick={handleCopy}>
      {copied ? "Copied" : "Copy Fix"}
    </button>
  );
};

// --- MAIN COMPONENT ---
const SmartDebuggerView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No debug data available.</div>;

  return (
    <div className="sd-history-container">
      
      {/* 1. Root Cause Analysis */}
      <div className="sd-root-cause-card">
        <div className="sd-rc-header">
          <AlertCircle size={20} className="text-rose-400" />
          <h4>Root Cause Analysis</h4>
        </div>
        <p>{data.root_cause_summary}</p>
      </div>

      {/* 2. Suggested Fix Code */}
      <div className="sd-fix-card">
        <div className="sd-fix-header">
          <div className="sd-fix-title">
            <CheckCircle size={18} className="text-green-400" />
            <span>Suggested Fix</span>
          </div>
          <CopyButton text={data.suggested_fix} />
        </div>
        <pre className="sd-fix-code-block">
          <code>{data.suggested_fix}</code>
        </pre>
      </div>

      {/* 3. Detailed Findings */}
      {data.findings && data.findings.length > 0 && (
        <div className="sd-findings-section">
          <h5 className="sd-section-title">Detailed Findings</h5>
          {data.findings.map((item, idx) => (
            <div key={idx} className="sd-finding-item">
              <span className="sd-finding-cat">{item.category}</span>
              <span className="sd-finding-loc">at {item.location}</span>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4. Optimization Notes (Optional) */}
      {data.optimization_notes && data.optimization_notes.length > 0 && (
        <div className="sd-notes-section">
          <h5 className="sd-section-title">
             <Lightbulb size={14} className="text-yellow-400"/> Optimization Tips
          </h5>
          <ul className="sd-notes-list">
            {data.optimization_notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default SmartDebuggerView;