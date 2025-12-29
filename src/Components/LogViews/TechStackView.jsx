import React from 'react';
import { 
  Server, Info, AlertTriangle, Zap, 
  CheckCircle2, XCircle, Layers 
} from 'lucide-react';
import './TechStackView.css';

// --- HELPER: SCORE GAUGE ---
const ScoreGauge = ({ score }) => {
  const getColor = (s) => {
    if (s >= 8) return "#4ade80"; // Green
    if (s >= 5) return "#fbbf24"; // Yellow
    return "#f43f5e"; // Red
  };

  const color = getColor(score);

  return (
    <div className="tsv-score-gauge" style={{ borderColor: color }}>
      <span className="tsv-score-val" style={{ color: color }}>{score}/10</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
const TechStackView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No tech stack data available.</div>;

  return (
    <div className="tsv-history-container">
      
      {/* 1. Summary Header */}
      <div className="tsv-summary-card">
        <div className="tsv-summary-header">
          <Info size={20} className="text-purple-400" />
          <h4>Stack Analysis Summary</h4>
        </div>
        <p>{data.summary}</p>
      </div>

      {/* 2. Performance Review */}
      {data.performance_review && data.performance_review.length > 0 && (
        <div className="tsv-section">
          <h4 className="tsv-section-title">Architecture Health Check</h4>
          <div className="tsv-reviews-list">
            {data.performance_review.map((review, idx) => (
              <div key={idx} className="tsv-review-card">
                
                {/* Header: Title + Score */}
                <div className="tsv-review-header">
                  <div>
                    <h5>{review.attribute}</h5>
                    <span className="tsv-subtitle">Performance Metric</span>
                  </div>
                  <ScoreGauge score={review.score} />
                </div>

                {/* Issues */}
                {review.issues && review.issues.length > 0 && (
                  <div className="tsv-list-group issues">
                    <h6 className="text-red-400">
                      <AlertTriangle size={12} /> Detected Issues
                    </h6>
                    <ul>
                      {review.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {review.suggestions && review.suggestions.length > 0 && (
                  <div className="tsv-list-group suggestions">
                    <h6 className="text-yellow-400">
                      <Zap size={12} /> Optimization Tips
                    </h6>
                    <ul>
                      {review.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Recommended Stack */}
      {data.tech_recommendations && data.tech_recommendations.length > 0 && (
        <div className="tsv-section">
          <h4 className="tsv-section-title">Recommended Stack</h4>
          <div className="tsv-tech-grid">
            {data.tech_recommendations.map((tech, idx) => (
              <div key={idx} className="tsv-tech-card">
                <div className="tsv-tech-header">
                  <span className="tsv-tech-cat">{tech.category}</span>
                </div>
                <div className="tsv-tech-options">
                  {tech.options.map((opt, i) => (
                    <span key={i} className="tsv-tech-badge">{opt}</span>
                  ))}
                </div>
                <p className="tsv-tech-reason">{tech.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Comparison (Matched vs Missing) */}
      {data.reference_comparison && (
        <div className="tsv-comparison-section">
          
          {/* Matched Column */}
          <div className="tsv-comp-col matched">
            <h5 className="text-green-400">
              <CheckCircle2 size={16}/> Existing & Valid
            </h5>
            <ul>
              {data.reference_comparison.matched.length > 0 
                ? data.reference_comparison.matched.map((m, i) => <li key={i}>{m}</li>)
                : <li className="italic text-slate-500">No standard patterns matched.</li>
              }
            </ul>
          </div>

          {/* Missing Column */}
          <div className="tsv-comp-col missing">
            <h5 className="text-red-400">
              <XCircle size={16}/> Missing Components
            </h5>
            <ul>
               {data.reference_comparison.missing.length > 0 
                ? data.reference_comparison.missing.map((m, i) => <li key={i}>{m}</li>)
                : <li className="italic text-slate-500">No missing components detected.</li>
              }
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};

export default TechStackView;