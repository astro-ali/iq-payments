require("dotenv").config();
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

/**
 * The developer should set the following in his (.env) file
 * PRODUCTION (boolean)
 * TOKEN_SECRET_KEY
 * MERCHANTID
 * MSISDN
 */

// prameters example for me
const paymentDetails = {
  lang: "en",
  amount: "250",
  serviceType: "fin hackthon",
  orderId: "123",
  redirectUrl: "localhost:5000/redirectHome",
};

export default class ZainCash {
  static init(paymentDetails) {
    // constant URL for testing zainCash API
    let initUrl = "https://test.zaincash.iq/transaction/init";
    let requestUrl = "https://test.zaincash.iq/transaction/pay?id=";

    if (process.env.PRODUCTION && process.env.PRODUCTION === "true") {
      initUrl = "https://api.zaincash.iq/transaction/init";
      requestUrl = "https://api.zaincash.iq/transaction/pay?id=";
    }

    const time = Date.now();

    const data = {
      amount: paymentDetails.amount,
      serviceType: paymentDetails.serviceType, // any thing
      msisdn: process.env.MSISDN,
      orderId: paymentDetails.orderId,
      redirectUrl: paymentDetails.redirectUrl,
      iat: time,
      exp: time + 60 * 60 * 4, // + 4 min
    };

    if (!process.env.TOKEN_SECRET_KEY) {
      return console.error("You have to specify a token secret");
    }
    const token = jwt.sign(data, process.env.TOKEN_SECRET_KEY);

    if (!process.env.MERCHANTID)
      return console.error("There is no merchant id in your .env file");

    const postData = {
      token: token,
      merchantId: process.env.MERCHANTID,
      lang: paymentDetails.lang,
    };

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(postData),
      redirect: "follow",
    };

    let url = "";
    let resBody;

    fetch("https://test.zaincash.iq/transaction/init", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const OperationId = JSON.parse(result).id;
        console.log(JSON.parse(result));
         url = requestUrl + OperationId;
         resBody = result;
      })
      .catch((error) => console.log("error", error));

      return {url,result};
  }

  static async pay(req, res) {
    const token = req.body.token;
    if (token) {
      try {
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      } catch (err) {
        console.log(err);
      }
      // if successd return this obj
      if (decoded.status == "success") {
        // transaction successed
        // Do whatever you like
        return {
          status: decoded.status,
          result: decoded,
        };
        // if pending return this
      } else {
        return {
          status: decoded.status,
          result: decoded,
        };
      }
    }
  }
}