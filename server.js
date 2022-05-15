const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const Abi = require('./config/abi.json');
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const mongoose = require("mongoose");
const passport = require("passport");
const Referral = require('./routes/api/referral');
const cors = require('cors');
const bodyParser = require("body-parser");

var connection_string = "**********";

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose.connect(
  db,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false  
  }
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

var web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
var tokenAddress = "0xf76e1b7ff23b462bf9f0562dcf7929c032c84ffb";
var myContract = new web3.eth.Contract(Abi, tokenAddress);
var gasLimitHex = web3.utils.toHex(90000);
// our server instance
const server = http.createServer(app);

const adminPrivateKey = "0x2e16e7f903f4ff5a1518c5549d7ccfa5235ea4555c7e75c56a71c2dae9811cde";
const adminPublicKey = "0x413EBD57EbA0f200ed592c31E7dB6119C92A7973";

// This creates our socket using the instance of the server
const io = socketIO(server);
var clients = [];
io.on("connection", socket => {

  console.log("New client connected " + socket.id);
  socket.on("set winner", async (betData)=>{
    console.log(betData.publicKey);
  
    var amount = betData.profit;    
    // transaction
    let data =await myContract.methods.transfer(betData.publicKey, web3.utils.toHex(web3.utils.toWei(amount.toString()))).encodeABI();

    // transection
    web3.eth.getTransactionCount(adminPublicKey).then(function (lastCountOfTransaction) {
      console.log(data);
      var txdetail = {
        "nonce":'0x' + lastCountOfTransaction.toString(16),
        "to": tokenAddress,
        "value": web3.utils.toHex(web3.utils.toWei("0")),
        "gas": gasLimitHex,
        "gasPrice": web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        "data":data
      }

      const privateKey1Buffer = new Buffer.from(adminPrivateKey.slice(2), 'hex')

      console.log("privateKey1Buffer : ", privateKey1Buffer);
      const transaction = new EthereumTx(txdetail);
      transaction.sign(privateKey1Buffer);
      const serializedTransaction = transaction.serialize();
    
      console.log("serializedTransaction : ", serializedTransaction);
      try {
        web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
          .on('receipt', (res) => { console.log("result : ", res); });
      }catch (e) {
        console.log("sendSignedTransaction error : ", e);
      }
    });
    io.sockets.emit('users_count', betData);  
  })

  socket.on("set loser",(betData)=>{
    console.log(betData);
    io.sockets.emit('users_count', betData);  
  })

  socket.on("set autoBet", async (betData)=>{
    var amount = betData.profit+betData.amount;
    
    // transaction
    let data =await myContract.methods.transfer(betData.publicKey, web3.utils.toHex(web3.utils.toWei(amount.toString()))).encodeABI();

    // transection
    web3.eth.getTransactionCount(adminPublicKey).then(function (lastCountOfTransaction) {
      console.log(data);
      var txdetail = {
        "nonce":'0x' + lastCountOfTransaction.toString(16),
        "to": tokenAddress,
        "value": web3.utils.toHex(web3.utils.toWei("0")),
        "gas": gasLimitHex,
        "gasPrice": web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        "data":data
      }

      const privateKey1Buffer = new Buffer.from(adminPrivateKey.slice(2), 'hex')

      console.log("privateKey1Buffer : ", privateKey1Buffer);
      const transaction = new EthereumTx(txdetail);
      transaction.sign(privateKey1Buffer);
      const serializedTransaction = transaction.serialize();
    
      console.log("serializedTransaction : ", serializedTransaction);
      try {
        web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
          .on('receipt', (res) => { console.log("result : ", res); });
      }
      catch (e) {
        console.log("sendSignedTransaction error : ", e);
      }
    });
    io.sockets.emit('users_count', betData);
  })

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use('/api/referral', Referral)

/* Below mentioned steps are performed to return the Frontend build of create-react-app from build folder of backend */

server.listen(port, () => console.log(`Listening on port ${port}`));
