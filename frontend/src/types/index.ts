export type RiskScore = "LOW" | "SUSPICIOUS" | "HIGH";
export type Decision = "ALLOW" | "STEP_UP" | "BLOCK";
export type View = "verify" | "history" | "docs" | "features" | "pricing" | "apikey";

export interface VerifyResult {
  phone: string;
  number_verified: boolean;
  sim_swap_recent: boolean;
  last_swap_days: number | null;
  device_active: boolean;
  network_type: string | null;
  location_match: boolean;
  location_country: string;
  risk_score: RiskScore;
  decision: Decision;
  reason?: string;
  ai_insight?: string;
  logic_chain?: string[];
  timestamp: string;
}

export interface ApiKeyResponse {
  key: string;
  plan: "STARTER" | "GROWTH" | "ENTERPRISE";
  owner: string;
  email: string;
  created_at: string;
  purchased_date: string;
  expiry_date: string;
}

export interface Stats {
  total: number;
  safe: number;
  suspicious: number;
  high: number;
}

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}
