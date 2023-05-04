const express = require('express')
// var body = require("body-parser");

const app = express()

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({extended: true}));

const transaksiController = require("../controllers/transaksi.controller")
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`)

app.get("/getAll", auth.authVerify, transaksiController.getAllTransaksi)
app.get("/find", auth.authVerify, transaksiController.find)
app.post("/", auth.authVerify, transaksiController.addTransaksi)
app.delete("/:id", auth.authVerify, transaksiController.deleteTransaksi)
app.put("/:id", auth.authVerify, transaksiController.updateTransaksi)

module.exports=app