import { Account, Address, GasEstimator, TransferTransactionsFactory } from "@multiversx/sdk-core/out";
import { PaymentTypeAttributes } from "./payments/types";
import { INetworkProvider } from "@multiversx/sdk-network-providers/out/interface";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { MultiversxApiUrls } from "./config";

const NetworkProviders = {
  mainnet: new ApiNetworkProvider(MultiversxApiUrls.mainnet),
  devnet: new ApiNetworkProvider(MultiversxApiUrls.devnet),
  testnet: new ApiNetworkProvider(MultiversxApiUrls.testnet),
};

export const convertTypeToString = (type: PaymentTypeAttributes) => {
  switch (type) {
    case PaymentTypeAttributes.Vault:
      return "vault";
    case PaymentTypeAttributes.Payment:
      return "payment";
    case PaymentTypeAttributes.Vesting:
      return "vesting";
    default:
      throw new Error("Invalid type.");
  }
};

export const createDateFromTimestampMiliseconds = (timestamp: number) => {
  if (timestamp.toString().length <= 10) {
    timestamp *= 1000;
  }

  return createUTCDateFromTimestampMiliseconds(timestamp);
};

export const createUTCDateFromTimestampMiliseconds = (timestamp: number) => {
  if (timestamp.toString().length <= 10) {
    throw new Error("Invalid timestamp. Timestamp should be in miliseconds.");
  }

  const date = new Date(timestamp);

  return date.toISOString();
};

export const adjustEndDateAccordingToDuration = (startDate: number, endDate: number, releaseDuration: number) => {
  const noOfIntervals = Math.ceil((endDate - startDate) / releaseDuration);

  return startDate + releaseDuration * noOfIntervals;
};

export const numberToBigUintHex = (nmb: number) => {
  const nmbHex = numberToHex(nmb);
  const length = (nmbHex.length / 2).toString();

  return `${length.padStart(8, "0")}${nmbHex}`;
};

export const numberToHex = (nmb: number) => {
  let numHex = nmb.toString(16);
  if (numHex.length % 2) {
    numHex = "0" + numHex;
  }

  return numHex;
};

export const hexToNumber = (hex: string) => {
  return parseInt(hex, 16);
};

export const stringToHex = (str: string) => {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += "" + str.charCodeAt(i).toString(16);
  }

  return hex;
};

export const getAccount = async (addressStr: string, networkProvider: INetworkProvider): Promise<Account> => {
  const address = new Address(addressStr);
  const account = new Account(address);
  const accountOnNetwork = await networkProvider.getAccount(address);
  account.update(accountOnNetwork);

  return account;
};

export const getNetworkProvider = (chain: "testnet" | "devnet" | "mainnet") => {
  const networkProvider = NetworkProviders[chain];

  if (!networkProvider) {
    throw new Error(`Invalid chain. ${chain}`);
  }

  return networkProvider;
};

export const TransactionFactory = new TransferTransactionsFactory(new GasEstimator());
export const ONE_SECOND_IN_MILISECONDS = 1000;
