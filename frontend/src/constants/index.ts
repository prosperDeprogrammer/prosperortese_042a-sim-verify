import { Decision, RiskScore } from "../types";

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

export const demoNumbers = [
  "+36721234567",
  "+36701234567",
  "+36371234567",
  "+99999991000",
];

export function riskBadge(score: RiskScore) {
  if (score === "LOW") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
  if (score === "SUSPICIOUS") return "bg-amber-500/15 text-amber-300 border-amber-500/40";
  return "bg-rose-500/15 text-rose-300 border-rose-500/40";
}
