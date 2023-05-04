const { request, response } = require("express");
const express = require("express");
const app = express();

const tipeModel = require(`../models/index`).menu;
const Op = require(`sequelize`).Op;

const path = require(`path`);
const fs = require(`fs`);

const upload = require(`./uploadMenu`).single(`gambar`);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAllMenu = async (request, response) => {
  let tipe = await tipeModel.findAll();
  return response.json({
    success: true,
    data: tipe,
    message: `All menu have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findMenu = async (request, response) => {
  let keyword = request.body.keyword;
  let tipe = await tipeModel.findOne({
    where: {
      [Op.or]: [
        { nama_menu: { [Op.substring]: keyword } },
        { jenis: { [Op.substring]: keyword } },
        { deskripsi: { [Op.substring]: keyword } },
        { harga: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: tipe,
    message: `All menu have been loaded`,
  });
};

//menambah data
exports.addMenu = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to upload` });
    }

    let newMenu = {
      nama_menu: request.body.nama_menu,
      jenis: request.body.jenis,
      deskripsi: request.body.deskripsi,
      gambar: request.file.filename,
      harga: request.body.harga,
    };

    console.log(newMenu);

    tipeModel
      .create(newMenu)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Menu has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengupdate salah satu data
exports.updateMenu = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let idType = request.params.id;

    let dataType = {
      nama_menu: request.body.nama_menu,
      jenis: request.body.jenis,
      deskripsi: request.body.deskripsi,
      gambar: request.file.filename,
      harga: request.body.harga,
    };

    if (request.file) {
      const selectedUser = await tipeModel.findOne({
        where: { id: idType },
      });

      const oldFotoUser = selectedUser.gambar;
      const patchFoto = path.join(__dirname, `../gambar`, oldFotoUser);

      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }
      dataType.gambar = request.file.filename;
    }

    tipeModel
      .update(dataType, { where: { id: idType } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data menu has been update`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengahapus salah satu data
exports.deleteMenu = (request, response) => {
  let idType = request.params.id;

  tipeModel
    .destroy({ where: { id: idType } })
    .then((result) => {
      return response.json({
        success: true,
        message: `data menu has ben delete`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
