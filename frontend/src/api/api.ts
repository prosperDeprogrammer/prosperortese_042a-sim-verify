import axios from 'axios';
import { API_URL } from '../constants';
import { VerifyResult, ApiKeyResponse, Stats } from '../types';

const api = axios.create({
  baseURL: API_URL,
});

export const getStats = () => api.get<any>(`/stats`);

export const verifyUser = (phone: string, apiKey: string, lat?: number, lng?: number) => 
  api.post<VerifyResult>(`/verify-user`, { phone, lat, lng }, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

export const generateApiKey = (data: { owner: string; company: string; email: string; plan: string; force?: boolean }) =>
  api.post<ApiKeyResponse>(`/api-keys`, data);

export default api;
