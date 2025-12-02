import React from "react";
import { useParams } from "react-router-dom";

// Import the actual components for each tool
import ArchitectureGenerator from "../Tools/ArchitectureGenerator";
import TradeoffAnalyzer from "../Tools/TradeoffAnalyzer";
import TechStackSelector from "../Tools/TechStackSelector";
import DesignReviewer from "../Tools/DesignReviewer";
import RiskScanner from "../Tools/RiskScanner";
import ComplianceAuditor from "../Tools/ComplianceAuditor";
import TestCaseBuilder from "../Tools/TestCaseBuilder";
import CodegenAssistant from "../Tools/CodegenAssistant";
import SmartDebugger from "../Tools/SmartDebugger";

const ToolPage = () => {
  const { toolId } = useParams();

  // Map toolId to actual components
  const toolMap = {
    design: <ArchitectureGenerator />,
    tradeoff: <TradeoffAnalyzer />,
    "tech-stack": <TechStackSelector />,
    review: <DesignReviewer />,
    risk: <RiskScanner />,
    compliance: <ComplianceAuditor />,
    "test-gen": <TestCaseBuilder />,
    codegen: <CodegenAssistant />,
    debug: <SmartDebugger />,
  };

  // Render the matching tool component
  return <div>{toolMap[toolId]}</div>;
};

export default ToolPage;
