import React, { useEffect, useRef } from 'react';
import { Check, X, Layers } from 'lucide-react';
import './ArchGenView.css';

// --- INTERNAL MERMAID COMPONENT (FIXED) ---
const InternalMermaid = ({ chartCode }) => {
  const ref = useRef(null);

  useEffect(() => {
    const renderChart = async () => {
      if (chartCode && ref.current) {
        try {
          const mermaid = (await import('mermaid/dist/mermaid.esm.min.mjs')).default;
          
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            themeVariables: {
              fontFamily: "Inter, sans-serif",
              primaryColor: "#020617",
              primaryTextColor: "#e5e7eb",
              primaryBorderColor: "white",
              lineColor: "#94a3b8",
              secondaryColor: "#1e293b",
              tertiaryColor: "#0f172a",
            },
          });
          
          // 👇 FIX 1: Decode HTML Entities (Convert &gt; to >)
          let cleanCode = chartCode
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"');

          // 👇 FIX 2: Ensure it starts with "graph TD"
          if (!cleanCode.trim().startsWith("graph") && !cleanCode.trim().startsWith("flowchart")) {
            cleanCode = `graph TD\n${cleanCode}`;
          }
          
          // Generate unique ID
          const uniqueId = `mermaid-hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Render
          const { svg } = await mermaid.render(uniqueId, cleanCode);
          ref.current.innerHTML = svg;
          
        } catch (err) {
          console.error("Mermaid Error:", err);
          // Show a nice error box instead of crashing
          ref.current.innerHTML = `
            <div style="color:#ef4444; font-size:12px; padding:10px; border:1px dashed #ef4444; border-radius:6px; background:rgba(239,68,68,0.1);">
              Diagram Syntax Error (Check Console)
            </div>`;
        }
      }
    };
    renderChart();
  }, [chartCode]);

  return <div className="mermaid-container" ref={ref} />;
};

// --- MAIN VIEW COMPONENT ---
const ArchGenView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No architecture data available.</div>;

  return (
    <div className="arch-history-container">
      
      {/* 1. Recommendation Box */}
      <div className="arch-recommendation-box">
        <div className="record-header">
            <Layers size={18} />
            <h4>AI Recommendation</h4>
        </div>
        <p>{data.recommendation}</p>
      </div>

      {/* 2. Options List */}
      <div className="arch-options-list">
        {data.options?.map((opt, i) => (
          <div key={i} className="arch-history-card">
            
            {/* Option Header */}
            <div className="arch-card-header">
              <span className="option-number">Option {i+1}</span>
              <h4 className="option-name">{opt.name}</h4>
              <span className="option-badge">{opt.when_to_use}</span>
            </div>

            {/* Diagram */}
            <div className="arch-diagram-wrapper">
               <InternalMermaid chartCode={opt.diagram_mermaid} />
            </div>

            {/* Pros & Cons Grid */}
            <div className="pros-cons-wrapper">
              
              {/* Pros */}
              <div className="pc-column">
                <h5 className="pc-title pro">
                  <Check size={14} /> Pros
                </h5>
                <ul>
                  {opt.pros?.map((p, k) => <li key={k}>{p}</li>)}
                </ul>
              </div>

              {/* Cons */}
              <div className="pc-column">
                <h5 className="pc-title con">
                  <X size={14} /> Cons
                </h5>
                <ul>
                  {opt.cons?.map((c, k) => <li key={k}>{c}</li>)}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchGenView;