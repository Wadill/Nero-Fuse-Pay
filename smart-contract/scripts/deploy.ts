import * as dotenv from "dotenv";
import * as hre from "hardhat";
import { EntryPoint__factory } from "@nerochain/aa-contracts";
dotenv.config();

async function main() {
  console.log("Deploying Nero-Fuse-Pay Contracts...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy EntryPoint (or use existing NERO EntryPoint)
  console.log("\nDeploying/Connecting EntryPoint...");
  const ENTRY_POINT_ADDRESS = process.env.ENTRY_POINT_ADDRESS || "";
  
  let entryPoint;
  if (ENTRY_POINT_ADDRESS) {
    entryPoint = EntryPoint__factory.connect(ENTRY_POINT_ADDRESS, deployer);
    console.log("Using existing EntryPoint at:", ENTRY_POINT_ADDRESS);
  } else {
    const EntryPoint = await hre.ethers.getContractFactory("EntryPoint");
    entryPoint = await EntryPoint.deploy();
    await entryPoint.waitForDeployment();
    console.log("EntryPoint deployed to:", await entryPoint.getAddress());
  }

  // 2. Deploy Paymaster Contract
  console.log("\nDeploying NeroPaymaster...");
  const NeroPaymaster = await hre.ethers.getContractFactory("NeroPaymaster");
  const paymaster = await NeroPaymaster.deploy(await entryPoint.getAddress());
  await paymaster.waitForDeployment();
  console.log("NeroPaymaster deployed to:", await paymaster.getAddress());

  // 3. Deploy Main Payroll Contract
  console.log("\nDeploying NeroPayroll...");
  const NeroPayroll = await hre.ethers.getContractFactory("NeroPayroll");
  const payroll = await NeroPayroll.deploy(
    await entryPoint.getAddress(),
    await paymaster.getAddress()
  );
  await payroll.waitForDeployment();
  console.log("NeroPayroll deployed to:", await payroll.getAddress());

  // 4. Initialize Paymaster
  console.log("\nConfiguring Paymaster...");
  await paymaster.initialize(payroll.getAddress());
  console.log("Paymaster initialized with Payroll contract");

  // 5. Verification preparation
  console.log("\nVerification commands:");
  if (!ENTRY_POINT_ADDRESS) {
    console.log(
      `npx hardhat verify --network nero ${await entryPoint.getAddress()}`
    );
  }
  console.log(
    `npx hardhat verify --network nero ${await paymaster.getAddress()} ${await entryPoint.getAddress()}`
  );
  console.log(
    `npx hardhat verify --network nero ${await payroll.getAddress()} ${await entryPoint.getAddress()} ${await paymaster.getAddress()}`
  );

  console.log("\nDeployment Summary:");
  console.log("EntryPoint:", await entryPoint.getAddress());
  console.log("NeroPaymaster:", await paymaster.getAddress());
  console.log("NeroPayroll:", await payroll.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});