
import crypto from "crypto";

export default class HMACUtil {
    static generateKey() {
      return crypto.randomBytes(32).toString("hex");
    }
  
    static generateHMAC(message, key) {
      return crypto.createHmac("sha256", key).update(message).digest("hex");
    }
  
    static verifyHMAC(receivedHMAC, message, key) {
      const computedHMAC = this.generateHMAC(message, key);
      return receivedHMAC === computedHMAC;
    }
  }