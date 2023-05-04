const express = require('express')
var body = require("body-parser");

const app = express()

app.use(express.json())

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
// app.use(bodyParser.urlencoded({extended: true}));

const mejaController = require("../controllers/meja.controller");
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`)

app.get("/getAll", auth.authVerify, mejaController.getAllMeja)
// app.post("/getAvailable", menuController.availableRoom)
app.post("/find", auth.authVerify, mejaController.findMeja)
app.post("/", auth.authVerify, mejaController.addMeja)
app.delete("/:id", auth.authVerify, mejaController.deleteMeja)
app.put("/:id", auth.authVerify, mejaController.updateMeja)

module.exports=app