import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, ArrowRight, Loader2, Check, X, 
  Layers, Cpu
} from 'lucide-react';
import './ArchitectureGenerator.css';

// ----------------------------------------------------
// TAG INPUT COMPONENT
// ----------------------------------------------------
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

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="form-grp">
      <label className="form-label">{label}</label>
      <div className="tag-input-container">
        <div className="tags-wrapper">
          {tags.map((tag, index) => (
            <span key={index} className="input-tag">
              {tag} <button onClick={() => removeTag(index)}><X size={12}/></button>
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

// ----------------------------------------------------
// MERMAID COMPONENT (FIXED IMPORT)
// ----------------------------------------------------
const MermaidChart = ({ chartCode }) => {
  const ref = useRef(null);

  useEffect(() => {
    const renderChart = async () => {
      if (chartCode && ref.current) {
        try {
          // FIX: Import specific ESM build to avoid Node.js 'tty'/'util' errors
          const mermaid = (await import('mermaid/dist/mermaid.esm.min.mjs')).default;

          mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'dark',
            securityLevel: 'loose',
          });

          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chartCode);
          ref.current.innerHTML = svg;

        } catch (err) {
          console.error("Mermaid error:", err);
          // If error occurs, show raw code so user isn't left blank
          ref.current.innerHTML = `<div class="error-diagram">Failed to render diagram. <br/>Raw: ${chartCode}</div>`;
        }
      }
    };

    renderChart();
  }, [chartCode]);

  return <div className="mermaid-wrapper" ref={ref} />;
};

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
const ArchitectureGenerator = () => {
  const [problem, setProblem] = useState("");
  const [qualityGoals, setQualityGoals] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [techStack, setTechStack] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ----------------------------------------------------
  // SUBMIT HANDLER (REAL API)
  // ----------------------------------------------------
  const handleSubmit = async () => {
    setResult(null);
    setError("");

    // Clean payload
    const payload = {
      problem: problem.trim(),
      quality_goals: qualityGoals.filter(x => x.trim() !== ""),
      constraints: constraints.filter(x => x.trim() !== ""),
      preferred_stack: techStack.filter(x => x.trim() !== ""),
    };

    // Validation
    if (!payload.problem) return setError("Problem statement is required.");
    if (payload.quality_goals.length === 0) return setError("At least one Quality Goal is required.");
    if (payload.constraints.length === 0) return setError("At least one Constraint is required.");
    if (payload.preferred_stack.length === 0) return setError("Preferred Tech Stack is required.");

    setIsLoading(true);

    try {
      // Token Cleaning
      let token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in again.");
      token = token.replace(/^"|"$/g, "");

      // API Call
      const response = await fetch("/api/v1/design/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Handle HTML Errors (500s)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const html = await response.text();
        console.error("HTML ERROR FROM SERVER:", html);
        throw new Error("Server Error (500). The backend crashed. Check inputs.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Generation failed.");
      }

      setResult(data);

      // Save History
      const history = JSON.parse(localStorage.getItem('analysis_history') || "[]");
      history.unshift({
        toolName: "Architecture Gen",
        date: new Date().toLocaleDateString(),
        score: 100,
        timestamp: Date.now()
      });
      localStorage.setItem("analysis_history", JSON.stringify(history));

    } catch (err) {
      console.error("Detailed Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="arch-container">

      {/* LEFT PANEL */}
      <div className="arch-input-panel">
        <div className="panel-header">
          <Lightbulb size={24} className="text-cyan-400" />
          <h2>Design Requirements</h2>
        </div>

        <div className="arch-form">
          <div className="form-grp">
            <label className="form-label">Problem Statement</label>
            <textarea 
              className="arch-textarea" 
              rows="4"
              placeholder="e.g. We need an application that accepts real-time sensor data..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>

          <TagInput 
            label="Quality Goals" 
            tags={qualityGoals} 
            setTags={setQualityGoals} 
            placeholder="Type & Press Enter to add"
          />

          <TagInput 
            label="Constraints" 
            tags={constraints} 
            setTags={setConstraints} 
            placeholder="Type & Press Enter to add"
          />

          <TagInput 
            label="Preferred Stack" 
            tags={techStack} 
            setTags={setTechStack} 
            placeholder="Type & Press Enter to add"
          />

          {error && <div className="error-box">{error}</div>}

          <button 
            className="arch-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading 
              ? <><Loader2 className="animate-spin" /> Generating...</>
              : <>Generate Architecture <ArrowRight size={18} /></>
            }
          </button>
          
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="arch-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <Layers size={48} />
            <h3>Ready to Design</h3>
            <p>Enter your requirements to generate architecture.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-cyan-400 animate-spin mb-4" />
            <h3>Analyzing Requirements...</h3>
            <p>Consulting architectural patterns and constraints.</p>
          </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="results-content"
          >
            <div className="result-header">
              <h3>AI Recommendation</h3>
              <p>{result.recommendation}</p>
            </div>

            <div className="options-grid">
              {result.options.map((option, idx) => (
                <div key={idx} className="option-card">
                  <div className="option-title">
                    <h4>Option {idx + 1}: {option.name}</h4>
                    <span className="badge">
                      Best for: {option.when_to_use ? option.when_to_use.substring(0, 30) + "..." : "General"}
                    </span>
                  </div>

                  <div className="diagram-box">
                    <MermaidChart chartCode={option.diagram_mermaid} />
                  </div>

                  <div className="pros-cons-grid">
                    <div className="pc-col">
                      <h5><Check size={14}/> Pros</h5>
                      <ul>{option.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                    <div className="pc-col">
                      <h5><X size={14}/> Cons</h5>
                      <ul>{option.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
                    </div>
                  </div>

                  <div className="components-list">
                    <h5><Cpu size={14}/> Key Components:</h5>
                    <div className="comp-tags">
                      {option.key_components.map((comp, i) => (
                        <span key={i} className="comp-tag">{comp}</span>
                      ))}
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

export default ArchitectureGenerator;