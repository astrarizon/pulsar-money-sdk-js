import { PaymentTypeAttributes } from './payments/types';

export const convertTypeToString = (type: PaymentTypeAttributes) => {
	switch (type) {
		case PaymentTypeAttributes.Vault:
			return 'vault';
		case PaymentTypeAttributes.Payment:
			return 'payment';
		case PaymentTypeAttributes.Vesting:
			return 'vesting';
		default:
			throw new Error('Invalid type.');
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
		throw new Error('Invalid timestamp. Timestamp should be in miliseconds.');
	}

	const date = new Date(timestamp);

	return date.toISOString();
};

export const adjustEndDateAccordingToDuration = (startDate: number, endDate: number, releaseDuration: number) => {
	const noOfIntervals = Math.ceil((endDate - startDate) / releaseDuration);

	return startDate + releaseDuration * noOfIntervals;
};
