import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Scale, ShieldCheck, FileSearch, Code2 } from 'lucide-react';
import './Workflow.css';

const WORKFLOW_STEPS = [
  { 
    id: 1, 
    title: "Design Concepts", 
    subtitle: "PS-04: Design Suggestion", 
    icon: Lightbulb,
    description: "AI analyzes your abstract requirements and instantly suggests optimal architectural patterns and system designs.",
    color: "#22d3ee" // Cyan
  },
  { 
    id: 2, 
    title: "Decision Making", 
    subtitle: "PS-01: Trade-off Analysis", 
    icon: Scale,
    description: "Automatically compares multiple design options based on cost, performance, scalability, and implementation speed.",
    color: "#a78bfa" // Purple
  },
  { 
    id: 3, 
    title: "Proactive Security", 
    subtitle: "PS-03: Design Risk Analysis", 
    icon: ShieldCheck,
    description: "Scans your proposed architecture for security vulnerabilities and compliance gaps before a single line of code is written.",
    color: "#34d399" // Emerald
  },
  { 
    id: 4, 
    title: "Formal Review", 
    subtitle: "PS-02: Design Review", 
    icon: FileSearch,
    description: "Generates formal PDR/CDR documentation and checklists, ensuring your design meets all engineering standards.",
    color: "#f472b6" // Pink
  },
  { 
    id: 5, 
    title: "Dev Readiness", 
    subtitle: "PS-06: Test Generation", 
    icon: Code2,
    description: "Translates approved designs into actionable development tasks, API skeletons, and comprehensive test cases.",
    color: "#fbbf24" // Amber
  }
];

const Workflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 4000); // Slower 4s rotation for better reading
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="wf-section">
      <div className="wf-header">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How It <span className="gradient-text">Works</span>
        </motion.h2>
        <p>A continuous intelligence loop for your engineering team.</p>
      </div>

      <div className="wf-console-container">
        
        {/* LEFT SIDE: Navigation List */}
        <div className="wf-console-nav">
          {WORKFLOW_STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`wf-nav-item ${index === activeStep ? 'active' : ''}`}
              onClick={() => { setActiveStep(index); setIsAutoPlaying(false); }}
            >
              <div className="wf-nav-indicator">
                <div className="wf-nav-dot" style={{ borderColor: index === activeStep ? step.color : '' }}>
                  {index === activeStep && <motion.div layoutId="activeDot" className="wf-dot-fill" style={{ backgroundColor: step.color }} />}
                </div>
                {index !== WORKFLOW_STEPS.length - 1 && <div className="wf-nav-line" />}
              </div>
              <div className="wf-nav-label">
                <span className="wf-nav-title" style={{ color: index === activeStep ? '#fff' : '' }}>{step.title}</span>
                <span className="wf-nav-code">{step.subtitle.split(':')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: The Holographic Stage */}
        <div className="wf-console-stage">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={activeStep}
              className="wf-stage-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ 
                borderColor: WORKFLOW_STEPS[activeStep].color,
                boxShadow: `0 0 30px -10px ${WORKFLOW_STEPS[activeStep].color}40` // Transparent colored glow
              }}
            >
              <div className="wf-stage-icon-bg" style={{ backgroundColor: `${WORKFLOW_STEPS[activeStep].color}20` }}>
                {React.createElement(WORKFLOW_STEPS[activeStep].icon, { 
                  size: 48, 
                  color: WORKFLOW_STEPS[activeStep].color 
                })}
              </div>
              
              <div className="wf-stage-content">
                <h3 style={{ color: WORKFLOW_STEPS[activeStep].color }}>{WORKFLOW_STEPS[activeStep].title}</h3>
                <div className="wf-stage-tag">{WORKFLOW_STEPS[activeStep].subtitle}</div>
                <p>{WORKFLOW_STEPS[activeStep].description}</p>
              </div>

              {/* Decoration: Corner Brackets */}
              <div className="wf-corner wf-top-left" style={{ borderColor: WORKFLOW_STEPS[activeStep].color }} />
              <div className="wf-corner wf-bottom-right" style={{ borderColor: WORKFLOW_STEPS[activeStep].color }} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Workflow;