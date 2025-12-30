import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Layers, Terminal, Loader2 } from 'lucide-react';
import './SDLCVisualizer.css';

const SDLC_STEPS = [
  { text: "Parsing Architecture...", status: "SCANNING", highlight: "Design.fig" },
  { text: "Validating Patterns...", status: "CHECKING", highlight: "Security" },
  { text: "Optimizing DB Schema...", status: "BUILDING", highlight: "SQLAlchemy" },
  { text: "Generating API Routes...", status: "WRITING", highlight: "Flask" },
  { text: "Compiling Frontend...", status: "BUNDLING", highlight: "React" },
];

const TOTAL_DURATION = 12.5; 

const PercentageDisplay = ({ value }) => {
  const ref = useRef(null);
  useEffect(() => {
    const unsubscribe = value.on("change", (latest) => {
      if (ref.current) { ref.current.textContent = `${Math.round(latest)}%`; }
    });
    return () => unsubscribe();
  }, [value]);
  return <span ref={ref} style={{ minWidth: '3ch', textAlign: 'right' }}>0%</span>;
};

const SDLCVisualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = useMotionValue(0);
  const widthPercent = useMotionTemplate`${progress}%`;

  useEffect(() => {
    // Start internal logic AFTER the entrance animation (approx 3s delay)
    const timeoutId = setTimeout(() => {
        const controls = animate(progress, 100, {
        duration: TOTAL_DURATION,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 0.5, 
        onUpdate: (latest) => {
            const stepIndex = Math.min(
            Math.floor((latest / 100) * SDLC_STEPS.length),
            SDLC_STEPS.length - 1
            );
            setCurrentStep((prev) => (prev !== stepIndex ? stepIndex : prev));
        }
        });
        return () => controls.stop();
    }, 3500); // Wait for entrance to finish

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <motion.div 
      className="animation-wrapper"
      // No initial animation on wrapper, we animate contents
    >
      <motion.div 
        className="core-glow" 
        initial={{ opacity: 0, scale: 0 }} 
        animate={{ opacity: [0, 0.5, 0.2], scale: 1 }} 
        transition={{ delay: 2.2, duration: 0.8 }} 
      />
      
      <svg className="SDLC-svg-layer" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* LEFT WIRE (L-Shape) */}
        {/* Logic: Starts drawing AFTER hub appears (delay 2.8s) */}
        <motion.path 
            d="M 240 200 L 90 200 L 90 -63" 
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 2.8, ease: "linear" }}
        />
        <motion.path 
            d="M 240 200 L 90 200 L 90 70" 
            fill="none" stroke="url(#gradient)" strokeWidth="3" filter="url(#glow-line)"
            initial={{ pathLength: 0, strokeDashoffset: 100, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [-100, 0] }}
            transition={{ 
                pathLength: { duration: 0.8, delay: 2.8, ease: "linear" }, // Draws line
                strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear", delay: 3.6 } // Starts pulse
            }}
            strokeDasharray="50 150"
        />
        <motion.circle cx="240" cy="200" r="4" fill="#333" stroke="#22d3ee" strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}/>
        {/* <motion.circle cx="90" cy="70" r="4" fill="#22d3ee" initial={{scale:0}} animate={{scale:1}} transition={{delay:3.6}}/> */}

        {/* RIGHT WIRE (L-Shape) */}
        <motion.path 
            d="M 560 200 L 710 200 L 710 450" 
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 2.8, ease: "linear" }}
        />
        <motion.path 
            d="M 560 200 L 710 200 L 710 330" 
            fill="none" stroke="url(#gradient)" strokeWidth="3" filter="url(#glow-line)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -200] }}
            transition={{ 
                pathLength: { duration: 0.8, delay: 2.8, ease: "linear" },
                strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear", delay: 3.6 }
            }}
            strokeDasharray="50 150"
        />
        <motion.circle cx="560" cy="200" r="4" fill="#333" stroke="#22d3ee" strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}/>
        {/* <motion.circle cx="710" cy="330" r="4" fill="#22d3ee" initial={{scale:0}} animate={{scale:1}} transition={{delay:3.6}}/> */}
      </svg>

      {/* --- CENTRAL HUB --- */}
      {/* Pops in after button slide (delay 2.2s) */}
      <motion.div 
        className="central-hub"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, boxShadow: ["0 0 0px #06b6d4", "0 0 30px rgba(6,182,212,0.2)", "0 0 0px #06b6d4"] }}
        transition={{ 
            scale: { duration: 0.5, delay: 2.2, ease: "backOut" },
            boxShadow: { duration: 3, repeat: Infinity, delay: 2.7 }
        }}
      >
        <div className="window-header">
          <div className="dot red" /> <div className="dot yellow" /> <div className="dot green" />
        </div>
        <div className="window-content">
          <div className="status-line">
            <span>SYSTEM_ID: <span style={{color:'#fff'}}>SDLC-V1</span></span>
            <span className="status-badge">ONLINE</span>
          </div>
          <div className="log-container">
            <AnimatePresence mode='wait'>
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="log-item"
              >
                 <span style={{color: '#10b981'}}>➜</span>
                 <span className="log-text">{SDLC_STEPS[currentStep].text}</span>
              </motion.div>
            </AnimatePresence>
            <motion.div className="log-item" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Loader2 size={12} className="animate-spin text-cyan-400"/>
              <span className="log-text" style={{fontSize: '0.7rem', opacity: 0.7}}>
                  Processing: <span className="log-highlight">{SDLC_STEPS[currentStep].highlight}</span>
              </span>
            </motion.div>
          </div>
          <div className="progress-area">
            <div className="progress-label">
              <span>{SDLC_STEPS[currentStep].status}</span>
              <PercentageDisplay value={progress} />
            </div>
            <div className="progress-track">
              <motion.div 
                className="progress-bar"
                style={{ width: widthPercent, height: "100%", background: "var(--primary-cyan)" }} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- FLOATING NODES --- */}
      {/* Appear last after wires connect (delay 3.6s) */}
      <motion.div 
        className="node node-left" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 0.5 }}
      >
        <div className="node-icon"><Layers size={20} /></div>
        <div className="node-content">
          <div className="node-title">Design Phase</div>
          <div className="node-subtitle">Architecture & UI</div>
        </div>
        {/* <div className="connector-knob bottom-knob"></div>  */}
      </motion.div>

      <motion.div 
        className="node node-right" 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 0.5 }}
      >
        <div className="node-icon code-icon">
          <Terminal size={20} />
        </div>
        <div className="node-content">
          <div className="node-title">Production</div>
          <div className="node-subtitle">Deployed Code</div>
        </div>
        {/* <div className="connector-knob top-knob"></div> */}
      </motion.div>

    </motion.div>
  );
};

export default SDLCVisualizer;