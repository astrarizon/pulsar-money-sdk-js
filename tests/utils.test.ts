import { PaymentTypeAttributes } from '../src/entities/payments/types';
import * as utils from '../src/entities/utils';

describe('testing utils', () => {
	test('should correctly convert type to string', () => {
		expect(utils.convertTypeToString(PaymentTypeAttributes.Vault)).toBe('vault');
		expect(utils.convertTypeToString(PaymentTypeAttributes.Payment)).toBe('payment');
		expect(utils.convertTypeToString(PaymentTypeAttributes.Vesting)).toBe('vesting');

		expect(utils.convertTypeToString(0)).toBe('vault');
		expect(utils.convertTypeToString(1)).toBe('payment');
		expect(utils.convertTypeToString(2)).toBe('vesting');

		expect(() => utils.convertTypeToString(3)).toThrowError('Invalid type.');
	});

	test('should correctly create date from timestamp miliseconds', () => {
		expect(utils.createDateFromTimestampMiliseconds(1685642898787)).toBe('2023-06-01T18:08:18.787Z');
		expect(utils.createDateFromTimestampMiliseconds(1620288000000)).toBe('2021-05-06T08:00:00.000Z');
		expect(utils.createUTCDateFromTimestampMiliseconds(1620288000000)).toBe('2021-05-06T08:00:00.000Z');
		expect(utils.createDateFromTimestampMiliseconds(1620288000)).toBe('2021-05-06T08:00:00.000Z');

		expect(() => utils.createUTCDateFromTimestampMiliseconds(1620288000)).toThrowError(
			'Invalid timestamp. Timestamp should be in miliseconds.',
		);
	});

	test('should correctly adjust end date according to duration', () => {
		expect(utils.adjustEndDateAccordingToDuration(1620288000000, 1620288000900, 1000)).toBe(1620288001000);
		expect(utils.adjustEndDateAccordingToDuration(1620288000000, 1620288000556, 100)).toBe(1620288000600);
		expect(utils.adjustEndDateAccordingToDuration(1620288000003, 1620288000012, 10)).toBe(1620288000013);
		expect(utils.adjustEndDateAccordingToDuration(1620288000004, 1620288000123, 10000)).toBe(1620288010004);
	});
});
