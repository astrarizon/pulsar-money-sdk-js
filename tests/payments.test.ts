import { getContractAddress } from '../src/entities/config';
import { Transactions } from '../src/entities/payments';
import { PaymentTypeAttributes } from '../src/entities/payments/types';
import { numberToBigUintHex, numberToHex } from '../src/entities/utils';

describe('testing payments', () => {
	test('should correctly get pulsar payment transaction1', async () => {
		const sender = 'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl';
		const receivers = [
			'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl',
			'erd1aqryf99wuwjrxuq5e6lfzxdwlgn2ck95uu4xges6u04v5c5560wsfrzrv7',
		];
		const cancellable = true;
		const tokenId = 'EGLD';
		const name = 'test_name';
		const type = PaymentTypeAttributes.Payment;
		const releases = [
			{
				startDate: '2024-01-01T00:00:00.000Z',
				endDate: '2024-01-02T00:00:00.000Z',
				amount: 1,
				duration: 1,
			},
		];
		const chainId = 'mainnet';

		const fee = await Transactions.getFee(chainId);

		// @ts-ignore
		const { data: payment } = await Transactions.getPulsarPaymentTransaction(
			sender,
			receivers,
			cancellable,
			tokenId,
			name,
			type,
			releases,
			chainId,
		);

		const paymentTypeHex = '01';
		const nameHex = Buffer.from(name, 'utf8').toString('hex');
		const tokenHex = Buffer.from(tokenId, 'utf8').toString('hex');
		const cancellableHex = cancellable ? '01' : '00';
		const receiversHex = receivers
			.map((receiver) => {
				return Buffer.from(receiver, 'utf8').toString('hex');
			})
			.join('');
		const feeHex = numberToHex(fee);

		const encodedReleases = releases
			.map((release) => {
				const startDate = Math.floor(new Date(release.startDate).getTime() / 1000);
				const endDate = Math.floor(new Date(release.endDate).getTime() / 1000);
				const amount = release.amount;
				const duration = release.duration;

				const startDateHex = numberToHex(startDate).padStart(16, '0');
				const endDateHex = numberToHex(endDate).padStart(16, '0');
				const durationHex = numberToHex(duration).padStart(16, '0');

				const amountHex = numberToBigUintHex(amount);

				return `${startDateHex}${endDateHex}${durationHex}${amountHex}`;
			})
			.join('');

		const expectedPayload = `create@${paymentTypeHex}@${nameHex}@${cancellableHex}@${receiversHex}@${feeHex}@${encodedReleases}`;
		const expectedPayloadBase64 = Buffer.from(expectedPayload, 'utf8').toString('base64');

		const totalAmount = releases.reduce((acc, release) => {
			return acc + release.amount;
		}, 0);

		let finalValue = 0;
		if (fee === 1) {
			finalValue = 2 * totalAmount;
		} else {
			finalValue = parseInt(((BigInt(10 ** 18) * BigInt(totalAmount)) / BigInt(1 - fee)).toString());
		}

		expect(payment).toEqual(
			expect.objectContaining({
				value: finalValue,
				receiver: 'erd1qqqqqqqqqqqqqpgqsanann348xhns6qx94rgcq8davw005vnlzhsezyt7t',
				sender: 'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl',
				data: expectedPayloadBase64,
				chainID: '1',
				version: 1,
			}),
		);
	});

	test('should correctly get pulsar payment transaction2', async () => {
		const sender = 'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl';
		const receivers = [
			'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl',
			'erd1aqryf99wuwjrxuq5e6lfzxdwlgn2ck95uu4xges6u04v5c5560wsfrzrv7',
		];
		const cancellable = false;
		const tokenId = 'USDC-c76f1f';
		const name = 'test_name';
		const type = PaymentTypeAttributes.Payment;
		const releases = [
			{
				startDate: '2024-01-01T00:00:00.000Z',
				endDate: '2024-01-02T00:00:00.000Z',
				amount: 1,
				duration: 1,
			},
			{
				startDate: '2024-01-03T00:00:00.000Z',
				endDate: '2024-01-04T00:00:00.000Z',
				amount: 1.1,
				duration: 2,
			},
		];
		const chainId = 'mainnet';

		// @ts-ignore
		const { data: payment } = await Transactions.getPulsarPaymentTransaction(
			sender,
			receivers,
			cancellable,
			tokenId,
			name,
			type,
			releases,
			chainId,
		);

		expect(payment).toEqual(
			expect.objectContaining({
				value: '0',
				receiver: getContractAddress(chainId),
				sender: 'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl',
				data: 'RVNEVFRyYW5zZmVyQDU1NTM0NDQzMmQ2MzM3MzY2NjMxNjZAMjAxYjkwQDYzNzI2NTYxNzQ2NUAwMUA3NDY1NzM3NDVmNmU2MTZkNjVAMDBAYmNmNDRlY2UyMWM3OTg3NjUxNzU5NTBiMGI4YTQxMGIwMzNiZGUyOGI2ODQ0MmYzYjk0M2JkNmUyNDU0OTM1YmU4MDY0NDk0YWVlM2E0MzM3MDE0Y2ViZTkxMTlhZWZhMjZhYzU4YjRlNzJhNjQ2NjFhZTNlYWNhNjI5NGQzZGRAMDAwMDAwMDA2NTkyMDA4MDAwMDAwMDAwNjU5MzUyMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDMwZjRhMTRAMDAwMDAwMDA2NTk0YTM4MDAwMDAwMDAwNjU5NWY1MDAwMDAwMDAwMDAwMDAwMDAyMDAwMDAwMDMxMGQxN2M=',
				chainID: '1',
			}),
		);
	});
});
