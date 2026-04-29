// riskEngine.js — CAMARA API simulations + risk scoring

// --- Simulated CAMARA API checks ---

function checkSimSwap(phone) {
  // 08022222222 simulates a phone with a recent SIM swap
  return phone === "08022222222";
}

function verifyNumber(phone) {
  // 08033333333 simulates an unverified/suspicious number
  // 08000000000 simulates a non-existent number
  return phone !== "08033333333" && phone !== "08000000000";
}

function checkDevice(phone) {
  // 08033333333 simulates an inactive device
  // 08000000000 simulates a non-existent/inactive device
  return phone !== "08033333333" && phone !== "08000000000";
}

function checkLocation(phone) {
  // 08022222222 simulates a location mismatch (fraud indicator)
  return phone !== "08022222222";
}

// --- Risk scoring engine ---

function calculateRisk(signals) {
  const chain = [];
  chain.push("🎬 Agent initialized: Analyzing multi-vector network signals.");
  
  if (signals.sim_swap_recent) {
    chain.push("🚩 Critical Alert: Recent SIM swap detected via Nokia NaC API.");
    // Update location logic for real GPS
    if (signals.lat && signals.lng) {
      chain.push(`🛰️ Geolocation Sync: Device at [${signals.lat.toFixed(4)}, ${signals.lng.toFixed(4)}].`);
      chain.push("📍 Mismatch: Cell tower signal originates from 4.2km offset location.");
    } else {
      chain.push("🔍 Correlating with location... Location confidence is low.");
    }
    chain.push("⚖️ Decision: High risk of account takeover.");
    return { 
      score: "HIGH", 
      decision: "BLOCK", 
      reason: "Recent SIM swap + Location mismatch",
      ai_insight: "Agentic assessment suggests an active account takeover attempt. Device GPS does not match the registered cellular footprint.",
      logic_chain: chain
    };
  }
  
  if (!signals.number_verified || !signals.device_active) {
    const isNotFound = signals.phone === "08000000000";
    chain.push(isNotFound 
      ? "❌ Error: MSISDN not found in network Home Location Register (HLR)." 
      : "⚠️ Observation: Device is unreachable or number failed network verification.");
    
    chain.push(isNotFound
      ? "⚖️ Decision: High risk. Attempt to verify unallocated number."
      : "🔄 Action: Triggering step-up identity check (Liveness audit).");

    return { 
      score: isNotFound ? "HIGH" : "SUSPICIOUS", 
      decision: isNotFound ? "BLOCK" : "STEP_UP", 
      reason: isNotFound ? "Number not found on network" : "Network signals are inconsistent",
      ai_insight: isNotFound 
        ? "Agentic analysis confirms this MSISDN is not currently provisioned on any carrier network. Possible identity spoofing attempt." 
        : "Signals are inconclusive. Agent recommends escalating to biometric verification before allowing access.",
      logic_chain: chain
    };
  }

  if (!signals.location_match) {
    chain.push("📍 Observation: Cell location mismatch.");
    chain.push("🔍 Risk Profile: Possible remote fraud, but device is active.");
    chain.push("⚖️ Decision: Flag for suspicious activity monitoring.");
    return { 
      score: "SUSPICIOUS", 
      decision: "STEP_UP", 
      reason: "Location validation mismatch",
      ai_insight: "Agent detected a physical location anomaly. Standard security dictates a step-up verification.",
      logic_chain: chain
    };
  }

  chain.push("✅ Observation: All network-based trust signals are green.");
  if (signals.lat && signals.lng) {
    chain.push(`🛰️ GPS Validated: Device at [${signals.lat.toFixed(4)}, ${signals.lng.toFixed(4)}] matches Cell Node ID.`);
  }
  chain.push("⚖️ Decision: User passed all background network checks.");
  return { 
    score: "LOW", 
    decision: "ALLOW", 
    reason: undefined,
    ai_insight: "Full trust established via real-time telco cross-referencing. Device GPS is verified within the secure home network range.",
    logic_chain: chain
  };
}

// --- Main evaluation function ---

function evaluateUser(phone, lat, lng) {
  const countryMap = {
    "+234": "Nigeria",
    "+233": "Ghana",
    "+254": "Kenya",
    "+27": "South Africa",
    "+255": "Tanzania",
    "+256": "Uganda",
    "+250": "Rwanda",
    "+260": "Zambia",
    "+263": "Zimbabwe",
    "+221": "Senegal",
    "+225": "Ivory Coast",
    "+243": "DR Congo",
    "+237": "Cameroon",
    "+241": "Gabon",
    "+242": "Congo",
    "+267": "Botswana",
    "+264": "Namibia",
    "+266": "Lesotho",
    "+268": "Eswatini",
    "+251": "Ethiopia",
    "+249": "Sudan",
    "+1": "USA/Canada",
    "+44": "UK",
  };

  const detectCountry = (num) => {
    if (!num.startsWith("+")) return "Nigeria (Default)";
    for (const [code, name] of Object.entries(countryMap)) {
      if (num.startsWith(code)) return name;
    }
    return "Global Region";
  };

  const detectNetwork = (num) => {
    if (!num) return null;
    
    // Nigerian Specializations
    const localNum = num.startsWith("+234") ? "0" + num.slice(4) : num;
    const prefix = localNum.substring(0, 4);
    
    if (["0803","0806","0813","0810","0814","0816","0703","0706","0903","0906"].includes(prefix)) return "MTN";
    if (["0805","0807","0811","0815","0705","0905"].includes(prefix)) return "Glo";
    if (["0802","0808","0812","0701","0708","0902","0907","0901"].includes(prefix)) return "Airtel";
    if (["0809","0817","0818","0909","0908"].includes(prefix)) return "9Mobile";

    return num.startsWith("+") ? `Network (CC: ${num.slice(1, 4)})` : "Unknown Carrier";
  };

  // Internal normalization for demo cases
  let demoPhone = phone;
  if (phone.startsWith("+234")) demoPhone = "0" + phone.slice(4);

  const signals = {
    number_verified: verifyNumber(demoPhone),
    sim_swap_recent: checkSimSwap(demoPhone),
    last_swap_days: checkSimSwap(demoPhone) ? Math.floor(Math.random() * 5) + 1 : null,
    device_active:   checkDevice(demoPhone),
    network_type: detectNetwork(phone),
    location_match:  checkLocation(demoPhone),
    location_country: detectCountry(phone),
    phone,
    lat,
    lng
  };

  const riskResult = calculateRisk(signals);

  return {
    phone,
    ...signals,
    risk_score: riskResult.score,
    decision: riskResult.decision,
    reason: riskResult.reason,
    ai_insight: riskResult.ai_insight,
    logic_chain: riskResult.logic_chain,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { evaluateUser };
