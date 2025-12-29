import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <--- Import AnimatePresence
import { 
  ClipboardCheck, ArrowRight, Loader2, AlertOctagon, 
  ShieldAlert, CheckSquare, Activity, FileText, X, CheckCircle2 // <--- Import CheckCircle2
} from 'lucide-react';
import './DesignReviewer.css';
import { useProject } from '../Context/ProjectContext';

// --- Helper: Tag Input ---
const TagInput = ({ label, tags, setTags, placeholder }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) setTags([...tags, input.trim()]);
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

// --- Helper: Severity Badge ---
const SeverityBadge = ({ level }) => {
  const styles = {
    Critical: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', icon: AlertOctagon }, // Red
    High: { bg: 'rgba(249, 115, 22, 0.2)', color: '#f97316', icon: ShieldAlert },     // Orange
    Medium: { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', icon: Activity },       // Yellow
    Low: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', icon: FileText }          // Blue
  };

  const style = styles[level] || styles.Medium;
  const Icon = style.icon;

  return (
    <span className="severity-badge" style={{ background: style.bg, color: style.color }}>
      <Icon size={14} /> {level} Risk
    </span>
  );
};

// --- MAIN COMPONENT ---
const DesignReviewer = () => {
  const { selectedProject, logActivity } = useProject();

  // Inputs
  const [document, setDocument] = useState("");
  const [qualityGoals, setQualityGoals] = useState([]);
  const [checklists, setChecklists] = useState([]);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false); // <--- NEW STATE

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setIsSaved(false); // Reset saved state

    // Validation
    if (!document.trim()) return setError("Design document description is required.");
    if (qualityGoals.length === 0) return setError("Add at least one Quality Goal.");

    setIsLoading(true);

    const payload = {
      document: document,
      quality_goals: qualityGoals,
      checklists: checklists
    };

    try {
      const API_URL = "https://sdlc.testproject.live/api/v1/review/";

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
      if (!response.ok) throw new Error(data.detail || "Review failed.");

      setResult(data);

      // 👇 NEW: Save Logic
      if (selectedProject) {
        const fullInputLog = `Document Content:
${document}

Quality Goals:
- ${qualityGoals.length > 0 ? qualityGoals.join('\n- ') : "None provided"}

Checklists:
- ${checklists.length > 0 ? checklists.join('\n- ') : "None provided"}`;

        logActivity('review', 'Design Reviewer', fullInputLog, data);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reviewer-container">
      
      {/* LEFT: INPUTS */}
      <div className="reviewer-input-panel">
        <div className="panel-header">
          <ClipboardCheck size={24} className="text-amber-400" />
          <h2>Design Audit</h2>
        </div>

        <div className="reviewer-form">
          <div className="form-group">
            <label className="form-label">Design Document / Architecture</label>
            <textarea 
              className="reviewer-textarea" 
              rows="6"
              placeholder="e.g. Service A calls Service B synchronously; B writes to DB; retries disabled."
              value={document}
              onChange={e => setDocument(e.target.value)}
            />
          </div>

          <TagInput 
            label="Quality Goals (Priorities)" 
            tags={qualityGoals} 
            setTags={setQualityGoals} 
            placeholder="Type & Press Enter to add" 
          />

          <TagInput 
            label="Checklists (Focus Areas)" 
            tags={checklists} 
            setTags={setChecklists} 
            placeholder="Type & Press Enter to add"  
          />

          {error && <div className="error-message-text">{error}</div>}

          <button 
            className="reviewer-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Auditing...</> : <>Run Review <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="reviewer-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <ShieldAlert size={48} className="text-slate-600 mb-4" />
            <h3>Audit Your Design</h3>
            <p>Paste your architecture notes to identify risks, single points of failure, and missing patterns.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-amber-400 animate-spin mb-4" />
            <h3>Analyzing Risks...</h3>
            <p>Scanning for reliability, security, and performance gaps.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-content">
            
            {/* 👇 NEW: AUTO-SAVE BANNER */}
            <AnimatePresence>
              {isSaved && selectedProject && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="auto-save-banner"
                >
                  <CheckCircle2 size={16} />
                  <span>Output auto-saved to <strong>{selectedProject?.name}</strong> history.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1. EXECUTIVE SUMMARY */}
            <div className="summary-card">
              <div className="summary-reviewheader">
                <FileText size={22} className="summary-icon" />
                <h4>Executive Summary</h4>
              </div>
              <p>{result.summary}</p>
            </div>

            {/* 2. IDENTIFIED RISKS */}
            <h4 className="section-reviewtitle">Identified Risks</h4>
            <div className="risks-grid">
              {result.risks.map((risk, idx) => (
                <div key={idx} className="risk-card">
                  <div className="risk-header">
                    <span className="risk-area">{risk.area}</span>
                    <SeverityBadge level={risk.severity} />
                  </div>
                  
                  <div className="risk-body">
                    <div className="risk-row">
                      <span className="label">Impact:</span>
                      <span className="value">{risk.impact}</span>
                    </div>
                    <div className="risk-row">
                      <span className="label">Mitigation:</span>
                      <span className="value highlight">{risk.mitigation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. ACTION ITEMS */}
            <h4 className="section-reviewtitle" style={{ marginTop: '2rem' }}>Recommended Actions</h4>
            <div className="actions-list">
              {result.action_items.map((item, idx) => (
                <div key={idx} className="action-item">
                  <CheckSquare size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default DesignReviewer;