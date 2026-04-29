const { evaluateUser } = require("../riskEngine");
const { NIGERIAN_PHONE_REGEX } = require("../config/constants");

exports.verifyUser = (req, res) => {
  const { phone, lat, lng } = req.body;

  // Auth check (simple check for sk_live_ prefix as per current logic)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer sk_live_")) {
    return res.status(401).json({ error: "Unauthorized. Missing or invalid Bearer API key." });
  }

  if (!phone) {
    return res.status(400).json({ error: "phone number is required" });
  }

  // Normalize: Strip spaces, dashes, parentheses
  let normalizedPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Strict check: Must only contain digits (and optional leading +)
  if (!normalizedPhone.match(/^\+?\d+$/)) {
    return res.status(400).json({ error: "Invalid characters detected. Phone numbers must only contain digits and a possible leading '+'." });
  }

  // Professional Global Validation (E.164 or local 10-11 digit)
  const isGlobalFormat = normalizedPhone.startsWith("+");
  const isLocalNigerian = normalizedPhone.match(/^0[7-9][0-1]\d{8}$/);
  
  if (!isGlobalFormat && !isLocalNigerian) {
    if (normalizedPhone.length === 10 && !normalizedPhone.startsWith("0")) {
       normalizedPhone = "0" + normalizedPhone;
    } else if (normalizedPhone.length < 8) {
       return res.status(400).json({ error: "Phone number is too short." });
    } else if (normalizedPhone.length > 15) {
       return res.status(400).json({ error: "Phone number is too long." });
    }
  }

  console.log(`[${new Date().toLocaleTimeString()}] 🔍 Verifying (Global Route): ${normalizedPhone}`);

  const result = evaluateUser(normalizedPhone, lat, lng);

  // Artificial delay to simulate network latency
  setTimeout(() => {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Result: ${result.risk_score} (${result.decision})`);
    res.json(result);
  }, 1200);
};
