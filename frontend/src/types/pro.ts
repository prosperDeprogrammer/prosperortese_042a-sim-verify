export type Step = 'landing' | 'input' | 'loading' | 'result' | 'dashboard' | 'docs' | 'privacy' | 'terms' | 'auth';

export interface ApiLog {
  api: string;
  timestamp: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  response?: any;
}

export interface VerificationResult {
  phoneNumber: string;
  status: 'VERIFIED' | 'FLAGGED' | 'SUSPICIOUS' | 'HIGH RISK';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  simSwapStatus: 'CLEAN' | 'SWAPPED_RECENTLY';
  locationMatch: 'MATCHED' | 'MISMATCH';
  deviceStatus: 'ACTIVE' | 'INACTIVE';
  networkProvider: string;
  aiInsight: string;
  timestamp: string;
  apiLogs: ApiLog[];
  rawResponse?: any;
  details: {
    simSwapDate?: string;
    identityCount: number;
  };
}

export interface DashboardStats {
  totalApiCalls: number;
  fraudCasesDetected: number;
  simSwapAlerts: number;
  locationMismatchAlerts: number;
}

export interface VerificationHistoryItem {
  phoneNumber: string;
  status: string;
  riskScore: string;
  date: string;
  alerts: {
    simSwap: boolean;
    locationMismatch: boolean;
    numberMismatch: boolean;
  };
  rawResponse?: any;
}
