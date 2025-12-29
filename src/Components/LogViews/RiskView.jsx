import React from 'react';
import { 
  Activity, ShieldCheck, AlertTriangle, 
  AlertOctagon, CheckCircle2 
} from 'lucide-react';
import './RiskView.css';

// --- HELPER: SCORE BADGE ---
const RiskScoreBadge = ({ score }) => {
  let colorClass = "low";
  let label = "Low";

  if (score >= 10) { colorClass = "critical"; label = "Critical"; }
  else if (score >= 7) { colorClass = "high"; label = "High"; }
  else if (score >= 4) { colorClass = "medium"; label = "Medium"; }

  return (
    <div className={`rv-score-badge ${colorClass}`}>
      <span className="rv-score-num">{score}/12</span>
      <span className="rv-score-cat">{label}</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
const RiskView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No risk data available.</div>;

  return (
    <div className="rv-history-container">
      
      {/* 1. Assessment Summary */}
      <div className="rv-summary-card">
        <div className="rv-summary-header">
          <Activity size={20} className="text-orange-400" />
          <h4>Assessment Summary</h4>
        </div>
        <p>{data.summary}</p>
      </div>

      {/* 2. Risks List */}
      {data.risks && data.risks.length > 0 && (
        <div className="rv-section">
          <h4 className="rv-section-title">Identified Risks ({data.risks.length})</h4>
          <div className="rv-risks-list">
            {data.risks.map((risk, idx) => (
              <div key={idx} className="rv-risk-card">
                
                {/* Header: Category & Score */}
                <div className="rv-card-top">
                  <span className="rv-category">{risk.category}</span>
                  <RiskScoreBadge score={risk.score} />
                </div>

                {/* Body: Description */}
                <h5 className="rv-description">{risk.description}</h5>

                {/* Footer: Mitigation & Owner */}
                <div className="rv-card-footer">
                  <div className="rv-mitigation-box">
                    <div className="rv-mit-label">
                      <ShieldCheck size={14} /> Mitigation Strategy:
                    </div>
                    <p>{risk.mitigation}</p>
                  </div>
                  
                  {risk.owner && (
                    <div className="rv-meta-row">
                      <span>Action Required By: <strong className="text-slate-300">{risk.owner}</strong></span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!data.risks || data.risks.length === 0) && (
        <div className="rv-safe-state">
          <CheckCircle2 size={32} className="text-green-500" />
          <p>No significant risks identified.</p>
        </div>
      )}

    </div>
  );
};

export default RiskView;