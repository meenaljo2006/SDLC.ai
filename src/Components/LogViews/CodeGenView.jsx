import React, { useState } from 'react';
import { 
  BookOpen, Code, Copy, Check, Layers, FileCode 
} from 'lucide-react';
import './CodeGenView.css';

// --- HELPER: COPY BUTTON ---
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="cg-copy-btn" onClick={handleCopy}>
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

// --- MAIN COMPONENT ---
const CodeGenView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No code generation data available.</div>;

  return (
    <div className="cg-history-container">

      {/* 1. Code Block */}
      <div className="cg-code-card">
        <div className="cg-code-header">
          <div className="cg-file-info">
            <FileCode size={16} className="text-indigo-400" />
            <span>Generated Solution</span>
          </div>
          <CopyButton text={data.generated_code} />
        </div>
        <pre className="cg-code-block">
          <code>{data.generated_code}</code>
        </pre>
      </div>

      {/* 2. Explanation Box */}
      {data.explanation && (
        <div className="cg-explanation-card">
          <div className="cg-card-header">
            <BookOpen size={18} className="text-blue-400" />
            <h4>Explanation</h4>
          </div>
          <p>{data.explanation}</p>
        </div>
      )}

      {/* 3. Libraries Suggested */}
      {data.libraries_suggested && data.libraries_suggested.length > 0 && (
        <div className="cg-libs-section">
          <h5 className="cg-libs-title">
            <Layers size={14} /> Suggested Libraries
          </h5>
          <div className="cg-libs-tags">
            {data.libraries_suggested.map((lib, idx) => (
              <span key={idx} className="cg-lib-tag">{lib}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CodeGenView;