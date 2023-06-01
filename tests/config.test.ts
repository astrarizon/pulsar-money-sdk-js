import * as config from '../src/entities/config';

describe('testing config', () => {
	test('should correctly get feature url', () => {
		expect(config.getFeatureUrl('devnet', 'create_payment')).toBe(config.BASE_URLS.devnet + config.CREATE_PULSAR_PAYMENT_ENDPOINT);
		expect(config.getFeatureUrl('devnet', 'cancel_payment')).toBe(config.BASE_URLS.devnet + config.CANCEL_PULSAR_PAYMENT_ENDPOINT);
		expect(config.getFeatureUrl('devnet', 'delegate')).toBe(config.BASE_URLS.devnet + config.DELEGATE_ENDPOINT);
		expect(config.getFeatureUrl('devnet', 'claim_payment')).toBe(config.BASE_URLS.devnet + config.CLAIM_PULSAR_PAYMENT_ENDPOINT);

		expect(config.getFeatureUrl('mainnet', 'create_payment')).toBe(config.BASE_URLS.mainnet + config.CREATE_PULSAR_PAYMENT_ENDPOINT);
		expect(config.getFeatureUrl('mainnet', 'cancel_payment')).toBe(config.BASE_URLS.mainnet + config.CANCEL_PULSAR_PAYMENT_ENDPOINT);
		expect(config.getFeatureUrl('mainnet', 'delegate')).toBe(config.BASE_URLS.mainnet + config.DELEGATE_ENDPOINT);
		expect(config.getFeatureUrl('mainnet', 'claim_payment')).toBe(config.BASE_URLS.mainnet + config.CLAIM_PULSAR_PAYMENT_ENDPOINT);

		expect(config.getFeatureUrl('testnet', 'create_payment')).toBe(config.BASE_URLS.testnet + config.CREATE_PULSAR_PAYMENT_ENDPOINT);
		expect(config.getFeatureUrl('testnet', 'cancel_payment')).toBe(config.BASE_URLS.testnet + config.CANCEL_PULSAR_PAYMENT_ENDPOINT);
		expect(config.getFeatureUrl('testnet', 'delegate')).toBe(config.BASE_URLS.testnet + config.DELEGATE_ENDPOINT);
		expect(config.getFeatureUrl('testnet', 'claim_payment')).toBe(config.BASE_URLS.testnet + config.CLAIM_PULSAR_PAYMENT_ENDPOINT);

		expect(() => config.getFeatureUrl('testnet', '' as any)).toThrowError(`Invalid feature type. ${''}`);
		expect(() => config.getFeatureUrl('mainnet', '' as any)).toThrowError(`Invalid feature type. ${''}`);
		expect(() => config.getFeatureUrl('devnet', '' as any)).toThrowError(`Invalid feature type. ${''}`);
		expect(() => config.getFeatureUrl('' as any, '' as any)).toThrowError(`Invalid feature type. ${''}`);
	});

	test('frequency should be 1', () => {
		expect(config.DEFAULT_FREQUENCY_SECONDS).toBe(1);
		expect(config.DEFAULT_FREQUENCY_SECONDS).not.toBe(2);
	});
});
