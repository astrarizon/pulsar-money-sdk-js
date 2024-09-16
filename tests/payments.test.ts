import { PaymentTypeAttributes } from "../src/entities/payments/types";
import { PulsarTransactions } from "../src/entities/payments";
import { BinaryUtils } from "../src/entities/binaryUtils";
import { getContractAddress } from "../src/entities/config";

describe("testing payments", () => {
  test("should correctly get pulsar payment transaction1", async () => {
    const sender = "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl";
    const receivers = ["erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl", "erd1aqryf99wuwjrxuq5e6lfzxdwlgn2ck95uu4xges6u04v5c5560wsfrzrv7"];
    const cancellable = true;
    const tokenId = "EGLD";
    const name = "test_name";
    const type = PaymentTypeAttributes.Payment;
    const releases = [
      {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-01-02T00:00:00.000Z",
        amount: 1,
        duration: 1,
      },
    ];
    const chainId = "mainnet";

    const fee = await PulsarTransactions.getFee(chainId);

    // @ts-ignore
    const { data: payment } = await PulsarTransactions.getPulsarPaymentTransaction(sender, receivers, cancellable, tokenId, name, type, releases, chainId);

    const paymentTypeHex = "01";
    const nameHex = Buffer.from(name, "utf8").toString("hex");
    const tokenHex = Buffer.from(tokenId, "utf8").toString("hex");
    const cancellableHex = cancellable ? "01" : "00";
    const receiversHex = ["bcf44ece21c798765175950b0b8a410b033bde28b68442f3b943bd6e2454935b", "e8064494aee3a4337014cebe9119aefa26ac58b4e72a64661ae3eaca6294d3dd"].join("");
    const feeHex = BinaryUtils.numberToHex(fee);

    const encodedReleases = releases
      .map((release) => {
        const startDate = Math.floor(new Date(release.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(release.endDate).getTime() / 1000);
        const amount = release.amount;
        const duration = release.duration;

        const startDateHex = BinaryUtils.numberToHex(startDate).padStart(16, "0");
        const endDateHex = BinaryUtils.numberToHex(endDate).padStart(16, "0");
        const durationHex = BinaryUtils.numberToHex(duration).padStart(16, "0");

        const amntDenom = BigInt(10 ** 18) * BigInt(amount);
        const amountHex = BinaryUtils.bigIntToHex(amntDenom);

        return `${startDateHex}${endDateHex}${durationHex}${amountHex}`;
      })
      .join("");

    const expectedPayload = `create@${paymentTypeHex}@${nameHex}@${cancellableHex}@${receiversHex}@${feeHex}@${encodedReleases}`;
    const expectedPayloadBase64 = Buffer.from(expectedPayload, "utf8").toString("base64");

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
        value: finalValue.toString(),
        receiver: getContractAddress(chainId),
        sender: "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl",
        data: expectedPayloadBase64,
        chainID: "1",
        version: 1,
      })
    );
  });

  test("should correctly get pulsar payment transaction2", async () => {
    const sender = "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl";
    const receivers = ["erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl", "erd1aqryf99wuwjrxuq5e6lfzxdwlgn2ck95uu4xges6u04v5c5560wsfrzrv7"];
    const cancellable = false;
    const tokenId = "USDC-c76f1f";
    const name = "test_name";
    const type = PaymentTypeAttributes.Payment;
    const releases = [
      {
        startDate: "2024-01-01T00:00:00.000Z",
        endDate: "2024-01-02T00:00:00.000Z",
        amount: 1,
        duration: 1,
      },
      {
        startDate: "2024-01-03T00:00:00.000Z",
        endDate: "2024-01-04T00:00:00.000Z",
        amount: 1.1,
        duration: 2,
      },
    ];
    const chainId = "mainnet";

    // @ts-ignore
    const { data: payment } = await PulsarTransactions.getPulsarPaymentTransaction(sender, receivers, cancellable, tokenId, name, type, releases, chainId);

    const encodedReleases = releases
      .map((release) => {
        const startDate = Math.floor(new Date(release.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(release.endDate).getTime() / 1000);
        const amount = release.amount;
        const duration = release.duration;

        const startDateHex = BinaryUtils.numberToHex(startDate).padStart(16, "0");
        const endDateHex = BinaryUtils.numberToHex(endDate).padStart(16, "0");
        const durationHex = BinaryUtils.numberToHex(duration).padStart(16, "0");

        const amntDenom = BigInt(10 ** 6 * amount);
        const amountHex = BinaryUtils.bigIntToHex(amntDenom);

        return `${startDateHex}${endDateHex}${durationHex}${amountHex}`;
      })
      .join("@");

    const fee = await PulsarTransactions.getFee(chainId);
    const feeHex = BinaryUtils.numberToHex(fee);

    const paymentTypeHex = "01";
    const nameHex = Buffer.from(name, "utf8").toString("hex");
    const tokenHex = Buffer.from(tokenId, "utf8").toString("hex");
    const cancellableHex = cancellable ? "01" : "00";
    const receiversHex = ["bcf44ece21c798765175950b0b8a410b033bde28b68442f3b943bd6e2454935b", "e8064494aee3a4337014cebe9119aefa26ac58b4e72a64661ae3eaca6294d3dd"].join("");

    const totalAmount = releases.reduce((acc, release) => {
      return acc + release.amount;
    }, 0);

    const totalAmountHex = BinaryUtils.numberToHex(totalAmount * 10 ** 6);
    const expectedPayload = `ESDTTransfer@${tokenHex}@${totalAmountHex}@${BinaryUtils.stringToHex(
      "create"
    )}@${paymentTypeHex}@${nameHex}@${cancellableHex}@${receiversHex}@${feeHex}@${encodedReleases}`;
    const expectedPayloadBase64 = Buffer.from(expectedPayload, "utf8").toString("base64");

    expect(payment).toEqual(
      expect.objectContaining({
        value: "0",
        receiver: getContractAddress(chainId),
        sender: "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl",
        data: expectedPayloadBase64,
        chainID: "1",
      })
    );
  });

  test("should correctly create vault egld", async () => {
    const sender = "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl";
    const receivers = ["erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl"];
    const cancellable = true;
    const tokenId = "EGLD";
    const name = "test_name";
    const type = PaymentTypeAttributes.Vault;
    const releases = [
      {
        startDate: "2024-01-01T00:00:00.000Z",
        endDate: "2024-01-01T00:00:01.000Z",
        amount: 1,
        duration: 1,
      },
    ];
    const chainId = "mainnet";

    const fee = await PulsarTransactions.getFee(chainId);

    // @ts-ignore
    const { data: payment } = await PulsarTransactions.getPulsarPaymentTransaction(sender, receivers, cancellable, tokenId, name, type, releases, chainId);

    const paymentTypeHex = "00";
    const nameHex = Buffer.from(name, "utf8").toString("hex");
    const tokenHex = Buffer.from(tokenId, "utf8").toString("hex");
    const cancellableHex = cancellable ? "01" : "00";
    const receiversHex = ["bcf44ece21c798765175950b0b8a410b033bde28b68442f3b943bd6e2454935b"];
    const feeHex = BinaryUtils.numberToHex(fee);

    const encodedReleases = releases
      .map((release) => {
        const startDate = Math.floor(new Date(release.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(release.endDate).getTime() / 1000);
        const amount = release.amount;
        const duration = release.duration;

        const startDateHex = BinaryUtils.numberToHex(startDate).padStart(16, "0");
        const endDateHex = BinaryUtils.numberToHex(endDate).padStart(16, "0");
        const durationHex = BinaryUtils.numberToHex(duration).padStart(16, "0");

        const amntDenom = BigInt(10 ** 18) * BigInt(amount);
        const amountHex = BinaryUtils.bigIntToHex(amntDenom);

        return `${startDateHex}${endDateHex}${durationHex}${amountHex}`;
      })
      .join("");

    const expectedPayload = `create@${paymentTypeHex}@${nameHex}@${cancellableHex}@${receiversHex}@${feeHex}@${encodedReleases}`;
    const expectedPayloadBase64 = Buffer.from(expectedPayload, "utf8").toString("base64");

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
        value: finalValue.toString(),
        receiver: getContractAddress(chainId),
        sender: "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl",
        data: expectedPayloadBase64,
        chainID: "1",
        version: 1,
      })
    );
  });

  test("should correctly create vault esdt", async () => {
    const sender = "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl";
    const receivers = ["erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl"];
    const cancellable = true;
    const tokenId = "USDC-c76f1f";
    const name = "test_name";
    const type = PaymentTypeAttributes.Vault;
    const releases = [
      {
        startDate: "2024-01-01T00:00:00.000Z",
        endDate: "2024-01-02T00:00:00.000Z",
        amount: 1,
        duration: 1,
      },
    ];
    const chainId = "mainnet";

    // @ts-ignore
    const { data: payment } = await PulsarTransactions.getPulsarPaymentTransaction(sender, receivers, cancellable, tokenId, name, type, releases, chainId);

    const encodedReleases = releases
      .map((release) => {
        const startDate = Math.floor(new Date(release.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(release.endDate).getTime() / 1000);
        const amount = release.amount;
        const duration = release.duration;

        const startDateHex = BinaryUtils.numberToHex(startDate).padStart(16, "0");
        const endDateHex = BinaryUtils.numberToHex(endDate).padStart(16, "0");
        const durationHex = BinaryUtils.numberToHex(duration).padStart(16, "0");

        const amntDenom = BigInt(10 ** 6 * amount);
        const amountHex = BinaryUtils.bigIntToHex(amntDenom);

        return `${startDateHex}${endDateHex}${durationHex}${amountHex}`;
      })
      .join("@");

    const fee = await PulsarTransactions.getFee(chainId);
    const feeHex = BinaryUtils.numberToHex(fee);

    const paymentTypeHex = "00";
    const nameHex = Buffer.from(name, "utf8").toString("hex");
    const tokenHex = Buffer.from(tokenId, "utf8").toString("hex");
    const cancellableHex = cancellable ? "01" : "00";
    const receiversHex = ["bcf44ece21c798765175950b0b8a410b033bde28b68442f3b943bd6e2454935b"].join("");

    const totalAmount = releases.reduce((acc, release) => {
      return acc + release.amount;
    }, 0);

    const totalAmountHex = BinaryUtils.numberToHex(totalAmount * 10 ** 6);
    const expectedPayload = `ESDTTransfer@${tokenHex}@${totalAmountHex}@${BinaryUtils.stringToHex(
      "create"
    )}@${paymentTypeHex}@${nameHex}@${cancellableHex}@${receiversHex}@${feeHex}@${encodedReleases}`;
    const expectedPayloadBase64 = Buffer.from(expectedPayload, "utf8").toString("base64");

    expect(payment).toEqual(
      expect.objectContaining({
        value: "0",
        receiver: getContractAddress(chainId),
        sender: "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl",
        data: expectedPayloadBase64,
        chainID: "1",
      })
    );
  });

  test("should create vault esdt", async () => {
    const address = "erd1hn6yan3pc7v8v5t4j59shzjppvpnhh3gk6zy9uaegw7kufz5jddsd550pl";
    const tokenId = "USDC-c76f1f";
    const name = "test_name";
    const releaseTimestamp = 1692269164944;
    const amount = "1";
    const chainId = "mainnet";

    const { data: payment } = await PulsarTransactions.createVault(tokenId, amount, releaseTimestamp, name, address, chainId);

    expect(payment).toEqual(undefined);
  });
});
