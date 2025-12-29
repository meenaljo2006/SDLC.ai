import React from 'react';
import { 
  Scale, Trophy, CheckCircle2, XCircle, 
  ArrowRightLeft, AlertTriangle 
} from 'lucide-react';
import './TradeOffView.css';

// --- HELPER: VERDICT BADGE ---
const VerdictBadge = ({ verdict, optionA, optionB }) => {
  const isA = verdict === 'A' || verdict === 'Option A';
  const label = isA ? optionA : optionB;
  
  return (
    <span className={`to-verdict-badge ${isA ? 'winner-a' : 'winner-b'}`}>
      <Trophy size={10} />
      Winner: {label}
    </span>
  );
};

// --- MAIN COMPONENT ---
const TradeOffView = ({ data }) => {
  if (!data) return <div className="text-slate-500">No trade-off data available.</div>;

  // Extract option names from the inputs or data if available
  // Assuming the data structure contains the comparison context
  const optionA = data.option_a || "Option A";
  const optionB = data.option_b || "Option B";

  return (
    <div className="to-history-container">
      
    {/* 1. Final Recommendation Card (UPDATED STRUCTURE) */}
      <div className="to-recommendation-card">
        <div className="to-rec-header">
          <CheckCircle2 className="text-emerald-400" size={24} />
          <span className="to-rec-label">Recommended Choice</span>
          
          <div className="to-rec-content">
            <h3 className="to-rec-title">{data.recommendation.decision}</h3>
            <p className="to-rec-text">{data.recommendation.justification}</p>
          </div>
        </div>
      </div>

      {/* 2. Detailed Comparison Matrix */}
      {data.matrix && data.matrix.length > 0 && (
        <div className="to-section">
          <h4 className="to-section-title">
            <Scale size={16} /> Comparison Analysis
          </h4>
          
          <div className="to-matrix-list">
            {data.matrix.map((item, idx) => (
              <div key={idx} className="to-matrix-card">
                
                <div className="to-matrix-top">
                  <span className="to-criterion">{item.criterion}</span>
                  <VerdictBadge 
                    verdict={item.verdict} 
                    optionA={optionA} 
                    optionB={optionB} 
                  />
                </div>
                
                <p className="to-notes">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Trade-offs / Risks (Optional if present) */}
      {data.trade_offs && (
         <div className="to-alert-box">
           <div className="to-alert-header">
             <AlertTriangle size={16} />
             <span>Critical Trade-offs</span>
           </div>
           <p>{data.trade_offs}</p>
         </div>
      )}

    </div>
  );
};

export default TradeOffView;