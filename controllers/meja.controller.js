const { request, response } = require("express");
const express = require("express");
const app = express();

const tipeModel = require(`../models/index`).meja;
const Op = require(`sequelize`).Op;

const path = require(`path`);
const fs = require(`fs`);

const upload = require(`./uploadMenu`).single(`foto`);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAllMeja = async (request, response) => {
  let tipe = await tipeModel.findAll();
  return response.json({
    success: true,
    data: tipe,
    message: `All tables have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findMeja = async (request, response) => {
  let nomor_meja = request.body.nomor_meja;

  let tipe = await tipeModel.findOne({
    where: {
      [Op.and]: [{ nomor_meja: { [Op.substring]: nomor_meja } }],
    },
  });
  return response.json({
    success: true,
    data: tipe,
    message: `All Tables have been loaded`,
  });
};

//menambah data
exports.addMeja = async (request, response) => {
  let newMeja = {
    nomor_meja: request.body.nomor_meja,
  };
  tipeModel.create(newMeja).then((result) => {
    try {
      return response.json({
        success: true,
        data: result,
        message: `New room has been inserted`,
      });
    } catch (err) {
      return response.json({
        success: false,
        message: error.message,
      });
    }
  });
};

//mengupdate salah satu data
exports.updateMeja = async (request, response) => {
  let dataMeja = {
    nomor_meja: request.body.nomor_meja,
  };
  let id = request.params.id;
  tipeModel
    .update(dataMeja, { where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data tables has been updated`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//mengahapus salah satu data
exports.deleteMeja = (request, response) => {
  let idMeja = request.params.id;

  tipeModel
    .destroy({ where: { id: idMeja } })
    .then((result) => {
      return response.json({
        success: true,
        message: `data tables has ben delete`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.availableTable = async (request, response) => {
  const tgl_akses = request.body.tgl_akses;

  const result = await sequelize.query(
    `SELECT mejas.nomor_meja FROM mejas LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl_akses}')`
  );

  return response.json({
    success: true,
    sisa_kamar: result[0].length,
    data: result[0],
    message: `Available tables have been loaded`,
  });
};