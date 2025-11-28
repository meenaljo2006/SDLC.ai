import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Code2, Bug, Puzzle,           // Inner Orbit (Dev/Test)
  ShieldCheck, Database, Rocket, // Middle Orbit (Sec/Data/Version)
  Server, Clock, Lightbulb,  Network// Outer Orbit (Ops/Plan)

} from 'lucide-react';
import './AuthLayout.css';

const AuthLayout = () => {
  // Group 1: Inner Orbit (Development Focus)
  const innerIcons = [Code2, Bug, Puzzle];
  
  // Group 2: Middle Orbit (Infrastructure & Security)
  const middleIcons = [ShieldCheck, Database, Rocket];

  // Group 3: Outer Orbit (Planning & Operations)
  const outerIcons = [Server, Clock, Lightbulb,Network];

  return (
    <div className="auth-container">
      {/* LEFT SIDE: ORBIT ANIMATION */}
      <div className="auth-left">
        <div className="auth-grid-bg" />
        
        <div className="orbit-scene">
          
          {/* --- CENTRAL CORE --- */}
          <motion.div 
            className="orbit-core"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Cpu size={36} color="#000" />
            </div>
          </motion.div>

          {/* --- ORBIT 1: INNER (Fastest) --- */}
          <motion.div 
            className="orbit-ring inner-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {innerIcons.map((Icon, index) => (
              <div 
                key={index}
                className="orbit-item"
                style={{ 
                  transform: `rotate(${index * (360 / innerIcons.length)}deg) translate(110px) rotate(-${index * (360 / innerIcons.length)}deg)` 
                }}
              >
                <div className="icon-wrapper" style={{ borderColor: '#22d3ee', boxShadow: '0 0 10px rgba(34, 211, 238, 0.4)' }}>
                  <Icon size={18} color="#22d3ee" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* --- ORBIT 2: MIDDLE (Medium Speed, Reverse) --- */}
          <motion.div 
            className="orbit-ring middle-ring"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {middleIcons.map((Icon, index) => (
              <div 
                key={index}
                className="orbit-item"
                style={{ 
                  transform: `rotate(${index * (360 / middleIcons.length)}deg) translate(170px) rotate(-${index * (360 / middleIcons.length)}deg)` 
                }}
              >
                <div className="icon-wrapper" style={{ borderColor: '#34d399', boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)' }}>
                  <Icon size={18} color="#34d399" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* --- ORBIT 3: OUTER (Slowest) --- */}
          <motion.div 
            className="orbit-ring outer-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {outerIcons.map((Icon, index) => (
              <div 
                key={index}
                className="orbit-item"
                style={{ 
                  transform: `rotate(${index * (360 / outerIcons.length)}deg) translate(230px) rotate(-${index * (360 / outerIcons.length)}deg)` 
                }}
              >
                <div className="icon-wrapper" style={{ borderColor: '#a78bfa', boxShadow: '0 0 10px rgba(167, 139, 250, 0.4)' }}>
                  <Icon size={18} color="#a78bfa" />
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        <div className="auth-caption">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Intelligent SDLC
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Orchestrating design, security, and code in one seamless loop.
          </motion.p>
        </div>
      </div>

      {/* RIGHT SIDE: OUTLET FOR FORMS */}
      <div className="auth-right">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;