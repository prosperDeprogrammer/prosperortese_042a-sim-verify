import { Decision, RiskScore, View } from "../types";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const decisionText: Record<Decision, string> = {
  ALLOW: "Approve transaction",
  STEP_UP: "Ask for step-up verification",
  BLOCK: "Block and alert fraud team",
};

export const riskStyles = {
  LOW: {
    container: "border-emerald-500/50 bg-emerald-500/10",
    label: "text-emerald-300",
    val: "text-emerald-100",
    desc: "text-emerald-100/80",
    badgeBorder: "border-emerald-300/50",
    badgeText: "text-emerald-200",
    btn: "text-emerald-300/80 hover:text-emerald-300"
  },
  SUSPICIOUS: {
    container: "border-amber-500/50 bg-amber-500/10",
    label: "text-amber-300",
    val: "text-amber-100",
    desc: "text-amber-100/80",
    badgeBorder: "border-amber-300/50",
    badgeText: "text-amber-200",
    btn: "text-amber-300/80 hover:text-amber-300"
  },
  HIGH: {
    container: "border-rose-500/50 bg-rose-500/10",
    label: "text-rose-300",
    val: "text-rose-100",
    desc: "text-rose-100/80",
    badgeBorder: "border-rose-300/50",
    badgeText: "text-rose-200",
    btn: "text-rose-300/80 hover:text-rose-300"
  }
};

export const navItems: Array<{ id: View; label: string }> = [
  { id: "verify", label: "Fraud Checker" },
  { id: "history", label: "Check History" },
  { id: "docs", label: "API Docs" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "apikey", label: "Get API Key" },
];

export const demoCases = [
  { phone: "09035315300", hint: "Validated Identity (Low Risk)", tone: "LOW" as RiskScore },
  { phone: "08022222222", hint: "Active Account Takeover Attempt", tone: "HIGH" as RiskScore },
  { phone: "08033333333", hint: "Unreachable / Stale Session", tone: "SUSPICIOUS" as RiskScore },
  { phone: "08000000000", hint: "Phone Number Not Found", tone: "HIGH" as RiskScore },
];

export function riskBadge(score: RiskScore) {
  if (score === "LOW") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
  if (score === "SUSPICIOUS") return "bg-amber-500/15 text-amber-300 border-amber-500/40";
  return "bg-rose-500/15 text-rose-300 border-rose-500/40";
}
