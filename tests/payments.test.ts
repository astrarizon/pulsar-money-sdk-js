import { Transactions } from '../src/entities/payments';
import { PaymentTypeAttributes } from '../src/entities/payments/types';

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
				value: '1002004008016032064',
				receiver: 'erd1qqqqqqqqqqqqqpgqsanann348xhns6qx94rgcq8davw005vnlzhsezyt7t',
				sender: 'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl',
				data: 'Y3JlYXRlQDAxQDc0NjU3Mzc0NWY2ZTYxNmQ2NUAwMUBiY2Y0NGVjZTIxYzc5ODc2NTE3NTk1MGIwYjhhNDEwYjAzM2JkZTI4YjY4NDQyZjNiOTQzYmQ2ZTI0NTQ5MzViZTgwNjQ0OTRhZWUzYTQzMzcwMTRjZWJlOTExOWFlZmEyNmFjNThiNGU3MmE2NDY2MWFlM2VhY2E2Mjk0ZDNkZEAwMDAwMDAwMDY1OTIwMDgwMDAwMDAwMDA2NTkzNTIwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwODBkZTdkNTU2MjE1MDMxNDA=',
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
				receiver: 'erd1qqqqqqqqqqqqqpgqsanann348xhns6qx94rgcq8davw005vnlzhsezyt7t',
				sender: 'erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl',
				data: 'RVNEVFRyYW5zZmVyQDU1NTM0NDQzMmQ2MzM3MzY2NjMxNjZAMjAxYjkwQDYzNzI2NTYxNzQ2NUAwMUA3NDY1NzM3NDVmNmU2MTZkNjVAMDBAYmNmNDRlY2UyMWM3OTg3NjUxNzU5NTBiMGI4YTQxMGIwMzNiZGUyOGI2ODQ0MmYzYjk0M2JkNmUyNDU0OTM1YmU4MDY0NDk0YWVlM2E0MzM3MDE0Y2ViZTkxMTlhZWZhMjZhYzU4YjRlNzJhNjQ2NjFhZTNlYWNhNjI5NGQzZGRAMDAwMDAwMDA2NTkyMDA4MDAwMDAwMDAwNjU5MzUyMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDMwZjRhMTRAMDAwMDAwMDA2NTk0YTM4MDAwMDAwMDAwNjU5NWY1MDAwMDAwMDAwMDAwMDAwMDAyMDAwMDAwMDMxMGQxN2M=',
				chainID: '1',
			}),
		);
	});
});
