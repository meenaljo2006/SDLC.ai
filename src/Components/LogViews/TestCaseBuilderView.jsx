import React from 'react';
import { 
  ListChecks, CheckCircle2, AlertTriangle, 
  HelpCircle, PlayCircle 
} from 'lucide-react';
import './TestCaseBuilderView.css';

// --- HELPER: TYPE BADGE ---
const TypeBadge = ({ type }) => {
  const styles = {
    Positive: { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', icon: CheckCircle2 },
    Negative: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', icon: AlertTriangle },
    Edge:     { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', icon: HelpCircle }
  };
  
  const style = styles[type] || styles.Positive;
  const Icon = style.icon;

  return (
    <span className="tcb-type-badge" style={{ background: style.bg, color: style.color }}>
      <Icon size={10} /> {type}
    </span>
  );
};

// --- MAIN COMPONENT ---
const TestCaseBuilderView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No test case data available.</div>;

  return (
    <div className="tcb-history-container">
      
      {/* Header Summary */}
      <div className="tcb-summary-header">
        <ListChecks size={20} className="text-teal-400" />
        <h4>Generated Test Scenarios ({data.cases?.length || 0})</h4>
      </div>

      {/* Test Cases List */}
      <div className="tcb-cases-list">
        {data.cases?.map((testCase, idx) => (
          <div key={idx} className="tcb-card">
            
            {/* Card Header */}
            <div className="tcb-card-header">
              <div className="tcb-title-group">
                <span className="tcb-id">{testCase.id}</span>
                <h4 className="tcb-title">{testCase.title}</h4>
              </div>
              <TypeBadge type={testCase.type} />
            </div>

            {/* BDD Grid */}
            <div className="tcb-bdd-grid">
              
              {/* GIVEN */}
              <div className="tcb-bdd-row">
                <div className="tcb-label-col">
                  <span className="tcb-bdd-label given">GIVEN</span>
                </div>
                <p>{testCase.given}</p>
              </div>

              {/* WHEN */}
              <div className="tcb-bdd-row">
                <div className="tcb-label-col">
                  <span className="tcb-bdd-label when">WHEN</span>
                </div>
                <p>{testCase.when}</p>
              </div>

              {/* THEN */}
              <div className="tcb-bdd-row">
                <div className="tcb-label-col">
                  <span className="tcb-bdd-label then">THEN</span>
                </div>
                <p>{testCase.then}</p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TestCaseBuilderView;