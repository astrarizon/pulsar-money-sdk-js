import axios from "axios";
import { BASE_URLS, DEFAULT_FREQUENCY_SECONDS, getFeatureUrl, GET_FEE_ENDPOINT, ONE_SECOND_IN_MILISECONDS } from "../config";
import { adjustEndDateAccordingToDuration, bigNumberToPrettyString, convertTypeToString, createDateFromTimestampMiliseconds, getReleases } from "../utils";
import { PaymentInput, PaymentReleaseInput, PaymentTypeAttributes, RawPaymentInput } from "./types";
import BigNumber from "bignumber.js";

export class PulsarTransactions {
  private static async getPulsarPaymentTransaction(
    sender: string,
    receivers: string[],
    cancellable: boolean,
    tokenId: string,
    name: string,
    type: PaymentTypeAttributes,
    releases: PaymentReleaseInput[],
    chainId: "mainnet" | "devnet" | "testnet"
  ) {
    const createPulsarPaymentUrl = getFeatureUrl(chainId, "create_payment");

    const token = tokenId;

    try {
      const { data: createPulsarPaymentTransaction } = await axios.post(createPulsarPaymentUrl, {
        token,
        sender,
        payment: {
          type,
          receivers,
          cancellable,
          name,
          releases,
        },
      });

      return {
        data: createPulsarPaymentTransaction,
        success: createPulsarPaymentTransaction !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }

  static async getPulsarPaymentMultiTransaction(sender: string, tokenId: string, chainId: "testnet" | "devnet" | "mainnet", paymentInputs: PaymentInput[]) {
    const createPulsarPaymentUrl = getFeatureUrl(chainId, "create_multi");
    const token = tokenId;
    const { data: createPulsarPaymentTransaction } = await axios.post(createPulsarPaymentUrl, {
      token,
      sender,
      payments: paymentInputs,
    });
    return createPulsarPaymentTransaction;
  }

  static async claim(fullTokenIds: string[], address: string, chainId: "mainnet" | "devnet" | "testnet") {
    try {
      const claimPulsarPaymentUrl = getFeatureUrl(chainId, "claim_payment");

      const { data: claimTransaction } = await axios.post(claimPulsarPaymentUrl, {
        fullTokenIds,
        address,
      });

      return {
        data: claimTransaction,
        success: claimTransaction !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }

  static async cancel(astraCancelTokenNonces: number[], address: string, chainId: "mainnet" | "devnet" | "testnet") {
    try {
      const cancelPulsarPaymentUrl = getFeatureUrl(chainId, "cancel_payment");

      const { data: cancelTransaction } = await axios.post(cancelPulsarPaymentUrl, {
        nonces: astraCancelTokenNonces,
        address,
      });

      return {
        data: cancelTransaction,
        success: cancelTransaction !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }

  static async createVault(
    token: string,
    amount: string,
    releaseTimestampInMiliseconds: number,
    name: string,
    address: string,
    chainId: "mainnet" | "devnet" | "testnet"
  ): Promise<any> {
    const vaultRelease: PaymentReleaseInput = {
      startDate: createDateFromTimestampMiliseconds(releaseTimestampInMiliseconds - ONE_SECOND_IN_MILISECONDS),
      endDate: createDateFromTimestampMiliseconds(releaseTimestampInMiliseconds),
      amount: amount,
      duration: DEFAULT_FREQUENCY_SECONDS,
    };

    const { data: lockQuery } = await PulsarTransactions.getPulsarPaymentTransaction(address, [address], false, token, name, PaymentTypeAttributes.Vault, [vaultRelease], chainId);

    return lockQuery;
  }

  static async createPayment(
    startTimestampInMiliSeconds: number,
    endTimestampInMiliSeconds: number,
    amount: string,
    receivers: string[],
    cancellable: boolean,
    token: string,
    paymentName: string,
    address: string,
    chainId: "mainnet" | "devnet" | "testnet"
  ): Promise<any> {
    const release: PaymentReleaseInput = {
      startDate: createDateFromTimestampMiliseconds(startTimestampInMiliSeconds),
      endDate: createDateFromTimestampMiliseconds(adjustEndDateAccordingToDuration(startTimestampInMiliSeconds, endTimestampInMiliSeconds, DEFAULT_FREQUENCY_SECONDS * 1000)),
      amount: amount,
      duration: DEFAULT_FREQUENCY_SECONDS,
    };

    const { data: paymentQuery } = await PulsarTransactions.getPulsarPaymentTransaction(
      address,
      receivers,
      cancellable,
      token,
      paymentName,
      PaymentTypeAttributes.Payment,
      [release],
      chainId
    );

    return paymentQuery;
  }

  static async createVesting(
    sender: string,
    receivers: string[],
    totalAmount: string,
    cliffDateInMiliseconds: number,
    cliffAmount: string,
    endDateInMiliseconds: number,
    frequency: number,
    cancellable: boolean,
    identifier: string,
    name: string,
    chainId: "mainnet" | "devnet" | "testnet"
  ): Promise<any> {
    const cliffRelease: PaymentReleaseInput = {
      startDate: createDateFromTimestampMiliseconds(cliffDateInMiliseconds - 1000),
      endDate: createDateFromTimestampMiliseconds(cliffDateInMiliseconds),
      amount: cliffAmount,
      duration: DEFAULT_FREQUENCY_SECONDS,
    };

    const vestingRelease: PaymentReleaseInput = {
      startDate: createDateFromTimestampMiliseconds(cliffDateInMiliseconds),
      endDate: createDateFromTimestampMiliseconds(adjustEndDateAccordingToDuration(cliffDateInMiliseconds, endDateInMiliseconds, frequency * 1000)),
      amount: bigNumberToPrettyString(new BigNumber(totalAmount).minus(new BigNumber(cliffAmount))),
      duration: frequency,
    };

    const { data: vestingQuery } = await PulsarTransactions.getPulsarPaymentTransaction(
      sender,
      receivers,
      cancellable,
      identifier,
      name,
      PaymentTypeAttributes.Vesting,
      [cliffRelease, vestingRelease],
      chainId
    );

    return vestingQuery;
  }

  static async createMultiPayment(sender: string, identifier: string, chainId: "mainnet" | "devnet" | "testnet", rawInputs: RawPaymentInput[]) {
    const paymentInputs = rawInputs.map((rawInput) => {
      const { receivers, cancellable, name, totalAmount, cliffDateInMiliseconds, cliffAmount, endDateInMiliseconds, frequency } = rawInput;
      const cliffRelease = {
        startDate: createDateFromTimestampMiliseconds(cliffDateInMiliseconds - 1e3),
        endDate: createDateFromTimestampMiliseconds(cliffDateInMiliseconds),
        amount: cliffAmount,
        duration: DEFAULT_FREQUENCY_SECONDS,
      };
      const vestingReleases = getReleases(
        cliffDateInMiliseconds,
        endDateInMiliseconds,
        bigNumberToPrettyString(new BigNumber(totalAmount).minus(new BigNumber(cliffAmount))),
        frequency
      );
      return {
        receivers,
        cancellable,
        name,
        type: PaymentTypeAttributes.Vesting,
        releases: [cliffRelease, ...vestingReleases],
      };
    });
    const multiPaymentQuery = await PulsarTransactions.getPulsarPaymentMultiTransaction(sender, identifier, chainId, paymentInputs);
    return multiPaymentQuery;
  }

  static async getFee(chainId: "mainnet" | "devnet" | "testnet") {
    let finalFee = 0;
    try {
      const { data: fee } = await axios.get(`${BASE_URLS[chainId]}/${GET_FEE_ENDPOINT}`);

      finalFee = fee;
    } catch (err) {
      finalFee = 0;
    }

    return finalFee;
  }

  static async delegate(address: string, amount: number, chainId: "mainnet" | "devnet" | "testnet") {
    try {
      const delegateUrl = getFeatureUrl(chainId, "delegate");

      const { data: delegateTransaction } = await axios.post(delegateUrl, {
        address,
        amount,
      });

      return {
        data: delegateTransaction,
        success: delegateTransaction !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }
}
