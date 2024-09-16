import { Account, IAddress, INonce, IPlainTransactionObject, ITransactionValue, TokenTransfer, Transaction, TransactionPayload } from "@multiversx/sdk-core/out";
import { GAS_LIMIT } from "../config";
import { TransactionFactory, getAccount, getNetworkProvider } from "../utils";

export class TransactionsUtils {
  static async createSendEgld(amount: number, senderAddress: IAddress, receiverAddress: IAddress, currentChain: "testnet" | "devnet" | "mainnet", message = "") {
    const extraGasIfNeeded = message ? message.length * 1500 : 0;

    const egldAmount = TokenTransfer.egldFromAmount(amount);
    const networkProvider = getNetworkProvider(currentChain);

    const senderAccount = await getAccount(senderAddress.bech32(), networkProvider);

    return this.createFinalTransaction(
      senderAccount.nonce,
      egldAmount,
      receiverAddress,
      senderAccount.address,
      GAS_LIMIT + extraGasIfNeeded,
      new TransactionPayload(message),
      currentChain
    );
  }

  static async createSendEsdtTx(
    tokenId: string,
    amount: number,
    decimals: number,
    senderAccount: Account,
    receiverAddress: IAddress,
    extraPayload = "",
    currentChain: "testnet" | "devnet" | "mainnet"
  ) {
    const payment = TokenTransfer.fungibleFromAmount(tokenId, amount, decimals);
    const payload = TransactionFactory.createESDTTransfer({
      tokenTransfer: payment,
      nonce: senderAccount.nonce,
      receiver: receiverAddress,
      sender: senderAccount.address,
      chainID: currentChain,
    });

    const finalPayload = extraPayload ? `${payload.getData()}@${extraPayload}` : `${payload.getData()}`;

    return this.createFinalTransaction(senderAccount.nonce, undefined, receiverAddress, senderAccount.address, GAS_LIMIT, new TransactionPayload(finalPayload), currentChain);
  }

  private static createFinalTransaction(
    nonce: INonce,
    value: ITransactionValue | undefined,
    receiver: IAddress,
    sender: IAddress,
    gasLimit: number,
    data: TransactionPayload,
    chainID: string
  ): IPlainTransactionObject {
    return new Transaction({
      nonce,
      value,
      receiver,
      sender,
      gasLimit,
      data,
      chainID,
    }).toPlainObject();
  }
}
