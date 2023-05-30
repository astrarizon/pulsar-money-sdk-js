interface IBASE_URLS {
	mainnet: string;
	devnet: string;
	testnet: string;
}

export const BASE_URLS: IBASE_URLS = {
	mainnet: 'https://pulsar-money-prod.herokuapp.com',
	devnet: 'https://pulsar-money-devnet.herokuapp.com',
	testnet: 'https://pulsar-money-testnet.herokuapp.com',
};
export type FEATURE_TYPE = 'create_payment' | 'claim_payment' | 'cancel_payment' | 'delegate';

export const getFeatureUrl = (chain: 'testnet' | 'devnet' | 'mainnet', feature: FEATURE_TYPE) => {
	const url = BASE_URLS[chain];

	switch (feature) {
		case 'create_payment':
			return `${url}${CREATE_PULSAR_PAYMENT_ENDPOINT}`;
		case 'claim_payment':
			return `${url}${CLAIM_PULSAR_PAYMENT_ENDPOINT}`;
		case 'cancel_payment':
			return `${url}${CANCEL_PULSAR_PAYMENT_ENDPOINT}`;
		case 'delegate':
			return `${url}${DELEGATE_ENDPOINT}`;
		default:
			throw new Error('Invalid feature type.');
	}
};

const CREATE_PULSAR_PAYMENT_ENDPOINT = `/transaction/payment/create`;
const CLAIM_PULSAR_PAYMENT_ENDPOINT = `/transaction/payment/claim`;
const CANCEL_PULSAR_PAYMENT_ENDPOINT = `/transaction/payment/cancel`;
const DELEGATE_ENDPOINT = `/transaction/stake`;

export const DEFAULT_FREQUENCY_SECONDS = 1;
