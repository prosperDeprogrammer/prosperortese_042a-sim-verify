import { VerificationResult, VerificationHistoryItem, ApiLog } from '../types/pro';
import { verifyUserIntelligence } from './api';

// Simulated persistence for the demo (Dashboard stats)
const verificationHistory: VerificationResult[] = [];
let totalApiCallsCount = 0;

export const runCamaraFraudEngine = async (phoneNumber: string, onApiProgress: (log: ApiLog) => void): Promise<VerificationResult> => {
  totalApiCallsCount++;
  
  try {
    // 1. Initial Handshake
    onApiProgress({ api: 'Handshake', timestamp: new Date().toISOString(), status: 'SUCCESS' });
    
    // 2. Call new unified backend endpoint
    const response = await verifyUserIntelligence(phoneNumber);
    const data = response.data;

    // Simulate step-by-step progress for UI standout effect
    const logs: ApiLog[] = [];
    const steps = [
      { label: 'SIM Swap Analysis', status: data.simSwap?.swapped ? 'WARNING' : 'SUCCESS' },
      {
        label: 'Ownership Verification',
        status:
          data.numberVerification?.devicePhoneNumberVerified === true ||
          data.numberVerification?.devicePhoneNumberStatus === 'VALID'
            ? 'SUCCESS'
            : 'ERROR'
      },
      {
        label: 'Location Correlation',
        status: data.locationVerify?.verificationResult === 'TRUE' ? 'SUCCESS' : 'WARNING'
      }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 50));
      const log: ApiLog = {
        api: step.label,
        timestamp: new Date().toISOString(),
        status: step.status as any
      };
      logs.push(log);
      onApiProgress(log);
    }

    // Map backend response to VerificationResult
    const result: VerificationResult = {
      phoneNumber: data.phoneNumber,
      status: data.status || (data.riskLevel === 'LOW' ? 'VERIFIED' : (data.riskLevel === 'HIGH' ? 'HIGH RISK' : 'SUSPICIOUS')),
      riskScore: data.riskLevel || 'LOW',
      simSwapStatus: data.simSwap?.swapped ? 'SWAPPED_RECENTLY' : 'CLEAN',
      locationMatch:
        data.locationVerify?.verificationResult === 'TRUE' ||
        data.location?.status === 'MATCHED' ||
        data.location?.verificationResult === 'TRUE'
          ? 'MATCHED'
          : 'MISMATCH',
      deviceStatus: data.deviceStatus || 'ACTIVE',
      networkProvider: data.networkProvider || 'Nokia NAC (RapidAPI)',
      aiInsight: data.insight || data.aiInsight || 'Network analysis complete. No specific anomalies detected.',
      timestamp: data.timestamp || new Date().toISOString(),
      apiLogs: logs,
      rawResponse: data.raw,
      details: {
        simSwapDate: data.simSwap?.latestSimChange || 'None',
        identityCount: 1
      }
    };

    verificationHistory.push(result);
    return result;

  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getCamaraStats = () => {
  return {
    totalApiCalls: totalApiCallsCount,
    fraudCasesDetected: verificationHistory.filter(r => r.status !== 'VERIFIED').length,
    simSwapAlerts: verificationHistory.filter(r => r.simSwapStatus === 'SWAPPED_RECENTLY').length,
    locationMismatchAlerts: verificationHistory.filter(r => r.locationMatch === 'MISMATCH').length,
  };
};

export const getCamaraHistory = (): VerificationHistoryItem[] => {
  return verificationHistory.map(r => ({
    phoneNumber: r.phoneNumber,
    status: r.status,
    riskScore: r.riskScore,
    date: new Date(r.timestamp).toLocaleTimeString() + ' ' + new Date(r.timestamp).toLocaleDateString(),
    alerts: {
      simSwap: r.simSwapStatus === 'SWAPPED_RECENTLY',
      locationMismatch: r.locationMatch === 'MISMATCH',
      numberMismatch: r.rawResponse?.numberVerification?.devicePhoneNumberVerified === false
    },
    rawResponse: r.rawResponse
  })).reverse();
};
