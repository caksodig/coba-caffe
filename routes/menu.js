const express = require('express')
// var body = require("body-parser");

const app = express()

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({extended: true}));

const menuController = require("../controllers/menu.controller");
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`)

app.get("/getAll", auth.authVerify, menuController.getAllMenu)
app.post("/find", auth.authVerify, menuController.findMenu)
app.post("/", auth.authVerify, menuController.addMenu)
app.delete("/:id", auth.authVerify, menuController.deleteMenu)
app.put("/:id", auth.authVerify, menuController.updateMenu)

module.exports=app