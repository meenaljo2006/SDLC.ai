import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import SDLCVisualizer from '../Components/SDLCVisualizer';
import './Home.css';
import { useNavigate } from "react-router-dom";

// Variants for text appearing
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5, // Starts after Navbar
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const Home = () => {

  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");

  return (
    <main className="hero-grid">
      {/* LEFT SIDE */}
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="Versionbadge">
          <span className="ping-dot"></span> v1.0 is now live
        </motion.div>
        
        <motion.h1 variants={itemVariants}>
          Intelligent <br /><span className="gradient-text">SDLC Assistant</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="subtitle">
          Stop switching between diagrams and IDEs. The first AI that unifies 
          <strong> Architecture Design</strong> and <strong> Production Code</strong> in one living ecosystem.
        </motion.p>

        {/* BUTTON SLIDE ANIMATION */}
        <motion.div 
          className="cta-row"
          variants={itemVariants} // Appears with text
        >
          {/* Input Box: Starts width 0, expands to reveal itself, pushing button right */}
          <motion.div 
            className="email-input-box"
            initial={{ width: 0, opacity: 0, padding: 0, border: "none" }}
            animate={{ width: "auto", opacity: 1, padding: "0.8rem 1.2rem", border: "1px solid rgba(255, 255, 255, 0.1)" }}
            transition={{ duration: 0.8, delay: 1.5, ease: "backOut" }} // Delays expansion until after text is read
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            <Mail size={18} className="input-icon" style={{ minWidth: '18px' }} />
            <input 
              type="email" 
              placeholder="Enter work email..." 
              className="hero-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </motion.div>
          
          <button className="btn-primary" onClick={() => navigate("/register", { state: { email } })}>Get Started <ArrowRight size={18}/></button>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE */}
      <SDLCVisualizer />
    </main>
  );
};

export default Home;