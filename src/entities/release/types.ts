export declare type ReleaseAttributes = {
	startDate: number;
	endDate: number;
	intervalSeconds: number;
	amount: string;
};

export declare type ReleaseResult = {
	startDate: string;
	endDate: string;
	intervalSeconds: number;
	totalAmount: number;
	claimableAmount: number;
	cancelledAmount: number;
	remainingAmount: number;
};
