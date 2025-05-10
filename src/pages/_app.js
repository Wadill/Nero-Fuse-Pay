import { App } from "konsta/react";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";

// NERO-specific imports
import { NEROProvider, createPaymasterMiddleware } from '@nerochain/aa-sdk';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { nerochain } from '@/utils/chains'; // Your NERO chain config

// Configure only NERO chain
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [nerochain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Nero-Fuse-Pay",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, // Use env variable
  chains,
});

// NERO Paymaster middleware
const paymasterMiddleware = createPaymasterMiddleware({
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL,
  chainId: nerochain.id,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  middleware: [paymasterMiddleware], // Apply to all operations
});

function MyApp({ Component, pageProps }) {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isAndroid = userAgent.match(/Android/i);
    const isIOS = userAgent.match(/iPhone|iPad|iPod/i);
    
    setDeviceType(isIOS ? "ios" : isAndroid ? "android" : "laptop");
  }, []);

  const theme = deviceType === "ios" ? "ios" : "material";

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <NEROProvider
          paymasterConfig={{
            chainId: nerochain.id,
            policy: 'payroll',
            sponsorshipType: 'full' // Full gas sponsorship
          }}
        >
          <App dark={true} safeAreas={true} theme={theme}>
            <Component {...pageProps} />
          </App>
        </NEROProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;