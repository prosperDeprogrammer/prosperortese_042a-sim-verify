import axios from 'axios';
import { API_URL } from '../constants';
import { VerifyResult, ApiKeyResponse, Stats, ProVerifyResult } from '../types';

const api = axios.create({
  baseURL: API_URL,
});

export const getStats = () => api.get<any>(`/stats`);

export const verifyUser = (
  phone: string,
  apiKey: string,
  lat?: number,
  lng?: number,
  amount: number = 125000,
  country?: string
) =>
  api.post<VerifyResult>(`/risk-check`, { phone, lat, lng, amount, country }, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

export const proVerify = (phone: string, country?: string, lat?: number, lng?: number) =>
  api.post<ProVerifyResult>(`/pro/verify`, { phone, country, lat, lng });

export const verifyUserIntelligence = (phoneNumber: string) =>
  api.post<any>(`/verify-user`, { phoneNumber });

export const generateApiKey = (data: { owner: string; company: string; email: string; plan: string; force?: boolean }) =>
  api.post<ApiKeyResponse>(`/api-keys`, data);

export default api;
