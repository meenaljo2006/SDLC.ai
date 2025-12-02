import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, ArrowRight, Loader2, AlertTriangle, 
  CheckCircle2, XCircle, Zap, Database, Server, 
  Globe, Shield, Info, Gauge
} from 'lucide-react';
import './TechStackSelector.css';

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

// --- Helper: Score Gauge ---
const ScoreGauge = ({ score }) => {
  // Score is usually 1-5 or 1-10. Let's assume 1-10 for color mapping.
  const getColor = (s) => {
    if (s >= 8) return "#4ade80"; // Green
    if (s >= 5) return "#fbbf24"; // Yellow
    return "#f43f5e"; // Red
  };

  return (
    <div className="score-gauge" style={{ borderColor: getColor(score) }}>
      <span className="score-value" style={{ color: getColor(score) }}>{score}</span>
      <span className="score-label">/ 5</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
const TechStackSelector = () => {
  // Inputs
  const [architecture, setArchitecture] = useState("");
  const [domain, setDomain] = useState("");
  const [qualityGoals, setQualityGoals] = useState([]);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // Validation
    if (!architecture.trim()) return setError("Current architecture description is required.");
    if (!domain.trim()) return setError("Domain is required.");
    if (qualityGoals.length === 0) return setError("Add at least one Quality Goal.");

    setIsLoading(true);

    const payload = {
      architecture: architecture,
      domain: domain,
      quality_goals: qualityGoals
    };

    try {
      let token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in again.");
      token = token.replace(/^"|"$/g, "");

      const response = await fetch("/api/v1/techstack/", {
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
        toolName: "Tech Stack Selector",
        date: new Date().toLocaleDateString(),
        score: data.performance_review?.[0]?.score || 0,
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
    <div className="techstack-container">
      
      {/* LEFT: INPUTS */}
      <div className="techstack-input-panel">
        <div className="panel-header">
          <Layers size={24} className="text-purple-400" />
          <h2>Stack Analysis</h2>
        </div>

        <div className="techstack-form">
          <div className="form-group">
            <label className="form-label">Current Architecture</label>
            <textarea 
              className="techstack-textarea" 
              rows="5"
              placeholder="e.g. A Flask REST API connects to a single MongoDB instance. No caching used."
              value={architecture}
              onChange={e => setArchitecture(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Domain / Context</label>
            <input 
              className="techstack-input" 
              placeholder="e.g. E-commerce checkout service"
              value={domain}
              onChange={e => setDomain(e.target.value)}
            />
          </div>

          <TagInput 
            label="Quality Goals" 
            tags={qualityGoals} 
            setTags={setQualityGoals} 
            placeholder="Reliability, Performance..." 
          />

          {error && <div className="error-message-text">{error}</div>}

          <button 
            className="techstack-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <>Analyze Stack <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="techstack-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <Server size={48} className="text-slate-600 mb-4" />
            <h3>Optimize Your Stack</h3>
            <p>Describe your current setup to receive modernization recommendations.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-purple-400 animate-spin mb-4" />
            <h3> analyzing Architecture...</h3>
            <p>Checking performance bottlenecks and compatibility.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-content">
            
            {/* 1. SUMMARY SECTION */}
            <div className="summary-header">
              <Info size={20} className="text-blue-400" />
              <p>{result.summary}</p>
            </div>

            {/* 2. PERFORMANCE REVIEW */}
            {result.performance_review && result.performance_review.map((review, idx) => (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <div>
                    <h4>{review.attribute} Review</h4>
                    <span className="review-subtitle">Architecture Health Check</span>
                  </div>
                  <ScoreGauge score={review.score} />
                </div>
                
                <div className="issues-list">
                  <h5><AlertTriangle size={14} className="text-red-400" /> Detected Issues</h5>
                  <ul>
                    {review.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                </div>
                
                <div className="suggestions-list">
                  <h5><Zap size={14} className="text-yellow-400" /> Improvement Suggestions</h5>
                  <ul>
                    {review.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                  </ul>
                </div>
              </div>
            ))}

            {/* 3. TECH RECOMMENDATIONS (The Grid) */}
            <h4 className="section-title">Recommended Technology Stack</h4>
            <div className="recommendations-grid">
              {result.tech_recommendations.map((tech, idx) => (
                <div key={idx} className="tech-card">
                  <div className="tech-header">
                    <span className="tech-category">{tech.category}</span>
                  </div>
                  <div className="tech-options">
                    {tech.options.map((opt, i) => (
                      <span key={i} className="tech-badge">{opt}</span>
                    ))}
                  </div>
                  <p className="tech-reasoning">{tech.reasoning}</p>
                </div>
              ))}
            </div>

            {/* 4. COMPARISON (Matched vs Missing) */}
            <div className="comparison-section">
              <div className="comp-col matched">
                <h5><CheckCircle2 size={16}/> What you have</h5>
                <ul>{result.reference_comparison.matched.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </div>
              <div className="comp-col missing">
                <h5><XCircle size={16}/> What's missing</h5>
                <ul>{result.reference_comparison.missing.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </div>
            </div>

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default TechStackSelector;