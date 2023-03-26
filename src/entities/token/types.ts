export declare type TokenDetails = {
	identifier: string;
	decimals: number;
	price: number;
};

export declare type TokenResult = {
	balance: string;
	amount: number;
	price: number | undefined;
	valueUsd: number | undefined;
	label: string;
	identifier: string;
	collection: string;
	isWhitelisted: boolean;
	decimals: number;
	svg: string | undefined;
};
