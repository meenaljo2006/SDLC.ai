import React from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, 
  AlertTriangle, BookOpen, AlertOctagon, Terminal
} from 'lucide-react';
import './ComplianceAuditorView.css';

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
      className="ca-severity-badge" 
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
const ComplianceAuditorView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No compliance data available.</div>;

  // Use overall_score (from API) or compliance_score (fallback)
  const score = data.overall_score || data.compliance_score || 0;
  
  // Use findings (from API) or key_findings (fallback)
  const findings = data.findings || data.key_findings || [];

  return (
    <div className="ca-history-container">
      
      {/* 1. Overall Score / Summary Card */}
      <div className="ca-summary-card">
        <div className="ca-summary-header">
          <ShieldCheck size={20} className="text-emerald-400" />
          <div>
            <h4>Audit Summary</h4>
            <span className="ca-regulation">Quality Score: {score}/100</span>
          </div>
        </div>
        <p>{data.summary}</p>
      </div>

      {/* 2. Detected Issues List */}
      {findings.length > 0 ? (
        <div className="ca-section">
          <h4 className="ca-section-title">Detected Issues ({findings.length})</h4>
          <div className="ca-findings-list">
            {findings.map((item, idx) => (
              <div key={idx} className="ca-finding-card">
                
                <div className="ca-finding-top">
                  <div className="ca-meta-group">
                    {item.line && (
                      <span className="ca-line-badge">
                        <Terminal size={10} /> Line {item.line}
                      </span>
                    )}
                    <span className="ca-type-label">{item.type}</span>
                  </div>
                  <SeverityBadge level={item.severity || item.status} />
                </div>
                
                <p className="ca-check-text">{item.message || item.description}</p>
                
                {item.recommendation && (
                  <div className="ca-rec-box">
                    <strong>Fix:</strong> {item.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State if Score is high */
        <div className="ca-perfect-state">
           <CheckCircle2 size={24} className="text-green-400" />
           <span>Clean code! No issues found.</span>
        </div>
      )}

      {/* 3. Remediation Steps (If available) */}
      {data.remediation_steps && data.remediation_steps.length > 0 && (
        <div className="ca-section">
          <h4 className="ca-section-title">Remediation Plan</h4>
          <ul className="ca-remediation-list">
            {data.remediation_steps.map((step, idx) => (
              <li key={idx} className="ca-rem-item">
                <div className="ca-rem-icon"><BookOpen size={14}/></div>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default ComplianceAuditorView;