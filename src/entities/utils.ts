import { PaymentTypeAttributes } from './payments/types';

export const convertTypeToString = (type: PaymentTypeAttributes) => {
	switch (type) {
		case PaymentTypeAttributes.Vault:
			return 'vault';
		case PaymentTypeAttributes.Payment:
			return 'payment';
		case PaymentTypeAttributes.Vesting:
			return 'vesting';
	}
};

export const createDateFromTimestampMiliseconds = (timestamp: number) => {
	return createUTCDateFromTimestampMiliseconds(timestamp);
};

export const createUTCDateFromTimestampMiliseconds = (timestamp: number) => {
	const date = new Date(timestamp);

	return date.toISOString();
};

export const adjustEndDateAccordingToDuration = (startDate: number, endDate: number, releaseDuration: number) => {
	const noOfIntervals = Math.round((endDate - startDate) / releaseDuration);

	return startDate + releaseDuration * noOfIntervals;
};
