const crypto = require("crypto");

function genHash(value) {
  return crypto.createHash("sha3-512").update(value).digest("hex");
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  // Using a guard reduces nesting and makes reading the rest of the function without caring
  // about this false values.
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  // Starting with the non existing partitionKey express more clearly what should be done in this case,
  // which doesn't have multiple steps as it would seem by the original code.
  if (!event.partitionKey) {
    return genHash(JSON.stringify(event));
  }

  // Now it is clear that the provided value has to pass a few verifications and be adjusted accordingly.
  // Verifying if the provided value is a string and stringifying otherwise.
  const candidate = typeof event.partitionKey === "string" 
      ? event.partitionKey 
      : JSON.stringify(event.partitionKey);

  // Verifying if the provided value is of the correct lenght and hashing otherwise.
  return candidate.length <= MAX_PARTITION_KEY_LENGTH 
      ? candidate 
      : genHash(candidate);
};