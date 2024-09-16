import { BinaryUtils } from "../src/entities/binaryUtils";
import { PaymentTypeAttributes } from "../src/entities/payments/types";
import * as utils from "../src/entities/utils";

describe("testing utils", () => {
  test("should correctly convert type to string", () => {
    expect(utils.convertTypeToString(PaymentTypeAttributes.Vault)).toBe("vault");
    expect(utils.convertTypeToString(PaymentTypeAttributes.Payment)).toBe("payment");
    expect(utils.convertTypeToString(PaymentTypeAttributes.Vesting)).toBe("vesting");

    expect(utils.convertTypeToString(PaymentTypeAttributes.Vault)).toBe("vault");
    expect(utils.convertTypeToString(PaymentTypeAttributes.Payment)).toBe("payment");
    expect(utils.convertTypeToString(PaymentTypeAttributes.Vesting)).toBe("vesting");

    // @ts-ignore
    expect(() => utils.convertTypeToString(3)).toThrowError("Invalid type.");
  });

  test("should correctly create date from timestamp miliseconds", () => {
    expect(utils.createDateFromTimestampMiliseconds(1685642898787)).toBe("2023-06-01T18:08:18.787Z");
    expect(utils.createDateFromTimestampMiliseconds(1620288000000)).toBe("2021-05-06T08:00:00.000Z");
    expect(utils.createUTCDateFromTimestampMiliseconds(1620288000000)).toBe("2021-05-06T08:00:00.000Z");
    expect(utils.createDateFromTimestampMiliseconds(1620288000)).toBe("2021-05-06T08:00:00.000Z");

    expect(() => utils.createUTCDateFromTimestampMiliseconds(1620288000)).toThrowError("Invalid timestamp. Timestamp should be in miliseconds.");
  });

  test("should correctly adjust end date according to duration", () => {
    expect(utils.adjustEndDateAccordingToDuration(1620288000000, 1620288000900, 1000)).toBe(1620288001000);
    expect(utils.adjustEndDateAccordingToDuration(1620288000000, 1620288000556, 100)).toBe(1620288000600);
    expect(utils.adjustEndDateAccordingToDuration(1620288000003, 1620288000012, 10)).toBe(1620288000013);
    expect(utils.adjustEndDateAccordingToDuration(1620288000004, 1620288000123, 10000)).toBe(1620288010004);
  });

  test("test number to hex", () => {
    expect(BinaryUtils.numberToHex(123)).toBe("7b");
    expect(BinaryUtils.numberToHex(123456789)).toBe("075bcd15");
    expect(BinaryUtils.numberToHex(12345678912345678)).toBe("2bdc545e14d64e");
  });

  test("test hex to number", () => {
    expect(BinaryUtils.hexToNumber("7b")).toBe(123);
    expect(BinaryUtils.hexToNumber("075bcd15")).toBe(123456789);
    expect(BinaryUtils.hexToNumber("2bdc545e14d64e")).toBe(12345678912345678);
    expect(BinaryUtils.hexToNumber("100")).toBe(256);
  });

  test("test string to hex", () => {
    expect(BinaryUtils.stringToHex("test")).toBe("74657374");
    expect(BinaryUtils.stringToHex("test test")).toBe("746573742074657374");
    expect(BinaryUtils.stringToHex("test test test")).toBe("7465737420746573742074657374");
    expect(BinaryUtils.stringToHex("hello world")).toBe("68656c6c6f20776f726c64");
  });

  test("test number to big uint hex", () => {
    expect(BinaryUtils.bigIntToHex(BigInt(123))).toBe("000000017b");
    expect(BinaryUtils.bigIntToHex(BigInt(123456789))).toBe("00000004075bcd15");
    expect(BinaryUtils.bigIntToHex(BigInt(12345678912345678))).toBe("000000072bdc545e14d64e");
  });
});
