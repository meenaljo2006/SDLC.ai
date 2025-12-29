import React from 'react';
import { 
  FileText, AlertOctagon, ShieldAlert, Activity, 
  CheckSquare, ShieldCheck 
} from 'lucide-react';
import './DesignReviewView.css';

// --- HELPER: SEVERITY BADGE ---
const SeverityBadge = ({ level }) => {
  const styles = {
    Critical: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' }, // Red
    High:     { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: 'rgba(249, 115, 22, 0.3)' }, // Orange
    Medium:   { bg: 'rgba(234, 179, 8, 0.15)',  color: '#eab308', border: 'rgba(234, 179, 8, 0.3)' },  // Yellow
    Low:      { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }  // Blue
  };

  const style = styles[level] || styles.Medium;

  return (
    <span 
      className="dr-severity-badge" 
      style={{ 
        backgroundColor: style.bg, 
        color: style.color,
        borderColor: style.border
      }}
    >
      {level}
    </span>
  );
};

// --- MAIN COMPONENT ---
const DesignReviewView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No review data available.</div>;

  return (
    <div className="dr-history-container">
      
      {/* 1. Executive Summary */}
      <div className="dr-summary-card">
        <div className="dr-summary-header">
          <FileText size={18} className="text-emerald-400" />
          <h4>Executive Summary</h4>
        </div>
        <p>{data.summary}</p>
      </div>

      {/* 2. Risks Grid */}
      {data.risks && data.risks.length > 0 && (
        <div className="dr-section">
          <h4 className="dr-section-title">Identified Risks</h4>
          <div className="dr-risks-grid">
            {data.risks.map((risk, i) => (
              <div key={i} className="dr-risk-card">
                <div className="dr-risk-header">
                  <span className="dr-risk-area">{risk.area}</span>
                  <SeverityBadge level={risk.severity} />
                </div>
                
                <div className="dr-risk-body">
                  <div className="dr-risk-row">
                    <span className="dr-label">Impact:</span>
                    <span className="dr-value">{risk.impact}</span>
                  </div>
                  <div className="dr-mitigation-box">
                    <div className="dr-mit-label">
                        <ShieldCheck size={14} className="text-emerald-400"/> Mitigation
                    </div>
                    <p>{risk.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Action Items */}
      {data.action_items && data.action_items.length > 0 && (
        <div className="dr-section">
          <h4 className="dr-section-title">Recommended Actions</h4>
          <div className="dr-actions-list">
            {data.action_items.map((item, i) => (
              <div key={i} className="dr-action-item">
                <CheckSquare size={16} className="text-blue-400 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DesignReviewView;