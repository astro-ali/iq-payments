const fetch = require("node-fetch");
require("dotenv").config();

// const paymentDetails = {
//   orderNumber: "123777777", // from developer db
//   amount: "100000",
//   currency: "368",
//   returnUrl: "https://www.google.com",
//   failUrl: "https://www.aps.iq",
//   language: "ar",
//   description: "test",
//   sessionTimeoutSecs: "5000",
// };

class ArabPaymentGatway {
  static async init() {
    var myHeaders = new Headers(paymentDetails);
    myHeaders.append("conte", "application/x-www-form-urlencoded");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://uat-proxy.aps.iq:5443/rest/register.do?userName=${process.env.USERNAME}&password=${process.env.PASSWORD}&orderNumber=${paymentDetails.orderNumber}&amount=${paymentDetails.amount}&currency=${paymentDetails.currency}&returnUrl=${paymentDetails.returnUrl}&failUrl=${paymentDetails.failUrl}&language=${paymentDetails.language}&description=${paymentDetails.description}&sessionTimeoutSecs=${paymentDetails.sessionTimeoutSecs}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        var transaction_response = JSON.parse(result);
      })
      .catch((error) => console.log("error", error));

    if (transaction_response.errorCode !== 0) {
      return console.error(transaction_response);
    }

    return {
      transaction_id: transaction_response.orderId,
      redirect_url: transaction_response.formUrl,
    };
  }

  static async verify(transactionId) {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    let response = "";

    fetch(
      `https://uat-proxy.aps.iq:5443/payment/rest/getOrderStatus.do?orderId=${transactionId}&language=en&password=${process.env.PASSWORD}&userName=${process.env.USERNAME}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        response = JSON.parse(result);
      })
      .catch((error) => console.log("error", error));

      if(response.ErrorCode !== 0){
          return console.error(response.ErrorCode, response);
      }

      return {
          status: true,
          order_id: response.OrderNumber
      }
  }
}

export default ArabPaymentGatway;
