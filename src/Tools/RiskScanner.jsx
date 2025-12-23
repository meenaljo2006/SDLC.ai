import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, ArrowRight, Loader2, AlertTriangle, 
  Activity, AlertOctagon, ShieldCheck, FileText, X
} from 'lucide-react';
import './RiskScanner.css';

// --- Helper: Tag Input ---
const TagInput = ({ label, tags, setTags, placeholder }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="tag-input-container">
        <div className="tags-wrapper">
          {tags.map((tag, i) => (
            <span key={i} className="input-tag">
              {tag} <button onClick={() => removeTag(i)}><X size={12} /></button>
            </span>
          ))}
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="tag-input-field"
          />
        </div>
      </div>
    </div>
  );
};

// --- Helper: Risk Score Badge ---
const RiskScoreBadge = ({ score}) => {
  let color = "#3b82f6"; // Low (Blue)
  let label = "Low";

  if (score >= 10) { color = "#ef4444"; label = "Critical"; } // Red
  else if (score >= 7) { color = "#f97316"; label = "High"; } // Orange
  else if (score >= 4) { color = "#eab308"; label = "Medium"; } // Yellow

  return (
    <div className="risk-score-badge" style={{ borderColor: color, color: color }}>
      <span className="score-num">{score}/12</span>
      <span className="score-cat">{label}</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
const RiskScanner = () => {
  // Inputs
  const [design, setDesign] = useState("");
  const [nonFunctionals, setNonFunctionals] = useState([]);
  const [constraints, setConstraints] = useState([]);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // Validation
    if (!design.trim()) return setError("System design description is required.");

    setIsLoading(true);

    const payload = {
      design: design,
      non_functionals: nonFunctionals,
      constraints: constraints
    };

    try {

      const API_URL = "https://sdlc.testproject.live/api/v1/risk/";

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
      if (!response.ok) throw new Error(data.detail || "Risk scan failed.");

      // Sort risks by score (Highest first)
      if (data.risks) {
        data.risks.sort((a, b) => b.score - a.score);
      }

      setResult(data);

      // Save History
      const history = JSON.parse(localStorage.getItem('analysis_history') || "[]");
      history.unshift({
        toolName: "Risk Scanner",
        date: new Date().toLocaleDateString(),
        score: data.risks?.length || 0, 
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
    <div className="risk-container">
      
      {/* LEFT: INPUTS */}
      <div className="risk-input-panel">
        <div className="panel-header">
          <AlertOctagon size={24} className="text-red-500" />
          <h2>Risk Assessment</h2>
        </div>

        <div className="risk-form">
          <div className="form-group">
            <label className="form-label">System Architecture / Design</label>
            <textarea 
              className="risk-textarea" 
              rows="7"
              placeholder="Describe your architecture (e.g. Microservices on AWS with RDS, exposed via API Gateway...)"
              value={design}
              onChange={e => setDesign(e.target.value)}
            />
          </div>

          <TagInput 
            label="Non-Functional Req (NFRs)" 
            tags={nonFunctionals} 
            setTags={setNonFunctionals} 
            placeholder="High Availability, Low Latency..." 
          />

          <TagInput 
            label="Constraints" 
            tags={constraints} 
            setTags={setConstraints} 
            placeholder="GDPR, Budget < $5k..." 
          />

          {error && <div className="error-message-text"> {error}</div>}

          <button 
            className="risk-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Scanning...</> : <>Scan for Risks <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="risk-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <ShieldAlert size={48} className="text-slate-600 mb-4" />
            <h3>Risk Scanner</h3>
            <p>Identify security vulnerabilities and architectural weaknesses before deployment.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-red-500 animate-spin mb-4" />
            <h3>Analyzing System...</h3>
            <p>Calculating impact and likelihood of potential threats.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-content">
            
            {/* 1. SUMMARY CARD */}
            <div className="summary-card">
              <div className="summary-riskheader">
                <Activity size={20} className="text-orange-400" />
                <h4>Assessment Summary</h4>
              </div>
              <p>{result.summary}</p>
            </div>

            {/* 2. RISK LIST */}
            <h4 className="section-risktitle">Identified Risks ({result.risks.length})</h4>
            <div className="risks-list">
              {result.risks.map((risk, idx) => (
                <div key={idx} className="risk-item-card">
                  <div className="risk-top">
                    <div className="risk-info">
                      <span className="risk-category">{risk.category}</span>
                      <h5>{risk.description}</h5>
                    </div>
                    <RiskScoreBadge score={risk.score} />
                  </div>
                  
                  <div className="risk-details">
                    <div className="mitigation-box">
                      <span className="mit-label"><ShieldCheck size={14}/> Mitigation:</span>
                      <p>{risk.mitigation}</p>
                    </div>
                    <div className="meta-row">
                      <span>Action Required By : {risk.owner || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default RiskScanner;