import {
  Page,
  Navbar,
  Block,
  Button,
  List,
  ListItem,
  Link,
  Sheet,
  Preloader,
  Notification,
  BlockTitle,
  Toast,
  Chip,
} from "konsta/react";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { 
  useAccount, 
  useBalance,
  useWriteContract
} from "wagmi";
import { 
  createUserOperation,
  getPaymasterAndData 
} from '@nerochain/aa-sdk';
import { NERO_PAYROLL_ABI, NERO_PAYROLL_ADDRESS } from "../utils/contracts";

export default function Home() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { writeContractAsync } = useWriteContract();
  
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    logo: null
  });
  const [txnStatus, setTxnStatus] = useState({
    loading: false,
    success: false,
    error: false
  });

  const createCompany = async () => {
    try {
      setTxnStatus({...txnStatus, loading: true});
      
      // 1. Get Paymaster data
      const paymasterData = await getPaymasterAndData({
        sender: address,
        chainId: nerochain.id
      });

      // 2. Create UserOperation
      const userOp = await createUserOperation({
        sender: address,
        paymasterAndData: paymasterData,
        callData: encodeFunctionData({
          abi: NERO_PAYROLL_ABI,
          functionName: 'createCompany',
          args: [companyData.name, companyData.description]
        }),
      });

      // 3. Send transaction through Paymaster
      const hash = await writeContractAsync({
        address: NERO_PAYROLL_ADDRESS,
        abi: NERO_PAYROLL_ABI,
        functionName: 'createCompany',
        args: [companyData.name, companyData.description],
        paymasterParams: {
          paymasterAndData,
        }
      });

      setTxnStatus({...txnStatus, loading: false, success: true});
      
    } catch (error) {
      console.error("Company creation failed:", error);
      setTxnStatus({...txnStatus, loading: false, error: true});
    }
  };

  return (
    <Layout>
      <Navbar title="Nero-Fuse-Pay" />
      <div className="h-full">
        {/* Notification for successful creation */}
        <Notification
          opened={txnStatus.success}
          title="Company Created"
          subtitle="Successfully created with NERO Paymaster"
          button={
            <Button 
              rounded 
              clear 
              onClick={() => setTxnStatus({...txnStatus, success: false})}
            >
              Close
            </Button>
          }
        />

        {/* Main hero section */}
        <section className="dark:bg-gradient-to-b from-blue-700/[4.79] via-gray-800 h-full">
          <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-12">
            <Chip
              media={
                <img
                  alt="nero"
                  className="ios:h-7 material:h-6 rounded-full"
                  src="/nero-logo.png"
                />
              }
              text="Powered by NERO AA"
              className="mb-7 bg-gray-800 text-white"
            />
            
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Gasless Payroll Management
            </h1>
            
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              Leveraging NERO's Account Abstraction for seamless, gasless payroll operations with built-in staking and loan features.
            </p>

            <div className="flex mb-8 align-center justify-center space-x-4 lg:mb-16 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => setSheetOpened(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Company Space
              </Button>
              
              <Button
                href="/company"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
            {/* ... rest of your features section ... */}
          </div>
        </div>

        {/* Company creation sheet */}
        <Sheet
          opened={sheetOpened}
          onBackdropClick={() => setSheetOpened(false)}
        >
          <div className="relative p-4 w-full max-w-md max-h-full mb-15">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Sheet header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  New Company Workspace
                </h3>
                <button onClick={() => setSheetOpened(false)}>
                  {/* Close button */}
                </button>
              </div>
              
              {/* Form content */}
              <div className="p-4 md:p-5">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Company Name
                  </label>
                  <input
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setCompanyData({...companyData, logo: e.target.files[0]})}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                </div>

                {txnStatus.loading ? (
                  <Preloader className="mx-auto" />
                ) : (
                  <Button 
                    onClick={createCompany}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create with Paymaster
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Sheet>
      </div>
    </Layout>
  );
}