import { ReleaseAttributes, ReleaseResult } from "../release/types";

export declare type PaymentResult = {
  version: number;
  mode: PaymentMode;
  type: PaymentType;
  identifier: number;
  tokenIdentifier: string;
  tokenNonce: number;
  cancelTokenIdentifier: string | undefined;
  cancelTokenNonce: number | undefined;
  balance: string;
  amount: number;
  name: string;
  startDate: string;
  endDate: string;
  cancelDate: string | undefined;
  releaseToken: string;
  releaseTokenPrice: number | undefined;
  releaseTokenAmount: number;
  valueUsd: number;
  creator: string;
  receivers: string[];
  totalAmount: number;
  claimableAmount: number;
  remainingAmount: number;
  claimedAmount: number;
  cancelledAmount: number;
  progress: number;
  cancelable: boolean;
  releases: ReleaseResult[];
  txHash: string | undefined;
};

export declare type PaymentReleaseInput = {
  startDate: string; // isoString
  endDate: string; // isoString
  duration: number;
  amount: string;
};

export const enum PaymentTypeAttributes {
  Vault = "vault",
  Payment = "payment",
  Vesting = "vesting",
}

export declare type PaymentRelease = {
  startDate: Date;
  endDate: Date;
  duration: number;
  amount: string;
};

export declare type PaymentTotals = {
  totalIncoming: number;
  totalOutgoing: number;
  totalIncomingVaults: number;
  totalIncomingPayments: number;
  totalIncomingVesting: number;
};

export declare type PaymentMode = {
  incoming: "incoming";
  outgoing: "outgoing";
};

export declare type PaymentAttributes = {
  version: number;
  type: number;
  identifier: number;
  name: string;
  startDate: number;
  endDate: number;
  releaseToken: string;
  releaseNonce: number;
  creator: string;
  amount: string;
  cancelable: boolean;
  releases: ReleaseAttributes[];
};

export declare type PaymentType = {
  Vault: "vault";
  Payment: "payment";
  Vesting: "vesting";
};

export declare type RawPaymentInput = {
  receivers: string[];
  totalAmount: string;
  cliffDateInMiliseconds: number;
  cliffAmount: string;
  endDateInMiliseconds: number;
  frequency: number;
  cancellable: boolean;
  name: string;
};

export declare type PaymentInput = {
  receivers: string[];
  cancellable: boolean;
  name: string;
  type: PaymentTypeAttributes;
  releases: PaymentReleaseInput[];
};
