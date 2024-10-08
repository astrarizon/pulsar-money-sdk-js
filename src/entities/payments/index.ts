import axios from "axios";
import { BASE_URLS, DEFAULT_FREQUENCY_SECONDS, getFeatureUrl, GET_FEE_ENDPOINT, ONE_SECOND_IN_MILISECONDS } from "../config";
import { adjustEndDateAccordingToDuration, convertTypeToString, createDateFromTimestampMiliseconds } from "../utils";
import { PaymentReleaseInput, PaymentTypeAttributes } from "./types";

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
        type: convertTypeToString(type),
        sender,
        receivers,
        cancellable,
        name,
        token,
        releases,
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

  static async claim(astraPayTokenNonces: string[], address: string, chainId: "mainnet" | "devnet" | "testnet") {
    try {
      const claimPulsarPaymentUrl = getFeatureUrl(chainId, "claim_payment");

      const { data: claimTransaction } = await axios.post(claimPulsarPaymentUrl, {
        nonces: astraPayTokenNonces,
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
    amount: number,
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

    const { data: lockQuery } = await PulsarTransactions.getPulsarPaymentTransaction(
      address,
      [address],
      false,
      token,
      name,
      PaymentTypeAttributes.Vault,
      [vaultRelease],
      chainId
    );

    return lockQuery;
  }

  static async createPayment(
    startTimestampInMiliSeconds: number,
    endTimestampInMiliSeconds: number,
    amount: number,
    receivers: string[],
    cancellable: boolean,
    token: string,
    paymentName: string,
    address: string,
    chainId: "mainnet" | "devnet" | "testnet"
  ): Promise<any> {
    const release: PaymentReleaseInput = {
      startDate: createDateFromTimestampMiliseconds(startTimestampInMiliSeconds),
      endDate: createDateFromTimestampMiliseconds(
        adjustEndDateAccordingToDuration(startTimestampInMiliSeconds, endTimestampInMiliSeconds, DEFAULT_FREQUENCY_SECONDS * 1000)
      ),
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
    totalAmount: number,
    cliffDateInMiliseconds: number,
    cliffAmount: number,
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
      endDate: createDateFromTimestampMiliseconds(
        adjustEndDateAccordingToDuration(cliffDateInMiliseconds, endDateInMiliseconds, frequency * 1000)
      ),
      amount: totalAmount - cliffAmount,
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

      const { data: stakeTransaction } = await axios.post(delegateUrl, {
        address,
        amount,
      });

      return {
        data: stakeTransaction,
        success: stakeTransaction !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }
}
