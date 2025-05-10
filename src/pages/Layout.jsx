import {
  Page,
  Navbar,
  Block,
  Button,
  List,
  ListItem,
  Link,
  Sheet,
  BlockTitle,
  Chip,
} from "konsta/react";
import React from "react";
import { FaHandHoldingUsd, FaBriefcase } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { IoIosHome } from "react-icons/io";
import { useConnect, useAccount } from "wagmi";
import { createPaymasterMiddleware } from '@nerochain/aa-sdk';
import { createConfig } from 'wagmi';
import { nerochain } from '../chains'; // Import NERO chain config
import { http } from 'viem';

const Layout = ({ children }) => {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { address } = useAccount();

  // NERO Paymaster middleware
  const paymasterMiddleware = createPaymasterMiddleware({
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL,
    chainId: nerochain.id,
  });

  const wagmiConfig = createConfig({
    chains: [nerochain],
    transports: {
      [nerochain.id]: http(),
    },
    middleware: [paymasterMiddleware],
  });

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: new InjectedConnector() });
    }
  }, []);

  return (
    <Page>
      <div className="normalHeight">
        <div className="flex items-center pr-2">
          {!hideConnectBtn && (
            <div className="w-full conn mt-1 p-1">
              <ConnectButton 
                showBalance={{
                  smallScreen: true,
                  largeScreen: false,
                }}
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
          )}
          {address && (
            <Chip
              media={
                <img
                  src="/nero-logo.png"
                  alt="NERO"
                  className="ios:h-7 material:h-6"
                />
              }
              text="NERO Account"
              className="ml-2"
            />
          )}
        </div>
        {children}
      </div>

      {/* Rest of your footer navigation remains the same */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        {/* ... existing footer code ... */}
      </div>
    </Page>
  );
};

export default Layout;