const zaincash = require("./Pyments/zaincash");
const paytab = require("./Pyments/paytab");
const arab = require('./Pyments/arab');

// ['zaincash', 'paytab', 'arab', 'tsdid', 'switch','amwal']

export default class IQPayment {
  static async init(method, paymentDetails) {
    // zaincash
    if (method === "zaincash") {
      const result = await zaincash.init(paymentDetails);
      if (!result) return "something went wrong";
      return result;
    }
    // paytab
    else if (method === "paytab") {
      const result = await paytab.init(paymentDetails);
      if (!result) return "something went wrong with the transaction request";
      return result;
    }
    // arab
    else if (method === "arab") {
        const result = await arab.init(paymentDetails);
        if (!result) return "something went wrong with the transaction request";
        return result;
    }
    // tesdid
    else if (method === "tesdid") {

    }
    // switch
    else if (method === "switch") {
    } else {
      console.error("paymet code is not valid, please choose a valid one");
      return {
        methodCode: method,
        message: "this code is not valid",
      };
    }
  }

  static async verify(method, transactionId) {
    if (method === "arab") {
        const result = await arab.verify(transactionId);
        if (!result) return "something went wrong with the transaction request";
        return result;
    }
    else {
        console.error("paymet code is not valid, please choose a valid one");
        return {
          methodCode: method,
          message: "this code is not valid",
        };
      }
  }
}