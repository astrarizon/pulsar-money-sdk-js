interface IBASE_URLS {
  mainnet: string;
  devnet: string;
  testnet: string;
}

export const BASE_URLS: IBASE_URLS = {
  mainnet: "https://pulsar-money-prod.herokuapp.com",
  devnet: "https://pulsar-money-devnet.herokuapp.com",
  testnet: "https://pulsar-money-testnet.herokuapp.com",
};

export const MultiversxApiUrls = {
  mainnet: "https://api.multiversx.com",
  devnet: "https://devnet-api.multiversx.com",
  testnet: "https://testnet-api.elrond.com",
};

export type FEATURE_TYPE = "create_payment" | "claim_payment" | "cancel_payment" | "delegate";

export const getContractAddress = (chain: "testnet" | "devnet" | "mainnet") => {
  switch (chain) {
    case "testnet":
      throw new Error("Not implemented");
    case "devnet":
      return "erd1qqqqqqqqqqqqqpgqsanann348xhns6qx94rgcq8davw005vnlzhsezyt7t";
    case "mainnet":
      return "erd1qqqqqqqqqqqqqpgqd6l8ayd0zxfekl53geyxgjzjxu3ceyca60wsje6asx";
    default:
      throw new Error(`Invalid chain. ${chain}`);
  }
};

export const getFeatureUrl = (chain: "testnet" | "devnet" | "mainnet", feature: FEATURE_TYPE) => {
  const url = BASE_URLS[chain];

  switch (feature) {
    case "create_payment":
      return `${url}${CREATE_PULSAR_PAYMENT_ENDPOINT}`;
    case "claim_payment":
      return `${url}${CLAIM_PULSAR_PAYMENT_ENDPOINT}`;
    case "cancel_payment":
      return `${url}${CANCEL_PULSAR_PAYMENT_ENDPOINT}`;
    case "delegate":
      return `${url}${DELEGATE_ENDPOINT}`;
    default:
      throw new Error(`Invalid feature type. ${feature}`);
  }
};

export const CREATE_PULSAR_PAYMENT_ENDPOINT = `/transaction/payment/create`;
export const CLAIM_PULSAR_PAYMENT_ENDPOINT = `/transaction/payment/claim`;
export const CANCEL_PULSAR_PAYMENT_ENDPOINT = `/transaction/payment/cancel`;
export const GET_FEE_ENDPOINT = `/transaction/payment/get-fee`;
export const DELEGATE_ENDPOINT = `/transaction/stake`;

export const DEFAULT_FREQUENCY_SECONDS = 1;

export const ONE_SECOND_IN_MILISECONDS = 1000;
export const GAS_LIMIT = 12000000;
