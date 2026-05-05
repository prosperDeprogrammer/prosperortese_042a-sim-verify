const { getNetworkSignals } = require('../services/nokiaService');
const { evaluateRisk } = require('../services/fraudEngine');

/**
 * Main Verification Controller
 * POST /verify-user
 */
async function verifyUser(req, res) {
  try {
    const { phoneNumber, location } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "phoneNumber is required" });
    }

    // 1. Normalize Phone Number (E.164)
    let cleanPhone = String(phoneNumber).replace(/[^\d+]/g, "");
    if (!cleanPhone.startsWith("+")) {
      // Assuming Nigeria if no country code provided for demo simplicity
      if (cleanPhone.startsWith("0")) cleanPhone = "+234" + cleanPhone.slice(1);
      else cleanPhone = "+" + cleanPhone;
    }

    console.log(`[VERIFY-USER] Starting analysis for ${cleanPhone}`);

    // 2. Call Nokia: Number Verification + SIM Swap + Location Verification (Theme 5)
    const signals = await getNetworkSignals(cleanPhone, location);

    const assessment = evaluateRisk(signals);

    const response = {
      phoneNumber: cleanPhone,
      numberVerification: signals.numberVerification,
      simSwap: signals.simSwap,
      locationVerify: signals.locationVerify,
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      status: assessment.status, // Add status explicitly
      decision: assessment.status, // Use status as the decision label
      insight: assessment.aiInsight, // Use aiInsight as the insight text
      timestamp: signals.timestamp || new Date().toISOString(),
      raw: signals
    };

    console.log(`[VERIFY-USER] Completed. Risk: ${assessment.riskLevel} (${assessment.riskScore})`);
    return res.status(200).json(response);

  } catch (err) {
    console.error('[VERIFY-USER ERROR]', err);
    const msg = err && err.message ? err.message : 'Unknown error';
    if (msg.includes('NAC_') && msg.includes('https://')) {
      return res.status(503).json({
        error: 'Configuration',
        message: msg
      });
    }
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during fraud analysis.'
    });
  }
}

module.exports = { verifyUser };
