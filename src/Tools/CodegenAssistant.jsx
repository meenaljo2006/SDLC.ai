import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <--- Import AnimatePresence
import { 
  Code, ArrowRight, Loader2, Copy, Check, 
  Terminal, FileCode, BookOpen, Layers, CheckCircle2 // <--- Import CheckCircle2
} from 'lucide-react';
import './CodegenAssistant.css';
import { useProject } from '../Context/ProjectContext';

// ... (CopyButton Helper remains same) ...
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const CodegenAssistant = () => {
  const { selectedProject, logActivity } = useProject(); 

  // Inputs
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");

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
    if (!prompt.trim()) return setError("Prompt is required.");
    if (!language.trim()) return setError("Language is required.");

    setIsLoading(true);

    const payload = {
      prompt: prompt,
      language: language,
      framework: framework
    };

    try {
      const API_URL = "https://sdlc.testproject.live/api/v1/codegen/";

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
      if (!response.ok) throw new Error(data.detail || "Generation failed.");

      setResult(data);

      // 👇 NEW: Save Logic
      if (selectedProject) {
        
        // Create a readable string of all inputs
        const fullInputLog = `Requirement Prompt:
${prompt}

Language: ${language}
Framework: ${framework}`;

        logActivity(
          'codegen', 
          'Boilerplate Assistant', 
          fullInputLog, // <--- Passing the combined info here
          data
        );

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
    <div className="codegen-container">
      
      {/* LEFT: INPUTS */}
      <div className="codegen-input-panel">
        <div className="panel-header">
          <Code size={24} className="text-indigo-400" />
          <h2>Code Generator</h2>
        </div>

        <div className="codegen-form">
          <div className="form-group">
            <label className="form-label">Requirement Prompt</label>
            <textarea 
              className="codegen-textarea" 
              rows="6"
              placeholder="e.g. Create a Python FastAPI endpoint at /square that accepts an integer 'n' and returns the square..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>

          <div className="row-group">
            <div className="form-group half">
              <label className="form-label">Language</label>
              <input 
                className="codegen-input" 
                placeholder="e.g. Python"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Framework</label>
              <input 
                className="codegen-input" 
                placeholder="e.g. FastAPI"
                value={framework}
                onChange={e => setFramework(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-message-text">{error}</div>}

          <button 
            className="codegen-submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="animate-spin" /> Generating...</> : <>Generate Code <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* RIGHT: RESULTS */}
      <div className="codegen-output-panel">
        {!result && !isLoading && (
          <div className="placeholder-state">
            <Terminal size={48} className="text-slate-600 mb-4" />
            <h3>Ready to Code</h3>
            <p>Describe your logic, and let AI write the boilerplate for you.</p>
          </div>
        )}

        {isLoading && (
          <div className="placeholder-state">
            <Loader2 size={48} className="text-indigo-400 animate-spin mb-4" />
            <h3>Writing Code...</h3>
            <p>Implementing best practices and standard patterns.</p>
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
                  className="auto-save-banner" // Ensure CSS exists for this class
                >
                  <CheckCircle2 size={16} />
                  <span>Output auto-saved to <strong>{selectedProject?.name}</strong> history.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1. CODE BLOCK */}
            <div className="code-card">
              <div className="code-header">
                <div className="file-info">
                  <FileCode size={16} className="text-indigo-400" />
                  <span>Generated Solution</span>
                </div>
                <CopyButton text={result.generated_code} />
              </div>
              <pre className="code-block">
                <code>{result.generated_code}</code>
              </pre>
            </div>

            {/* 2. EXPLANATION */}
            <div className="info-card">
              <div className="info-header">
                <BookOpen size={18} className="text-blue-400" />
                <h4>Explanation</h4>
              </div>
              <p>{result.explanation}</p>
            </div>

            {/* 3. LIBRARIES */}
            {result.libraries_suggested && result.libraries_suggested.length > 0 && (
              <div className="libs-section">
                <h5 className="libs-title"><Layers size={14} /> Suggested Libraries</h5>
                <div className="libs-tags">
                  {result.libraries_suggested.map((lib, idx) => (
                    <span key={idx} className="lib-tag">{lib}</span>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default CodegenAssistant;