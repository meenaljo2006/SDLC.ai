import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, ArrowRight, Loader2, CheckCircle2, 
  AlertTriangle, Sword, Trophy, Info
} from 'lucide-react';
import './TradeOffAnalyzer.css';

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

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

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
      let token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in again.");
      token = token.replace(/^"|"$/g, "");

      const response = await fetch("/api/v1/tradeoff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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

      // Save History
      const history = JSON.parse(localStorage.getItem('analysis_history') || "[]");
      history.unshift({
        toolName: "Trade-off Analyzer",
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
            placeholder="Scalability, Cost, Speed..." 
          />

          <TagInput 
            label="Constraints (Limitations)" 
            tags={constraints} 
            setTags={setConstraints} 
            placeholder="Budget, Deadline..." 
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
            
            {/* Recommendation Box */}
            <div className="recommendation-card">
              <div className="rec-header">
                <CheckCircle2 className="text-green-400" size={24} />
                <div>
                  <span className="rec-label">Recommended Choice</span>
                  <h3>{result.recommendation.choice}</h3>
                </div>
              </div>
              <p className="rec-text">{result.recommendation.justification}</p>
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

            {/* Summary Footer */}
            <div className="summary-box">
              <Info size={18} className="text-blue-400" />
              <p>{result.summary}</p>
            </div>

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default TradeOffAnalyzer;