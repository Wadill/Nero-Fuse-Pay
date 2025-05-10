import { defineChain } from 'viem';

export const nerochain = defineChain({
  id: 1689,
  name: 'NERO Chain',
  network: 'nerochain',
  nativeCurrency: {
    decimals: 18,
    name: 'NERO',
    symbol: 'NERO',
  },
  rpcUrls: {
    public: { http: ['https://rpc.nerochain.io'] },
    default: { http: ['https://rpc.nerochain.io'] },
  },
  blockExplorers: {
    default: { name: 'NEROScan', url: 'https://scan.nerochain.io' },
  },
});