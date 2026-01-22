// TAMV Quantum Configuration - Pre/Post Quantum Cryptography Ready
export const QUANTUM_CONFIG = {
  // Quantum-resistant algorithms
  cryptography: {
    preQuantum: {
      algorithm: 'AES-256-GCM',
      keyExchange: 'ECDH-P384',
      signature: 'Ed25519',
    },
    postQuantum: {
      algorithm: 'CRYSTALS-Kyber',
      signature: 'CRYSTALS-Dilithium',
      hash: 'SHA3-512',
    },
    hybrid: {
      enabled: true,
      fallback: 'preQuantum',
    },
  },
  
  // Federated nodes configuration
  federation: {
    nodes: 7,
    consensus: 'PBFT',
    replicationFactor: 3,
    syncInterval: 5000, // ms
  },
  
  // XR/VR/3D rendering
  rendering: {
    engine: 'HyperRender-4D',
    modes: ['2D', '3D', 'VR', 'AR', 'XR', '4D'],
    quantumAcceleration: true,
    maxFPS: 144,
    resolution: {
      standard: [1920, 1080],
      vr: [2160, 2160],
      '4d': [4096, 4096],
    },
  },
  
  // API Gateway configuration
  gateway: {
    version: 'v2',
    rateLimit: 10000,
    timeout: 30000,
    retry: 3,
  },
};

export const FEDERATED_SERVICES = [
  {
    id: 'identity-node',
    name: 'Identity Federation',
    layer: 'identity',
    port: 8001,
    protocol: 'grpc',
    quantum: true,
  },
  {
    id: 'comm-node',
    name: 'Communication Hub',
    layer: 'communication',
    port: 8002,
    protocol: 'websocket',
    quantum: false,
  },
  {
    id: 'info-node',
    name: 'Information Mesh',
    layer: 'information',
    port: 8003,
    protocol: 'http2',
    quantum: true,
  },
  {
    id: 'ai-node',
    name: 'Intelligence Core',
    layer: 'intelligence',
    port: 8004,
    protocol: 'grpc',
    quantum: true,
  },
  {
    id: 'economy-node',
    name: 'Economy Ledger',
    layer: 'economy',
    port: 8005,
    protocol: 'http2',
    quantum: true,
  },
  {
    id: 'gov-node',
    name: 'Governance Protocol',
    layer: 'governance',
    port: 8006,
    protocol: 'grpc',
    quantum: false,
  },
  {
    id: 'docs-node',
    name: 'Documentation Vault',
    layer: 'documentation',
    port: 8007,
    protocol: 'http2',
    quantum: false,
  },
] as const;

export type ServiceId = typeof FEDERATED_SERVICES[number]['id'];
