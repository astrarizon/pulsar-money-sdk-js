import axios from 'axios';
import { CANCEL_PULSAR_PAYMENT, CLAIM_PULSAR_PAYMENT, CREATE_PULSAR_PAYMENT, DEFAULT_FREQUENCY_SECONDS } from '../config';
import { adjustEndDateAccordingToDuration, convertTypeToString, createDateFromTimestampMiliseconds } from '../utils';
import { PaymentReleaseInput, PaymentTypeAttributes } from './types';

export class Transactions {
	private static async getPulsarPaymentTransaction(
		sender: string,
		receivers: string[],
		cancellable: boolean,
		tokenId: string,
		name: string,
		type: PaymentTypeAttributes,
		releases: PaymentReleaseInput[],
	) {
		const createPulsarPaymentUrl = CREATE_PULSAR_PAYMENT;

		const token = tokenId === 'EGLD' ? '' : tokenId;

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

	static async claim(astraPayTokenNonces: number[], address: string) {
		try {
			const { data: claimTransaction } = await axios.post(CLAIM_PULSAR_PAYMENT, {
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

	static async cancel(astraCancelTokenNonces: number[], address: string) {
		try {
			const { data: cancelTransaction } = await axios.post(CANCEL_PULSAR_PAYMENT, {
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
	): Promise<any> {
		const vaultRelease: PaymentReleaseInput = {
			startDate: createDateFromTimestampMiliseconds(releaseTimestampInMiliseconds - 1000),
			endDate: createDateFromTimestampMiliseconds(releaseTimestampInMiliseconds),
			amount: amount,
			duration: DEFAULT_FREQUENCY_SECONDS,
		};

		const { data: lockQuery } = await Transactions.getPulsarPaymentTransaction(
			address,
			[address],
			false,
			token,
			name,
			PaymentTypeAttributes.Vault,
			[vaultRelease],
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
	): Promise<any> {
		const release: PaymentReleaseInput = {
			startDate: createDateFromTimestampMiliseconds(startTimestampInMiliSeconds),
			endDate: createDateFromTimestampMiliseconds(
				adjustEndDateAccordingToDuration(startTimestampInMiliSeconds, endTimestampInMiliSeconds, DEFAULT_FREQUENCY_SECONDS * 1000),
			),
			amount: amount,
			duration: DEFAULT_FREQUENCY_SECONDS,
		};

		const { data: paymentQuery } = await Transactions.getPulsarPaymentTransaction(
			address,
			receivers,
			cancellable,
			token,
			paymentName,
			PaymentTypeAttributes.Payment,
			[release],
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
				adjustEndDateAccordingToDuration(cliffDateInMiliseconds, endDateInMiliseconds, frequency * 1000),
			),
			amount: totalAmount - cliffAmount,
			duration: frequency,
		};

		const { data: vestingQuery } = await Transactions.getPulsarPaymentTransaction(
			sender,
			receivers,
			cancellable,
			identifier,
			name,
			PaymentTypeAttributes.Vesting,
			[cliffRelease, vestingRelease],
		);

		return vestingQuery;
	}
}
