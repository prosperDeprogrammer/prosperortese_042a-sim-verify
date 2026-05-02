export type RiskScore = "LOW" | "SUSPICIOUS" | "HIGH";
export type Decision = "ALLOW" | "STEP_UP" | "BLOCK";
export type Page = "landing" | "verify" | "dashboard";

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
  provider?: string;
  provider_live?: boolean;
  provider_partial?: boolean;
  provider_cached?: boolean;
  signal_coverage?: {
    sim_swap: boolean;
    number_verification: boolean;
    device_status: boolean;
    location_verification: boolean;
  };
  provider_latency_ms?: number;
  provider_errors?: string[];
  provider_meta?: {
    retrieved_location?: { lat: number; lng: number } | null;
    client_location?: { lat: number; lng: number } | null;
    location_distance_km?: number | null;
    location_threshold_km?: number;
  };
  fallback_reason?: string;
  reasons?: string[];
  riskScore?: number;
  timestamp: string;
}

export type ProStatus = "VERIFIED" | "FLAGGED";
export type ProRiskLevel = "LOW" | "HIGH" | "SUSPICIOUS";

export interface ProVerifyResult {
  app: string;
  phone: string;
  status: ProStatus;
  simOwnerMatch: "YES" | "NO";
  riskScore: number;
  riskLevel: ProRiskLevel;
  networkProvider: string;
  reasons: string[];
  usageCount: number;
  camara: {
    verifyPhoneNumber: { verified: boolean; phoneNumber: string; confidence: number };
    checkSimOwnership: { ownerMatch: boolean; method: string; checkedAt: string };
    getDeviceLocation: { city: string; country: string; lat: number; lng: number; maxAgeSeconds: number };
  };
  provider: string;
  provider_live: boolean;
  provider_partial?: boolean;
  provider_cached?: boolean;
  provider_latency_ms?: number;
  provider_errors?: string[];
  provider_meta?: VerifyResult["provider_meta"];
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
