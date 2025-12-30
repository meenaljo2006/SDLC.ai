import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <--- Import AnimatePresence
import { 
  Scale, ArrowRight, Loader2, CheckCircle2, 
  AlertTriangle, Sword, Trophy, Info
} from 'lucide-react';
import './TradeoffAnalyzer.css';
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
              {tag} <button onClick={() => removeTag(i)}>×</button>
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

// --- Helper: Verdict Badge ---
const VerdictBadge = ({ winner, optionA, optionB }) => {
  const isA = winner === 'A';
  return (
    <span className={`verdict-badge ${isA ? 'verdict-a' : 'verdict-b'}`}>
      <Trophy size={12} />
      Winner: {isA ? optionA : optionB}
    </span>
  );
};

// --- MAIN COMPONENT ---
const TradeOffAnalyzer = () => {
  // Inputs
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [context, setContext] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const { selectedProject, logActivity } = useProject();

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
    if (!optionA || !optionB) return setError("Both Option A and Option B are required.");
    if (!context) return setError("Context is required.");
    if (criteria.length === 0) return setError("Add at least one Criterion.");

    setIsLoading(true);

    const payload = {
      option_a: optionA,
      option_b: optionB,
      criteria: criteria,
      constraints: constraints,
      context: context
    };

    try {
      const API_URL = "https://sdlc.testproject.live/api/v1/tradeoff/";

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
      if (!response.ok) throw new Error(data.detail || "Analysis failed.");

      setResult(data);

      // 👇 NEW: Save Logic
      if (selectedProject) {
        const fullInputLog = `Comparison: ${optionA} vs ${optionB}

Context:
${context}

Criteria:
- ${criteria.join('\n- ')}

Constraints:
- ${constraints.join('\n- ')}`;

        logActivity('trade-off', 'Trade-off Analyzer', fullInputLog, data);
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
    <div className="tradeoff-container">
      
      {/* LEFT: INPUTS */}
      <div className="tradeoff-input-panel">
        <div className="panel-header">
          <Scale size={24} className="text-pink-400" />
          <h2>Comparison Setup</h2>
        </div>

        <div className="tradeoff-form">
          <div className="vs-section">
            <div className="form-group">
              <label className="form-label">Option A</label>
              <input 
                className="tradeoff-input" 
                placeholder="e.g. Monolith"
                value={optionA}
                onChange={e => setOptionA(e.target.value)}
              />
            </div>
            <div className="vs-badge">VS</div>
            <div className="form-group">
              <label className="form-label">Option B</label>
              <input 
                className="tradeoff-input" 
                placeholder="e.g. Microservices"
                value={optionB}
                onChange={e => setOptionB(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Context / Problem</label>
            <textarea 
              className="tradeoff-textarea" 
              rows="3"
              placeholder="e.g. Early stage startup, team of 5..."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>

          <TagInput 
            label="Criteria (What matters?)" 
            tags={criteria} 
            setTags={setCriteria} 
            placeholder="Type & Press Enter to add" 
          />

          <TagInput 
            label="Constraints (Limitations)" 
            tags={constraints} 
            setTags={setConstraints} 
            placeholder="Type & Press Enter to add" 
          />

          {error && <div className="error-message">{error}</div>}

          <button 
            className="tradeoff-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <>Compare Options <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="tradeoff-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <Sword size={48} className="text-slate-600 mb-4" />
            <h3>Ready to Battle</h3>
            <p>Define two technical options to analyze pros, cons, and trade-offs.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-pink-400 animate-spin mb-4" />
            <h3>Weighing Options...</h3>
            <p>Analyzing architectural implications and constraints.</p>
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

            {/* Recommendation Box */}
            <div className="recommendation-card">
              <div className="rec-header">
                <CheckCircle2 className="text-green-400" size={24} />
                <span className="rec-label">Recommended Choice</span>
                
                <div className="rec-content">
                  <h3 className="rec-title">{result.recommendation.decision}</h3>
                  <p className="rec-text">{result.recommendation.justification}</p>
                </div>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div className="matrix-list">
              <h4 className="matrix-title">Detailed Analysis</h4>
              
              {result.matrix.map((item, idx) => (
                <div key={idx} className="matrix-card">
                  <div className="matrix-header">
                    <span className="criterion-name">{item.criterion}</span>
                    <VerdictBadge 
                      winner={item.verdict} 
                      optionA={optionA} 
                      optionB={optionB} 
                    />
                  </div>
                  <div className="matrix-body">
                    <p>{item.notes}</p>
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

export default TradeOffAnalyzer;