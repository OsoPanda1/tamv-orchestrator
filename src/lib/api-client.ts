// TAMV Unified API Client
import { supabase } from '@/integrations/supabase/client';

const API_BASE = import.meta.env.VITE_SUPABASE_URL;

// Generic API caller
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}/functions/v1/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Isabella AI API
export const isabellaAPI = {
  chat: async (message: string, context?: Record<string, unknown>) => {
    return apiCall<{ response: string; emotion: string; intent: string }>('isabella-chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  },
  
  filter: async (text: string) => {
    return apiCall<{ emotion: string; valence: number; arousal: number }>('isabella-filter', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
  
  synthesize: async (inputs: string[]) => {
    return apiCall<{ synthesis: string; sources: string[] }>('isabella-synthesize', {
      method: 'POST',
      body: JSON.stringify({ inputs }),
    });
  },
};

// Federation API
export const federationAPI = {
  getNodeStatus: async (nodeId: string) => {
    return apiCall<{ status: string; latency: number; load: number }>(`federation/status/${nodeId}`);
  },
  
  syncNodes: async () => {
    return apiCall<{ synced: number; failed: number }>('federation/sync', { method: 'POST' });
  },
  
  getConsensus: async () => {
    return apiCall<{ height: number; hash: string; validators: number }>('federation/consensus');
  },
};

// Economy API
export const economyAPI = {
  getBalance: async (userId: string) => {
    return apiCall<{ utamv: number; msr: number; locked: number }>(`economy/balance/${userId}`);
  },
  
  transfer: async (to: string, amount: number, token: 'utamv' | 'msr') => {
    return apiCall<{ txHash: string; status: string }>('economy/transfer', {
      method: 'POST',
      body: JSON.stringify({ to, amount, token }),
    });
  },
  
  getLotteryStatus: async () => {
    return apiCall<{ jackpot: number; participants: number; drawTime: string }>('economy/lottery');
  },
};

// Quantum API
export const quantumAPI = {
  generateKeyPair: async (algorithm: 'kyber' | 'dilithium') => {
    return apiCall<{ publicKey: string; keyId: string }>('quantum/keygen', {
      method: 'POST',
      body: JSON.stringify({ algorithm }),
    });
  },
  
  encrypt: async (data: string, publicKey: string) => {
    return apiCall<{ ciphertext: string; nonce: string }>('quantum/encrypt', {
      method: 'POST',
      body: JSON.stringify({ data, publicKey }),
    });
  },
  
  verify: async (signature: string, message: string, publicKey: string) => {
    return apiCall<{ valid: boolean }>('quantum/verify', {
      method: 'POST',
      body: JSON.stringify({ signature, message, publicKey }),
    });
  },
};

// XR/3D Rendering API
export const renderAPI = {
  initScene: async (sceneId: string, mode: '3d' | 'vr' | 'xr' | '4d') => {
    return apiCall<{ sessionId: string; wsUrl: string }>('render/init', {
      method: 'POST',
      body: JSON.stringify({ sceneId, mode }),
    });
  },
  
  getAssets: async (sceneId: string) => {
    return apiCall<{ assets: Array<{ id: string; type: string; url: string }> }>(`render/assets/${sceneId}`);
  },
};

// BookPI Documentation API  
export const bookpiAPI = {
  write: async (entry: { emotion: string; intent: string; input: string; output: string }) => {
    return apiCall<{ id: string; hash: string; timestamp: string }>('bookpi/write', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },
  
  query: async (filter: { emotion?: string; dateFrom?: string; dateTo?: string }) => {
    return apiCall<{ entries: Array<{ id: string; timestamp: string; emotion: string }> }>('bookpi/query', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  },
  
  getStats: async () => {
    return apiCall<{ totalEntries: number; topEmotions: string[]; avgPerDay: number }>('bookpi/stats');
  },
};
