const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the literal '0' when given false values as input", () => {
    const values =  ["", 0, false];
    for (const v of values) {
      const result = deterministicPartitionKey(v);
      expect(result).toBe("0");
    }
  });

  it("Returns hash of strigification for values that don't have a .partitionKey field", () => {
    const values =  [[], {}];
    for(let i = 0; i < 300; i++) {
      values[0].push(i);
      values[1][i] = i;
    }
    for (const v of values) {
      const result = deterministicPartitionKey(v);
      const expected = crypto.createHash("sha3-512").update(JSON.stringify(v)).digest("hex");
      expect(result).toBe(expected);
    }
  });


  it("Returns the .partitionKey field if it contains a valid value", () => {
    let maxLenString = "";
    for(var i = 0; i < 256; i++) {
      maxLenString += "a";
    }

    const values =  [{partitionKey: "asdfsad"}, {partitionKey: "a", x: 2}, {partitionKey: maxLenString, y: 1, z: 3}];
    for (const v of values) {
      const result = deterministicPartitionKey(v);
      expect(result).toBe(v.partitionKey);
    }
  });

  it("Returns the hashed value of .partitionKey field if it is a string larger than 256", () => {
    let overValue1 = "";
    let overValue2 = "";
    for(var i = 0; i < 257; i++) {
      overValue1 += "a";
      overValue2 += "a";
      overValue2 += "b";
    }

    const values =  [{partitionKey: overValue1}, {partitionKey: overValue2, x: 2}];
    for (const v of values) {
      const result = deterministicPartitionKey(v);
      const expected = crypto.createHash("sha3-512").update(v.partitionKey).digest("hex");
      expect(result).toBe(expected);
    }
  });

  it("Returns stringified value of .partitionKey field if it is not a string and stringifies for less than 256 characters", () => {
    const values =  [{partitionKey: 321}, {partitionKey: {1: 3}, x: 2}];
    for (const v of values) {
      const result = deterministicPartitionKey(v);
      const expected = JSON.stringify(v.partitionKey);
      expect(result).toBe(expected);
    }
  });

  it("Returns stringified hashed value of .partitionKey field if it is not a string and stringifies for more than 256 characters", () => {
    const large_keys =  [[], {}];
    for(let i = 0; i < 300; i++) {
      large_keys[0].push(i);
      large_keys[1][i] = i;
    }
    const values =  [{partitionKey: large_keys[0]}, {partitionKey: large_keys[1], x: 2}];
    for (const v of values) {
      const result = deterministicPartitionKey(v);
      const expected = crypto.createHash("sha3-512").update(JSON.stringify(v.partitionKey)).digest("hex");
      expect(result).toBe(expected);
    }
  });
});
