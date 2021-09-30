const fetch = require("node-fetch");
require("dotenv").config();

// prameters example for me
const paymentDetails = {
  profile_id: "79867",
  tran_type: "Sale",
  tran_class: "ecom",
  cart_description: "Description of the items services",
  cart_id: "123",
  cart_currency: "IQD",
  cart_amount: "500",
  callback: "https://yourdomain.com/yourcallback",
  return: "https://yourdomain.com/yourpage",
};

class Paytab {
  static async init(paymentDetails) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", process.env.PAYTAB_SERVER_KEY);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(paymentDetails),
      redirect: "follow",
    };

    let url = '';
    let transaction_id;

    fetch("https://secure-iraq.paytabs.com/payment/request", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        url = result.redirect_url;
        transaction_id = result.tran_ref;
      })
      .catch((error) => console.log("error", error));

      return {
          url,
          transaction_id
      }
  }
}

export default Paytab;
