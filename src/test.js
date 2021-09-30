const express = require('express');
import paymet from './index';
import zaincash from ''
// const zaincash = require('./index/zaincash');

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

// these data is for testing
const zaincashCredintail = {
    lang: "en",
    amount: "250",
    serviceType: "fin hackthon",
    orderId: "123",
    redirectUrl: "localhost:5000/redirectHome",
};

app.post('/pay', (req, res) => {
    const result = payment.init('zaincash', zaincashCredintail);
    return res.json(result);
})

// app.post('/pay', (req, res) => {
//     const result = zaincash.init(zaincashCredintail);
//     return res.json(result);
// })

app.get('/', (req, res) => {
    return res.send("Home Page");
})



app.listen(port, () => {
    console.log('server running on port', port);
})