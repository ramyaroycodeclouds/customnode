// crypto module
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);
// protected data
const message = "Secret Message";
// secret key generates 32 bytes of random data
const securityKey = crypto.randomBytes(32);
//The cipher function
const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
//Encrypt the message
let encryptedData = cipher.update(message, "utf-8", "hex");
encryptedData += cipher.final("hex");
console.log("The encrypted message is:", encryptedData);
//Decrypt the message
const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
decryptedData += decipher.final("utf8");
console.log("The decrypted message is:", decryptedData);