/*
 * The index file that will be called to creat a payment request
 * @Author Hamdon
  */

//  Dependencies
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const request = require('request');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

//  Middleware to get the json from the request
app.use(express.json());

//  If the environment if it was on production or on testing mode
let initUrl = 'https://test.zaincash.iq/transaction/init';
let requestUrl = 'https://test.zaincash.iq/transaction/pay?id=';

if(process.env.PRODUCTION === "true"){
  initUrl = 'https://api.zaincash.iq/transaction/init';
  requestUrl = 'https://api.zaincash.iq/transaction/pay?id=';
}

//  Set the serviceType (Any text you like such as your website name)
const serviceType = "Hamdon Website";

//after a successful or failed order, the user will redirect to this url
const redirectUrl = 'http://localhost:5000/';

/* ------------------------------------------------------------------------------
Notes about redirectionUrl:
in this url, the api will add a new parameter (token) to its end like:
https://example.com/redirect?token=XXXXXXXXXXXXXX
------------------------------------------------------------------------------  */


//  Handeling the payment request
app.post('/pay', (req, res) => {
  //  Set the amount to 250 if there is no amount in the request (For testing)
  //  it has to be more that 250 IQD
  const amount = 25000;

  //  Set an order id (This is usualy should be the order id in your sys DB)
  const orderId = "YOUR-ORDER-ID-FROM-YOUR-DB";

  //  Set the token expire time
  const time = Date.now();

  //  Building the transaction data to be encoded in a JWT token
  const data = {
    'amount': amount,
    'serviceType': serviceType,
    'msisdn': process.env.MSISDN,
    'orderId': orderId,
    'redirectUrl': redirectUrl,
    'iat': time,
    'exp': time + 60 * 60 * 4
  };

  //  Encoding the datd
  const token = jwt.sign(data, process.env.TOKEN_SECRET_KEY);

  //  Preparing the payment data to be sent to ZC api
  const postData = {
    'token': token,
    'merchantId': process.env.MERCHANTID,
    'lang': process.env.LANG
  };

  console.log(postData);

  //  Request Option
  const requestOptions = {
    uri: initUrl,
    body: JSON.stringify(postData),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //  Initilizing a ZC order by sending a request with the tokens
  request(requestOptions, function (error, response) {
    //  Getting the operation id
      const OperationId = JSON.parse(response.body).id;
      console.log(JSON.parse(response.body));
    //  Redirect the user to ZC payment Page
       return res.json( {
        'url': requestUrl + OperationId
      });
  });
});


//  Handeling the redierct
app.get('redirect', (req, res) => {
  const token = req.body.token;
  if(token){
    try {
      var decoded = jwt.verify(token, process.env.SECRET);
    } catch(err) {
      // err
    }
    if(decoded.status == 'success'){
      // Do whatever you like
    }else {
      //  Do other things
    }
  }
});



// Starting the server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});