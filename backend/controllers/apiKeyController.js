const apiKeyService = require("../services/apiKeyService");
const { ALLOWED_PLANS, PLAN_RANK, EMAIL_REGEX } = require("../config/constants");

exports.provisionKey = (req, res) => {
  const { owner, company, email, plan, force } = req.body;
  const normalizedPlan = typeof plan === "string" ? plan.toUpperCase() : "";

  if (!owner || !company || !email || !ALLOWED_PLANS.includes(normalizedPlan)) {
    return res.status(400).json({
      error: "owner, company, email, and a valid plan are required",
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email address format." });
  }

  const existingUser = apiKeyService.findKeyByEmail(email);

  if (existingUser) {
    const isExpired = new Date() > new Date(existingUser.expiry_date);
    const existingRank = PLAN_RANK[existingUser.plan] ?? 0;
    const requestedRank = PLAN_RANK[normalizedPlan] ?? 0;
    
    const isDowngrade = requestedRank < existingRank;
    const isUpgrade = requestedRank > existingRank;
    const isSamePlan = requestedRank === existingRank;

    // Block downgrades unless user explicitly confirms with force:true
    if (!isExpired && isDowngrade && !force) {
      return res.status(403).json({
        error: `Your active ${existingUser.plan} plan is still valid. You cannot downgrade to ${normalizedPlan} while it is active.`,
        currentPlan: existingUser.plan,
        expiry_date: existingUser.expiry_date,
        canForce: true,
      });
    }

    if (isExpired || isUpgrade || (isDowngrade && force)) {
      const updatedUser = apiKeyService.updateKey(existingUser, normalizedPlan);
      return res.status(201).json(updatedUser);
    }

    if (isSamePlan && !isExpired) {
      return res.status(200).json(existingUser);
    }
  }

  const newKey = apiKeyService.createKey(owner, company, email, normalizedPlan);
  return res.status(201).json(newKey);
};
