import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Beaker, ArrowRight, Loader2, CheckCircle, 
  AlertTriangle, PlayCircle, FileText, ListChecks,
  X
} from 'lucide-react';
import './TestCaseBuilder.css';

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

// --- Helper: Type Badge ---
const TypeBadge = ({ type }) => {
  const styles = {
    Positive: { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
    Negative: { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
    Edge: { bg: 'rgba(234, 179, 8, 0.2)', color: '#facc15' }
  };
  const style = styles[type] || styles.Positive;
  return <span className="type-badge" style={style}>{type}</span>;
};

// --- MAIN COMPONENT ---
const TestCaseBuilder = () => {
  // Inputs
  const [userStory, setUserStory] = useState("");
  const [count, setCount] = useState(5);
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
    if (!userStory.trim()) return setError("User Story is required.");

    setIsLoading(true);

    const payload = {
      user_story: userStory,
      count: parseInt(count),
      non_functionals: nonFunctionals,
      constraints: constraints
    };

    try {
      let token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in again.");
      token = token.replace(/^"|"$/g, "");

      const response = await fetch("/api/v1/testcases/", {
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
      if (!response.ok) throw new Error(data.detail || "Generation failed.");

      setResult(data);

      // Save History
      const history = JSON.parse(localStorage.getItem('analysis_history') || "[]");
      history.unshift({
        toolName: "Test Case Builder",
        date: new Date().toLocaleDateString(),
        score: data.cases?.length || 0,
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
    <div className="testcase-container">
      
      {/* LEFT: INPUTS */}
      <div className="testcase-input-panel">
        <div className="panel-header">
          <Beaker size={24} className="text-teal-400" />
          <h2>Define Scenario</h2>
        </div>

        <div className="testcase-form">
          <div className="form-group">
            <label className="form-label">User Story</label>
            <textarea 
              className="testcase-textarea" 
              rows="3"
              placeholder="As a user, I want to withdraw cash..."
              value={userStory}
              onChange={e => setUserStory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Cases</label>
            <input 
              type="number"
              className="testcase-input" 
              min="1" max="10"
              value={count}
              onChange={e => setCount(e.target.value)}
            />
          </div>

          <TagInput 
            label="Non-Functional Reqs" 
            tags={nonFunctionals} 
            setTags={setNonFunctionals} 
            placeholder="Security, Speed..." 
          />

          <TagInput 
            label="Constraints" 
            tags={constraints} 
            setTags={setConstraints} 
            placeholder="Max withdrawal $500..." 
          />

          {error && <div className="error-message-text">{error}</div>}

          <button 
            className="testcase-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Generating...</> : <>Generate Test Cases <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="testcase-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <ListChecks size={48} className="text-slate-600 mb-4" />
            <h3>Ready to Test</h3>
            <p>Generate comprehensive BDD test scenarios automatically.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-teal-400 animate-spin mb-4" />
            <h3>Generating Scenarios...</h3>
            <p>Creating positive, negative, and edge cases.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="results-content">
            
            <div className="summary-header">
              <FileText size={20} className="text-teal-400" />
              <p>{result.summary}</p>
            </div>

            <div className="cases-list">
              {result.cases.map((testCase, idx) => (
                <div key={idx} className="test-card">
                  <div className="test-header">
                    <div className="test-title-group">
                      <span className="case-id">{testCase.id}</span>
                      <h4>{testCase.title}</h4>
                    </div>
                    <TypeBadge type={testCase.type} />
                  </div>

                  <div className="bdd-grid">
                    <div className="bdd-row given">
                      <span className="bdd-label">GIVEN</span>
                      <p>{testCase.given}</p>
                    </div>
                    <div className="bdd-row when">
                      <span className="bdd-label">WHEN</span>
                      <p>{testCase.when}</p>
                    </div>
                    <div className="bdd-row then">
                      <span className="bdd-label">THEN</span>
                      <p>{testCase.then}</p>
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

export default TestCaseBuilder;