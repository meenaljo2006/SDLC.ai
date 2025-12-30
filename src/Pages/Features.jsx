import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Server, ShieldCheck, Zap, 
  Layout, GitBranch, Terminal, Database, 
  Search, FileText, Lock
} from 'lucide-react';
import './Features.css';

// Container variant
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Card variant
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const Features = () => {
  return (
    <div className="features-container">
      <div className="features-header">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          System <span className="gradient-text">Capabilities</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          An integrated suite of 9 powerful engines driving the future of software engineering.
        </motion.p>
      </div>

      <motion.div 
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 1. CORE ENGINE */}
        <motion.div className="bento-card core-card" variants={cardVariants}>
          <div className="card-bg-glow" />
          <div className="card-featuresheader">
            <Cpu className="card-icon" color="#22d3ee" />
            <h3>Hybrid AI Core</h3>
          </div>
          <div className="card-content">
            <div className="feature-item">
              <span className="tag">Gateway</span>
              <p>Unified RESTful API (Flask) accessing the entire suite.</p>
            </div>
            <div className="feature-item">
              <span className="tag">Hybrid</span>
              <p>External LLM + Local BERT for optimal speed/cost ratio.</p>
            </div>
            <div className="feature-item">
              <span className="tag">Reliable</span>
              <p>Structured Markdown output enforcement for guaranteed consistency.</p>
            </div>
          </div>
        </motion.div>

        {/* 2. CODING ACCELERATION */}
        <motion.div className="bento-card coding-card" variants={cardVariants}>
          <div className="card-featuresheader">
            <Terminal className="card-icon" color="#34d399" />
            <h3>Dev Acceleration</h3>
          </div>
          <ul className="feature-list">
            <li>
              <strong>Compliance Check</strong>
              <span>API-07: Auto-validates against internal standards.</span>
            </li>
            <li>
              <strong>Boilerplate Gen</strong>
              <span>API-08: Instantly scaffolds patterns.</span>
            </li>
            <li>
              <strong>Smart Debug</strong>
              <span>API-09: Context-aware fixes from stack traces.</span>
            </li>
          </ul>
        </motion.div>

        {/* 3. SDLC COVERAGE */}
        <motion.div className="bento-card coverage-card" variants={cardVariants}>
          <div className="card-featuresheader">
            <Layout className="card-icon" color="#a78bfa" />
            <h3>Full SDLC Coverage</h3>
          </div>
          <div className="tools-grid">
            <div className="tool-box">
              <LightbulbIcon /> <span>Design Suggestions</span> <small>API-04</small>
            </div>
            <div className="tool-box">
              <ScaleIcon /> <span>Trade-off Analysis</span> <small>API-01</small>
            </div>
            <div className="tool-box">
              <ShieldIcon /> <span>Risk Mitigation</span> <small>API-03</small>
            </div>
            <div className="tool-box">
              <FileIcon /> <span>Formal Review</span> <small>API-02</small>
            </div>
          </div>
        </motion.div>

        {/* 4. MANAGEMENT (Updated Structure) */}
        <motion.div className="bento-card mgmt-card" variants={cardVariants}>
          <div className="mgmt-header-row">
            <div className="mgmt-title">
              <Database className="card-icon" color="#fbbf24" />
              <h3>Project Management</h3>
            </div>
            <div className="status-indicator">
              <div className="pulse-dot" /> All Systems Operational
            </div>
          </div>
          
          <div className="mgmt-body">
             <p className="mgmt-desc">
               Centralized history tracking (User → Project → Analysis) with visual workflow guidance.
             </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

// Icons
const LightbulbIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const ScaleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>;
const ShieldIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FileIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;

export default Features;