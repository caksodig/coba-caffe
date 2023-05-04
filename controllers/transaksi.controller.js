const transaksiModel = require(`../models/index`).transaksi;
const detailsOfTransaksiModel = require(`../models/index`).detail_transaksi;
const userModel = require(`../models/index`).user;
const mejaModel = require(`../models/index`).meja;

const Op = require(`sequelize`).Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("wikucafe", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//tambah data
exports.addTransaksi = async (request, response) => {
  let nomor_meja = request.body.nomor_meja;
  let meja = await mejaModel.findOne({
    where: {
      [Op.and]: [{ nomor_meja: { [Op.substring]: nomor_meja } }],
    },
    attributes: ["id", "nomor_meja", "createdAt", "updatedAt"],
  });

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  if (meja === null) {
    return response.json({
      success: false,
      message: `Menu yang anda inputkan tidak ada`,
    });
  } else if (userId === null) {
    return response.json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    let newData = {
      tgl_transaksi: request.body.tgl_transaksi,
      nama_pelanggan: request.body.nama_pelanggan,
      mejaId: meja.id,
      status: request.body.status,
      userId: userId.id,
    };
    console.log(newData);
    let mejaCheck = await sequelize.query(
      `SELECT * FROM detail_transaksis WHERE mejaId = ${meja.id}" ;`
    );

    if (mejaCheck[0].length === 0) {
      transaksiModel
        .create(newData)
        .then((result) => {
          let transaksiId = result.id;
          let detailsOfTransaksi = request.body.details_of_transaksi;

          for (let i = 0; i < detailsOfTransaksi.length; i++) {
            detailsOfTransaksi[i].transaksiId = transaksiId;
          }

          let newDetail = {
            id: transaksiId,
            menuId: menu.id,
            harga: detailsOfTransaksi[0].harga,
          };

          detailsOfTransaksiModel
            .create(newDetail)
            .then((result) => {
              return response.json({
                success: true,
                message: `New transaction has been inserted`,
              });
            })
            .catch((error) => {
              return response.json({
                success: false,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    } else {
      return response.json({
        success: false,
        message: `Meja yang anda pesan sudah di booking`,
      });
    }
  }
};

//update data
exports.updateTransaksi = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let room = await roomModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: ["id", "nomor_kamar", "tipeKamarId", "createdAt", "updatedAt"],
  });

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  let newData = {
    tgl_transaksi: request.body.tgl_transaksi,
    nama_pelanggan: request.body.nama_pelanggan,
    mejaId: meja.id,
    status: request.body.status,
    userId: userId.id,
  };

  let transaksiId = request.params.id;

  transaksiModel
    .update(newData, { where: { id: transaksiId } })
    .then(async (result) => {
      await detailsOfTransaksiModel.destroy({
        where: { id: transaksiId },
      });

      let detailsOfTransaksi = request.body.details_of_transaksi;

      for (let i = 0; i < detailsOfTransaksi.length; i++) {
        detailsOfTransaksi[i].id = transaksiId;
      }

      let newDetail = {
        id: transaksiId,
        mejaId: meja.id,
        harga: detailsOfTransaksi[0].harga,
      };

      detailsOfTransaksiModel
        .create(newDetail)
        .then((result) => {
          return response.json({
            success: true,
            message: ` transaction has been update`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//delete data
exports.deleteTransaksi = async (request, response) => {
  let transaksiId = request.params.id;

  detailsOfTransaksiModel
    .destroy({
      where: { id: transaksiId },
    })
    .then((result) => {
      transaksiModel
        .destroy({ where: { id: transaksiId } })
        .then((result) => {
          return response.json({
            success: true,
            message: `Transaction has been deleted`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//mendapatkan semua data
exports.getAllTransaksi = async (request, response) => {
  const result = await transaksiModel.findAll();

  response.json({
    success: true,
    data: result[0],
    message: `All Transaction have been loaded`,
  });
};

//mendapatkan salah satu data
exports.find = async (request, response) => {
  let status = request.body.status;

  const result = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ status_pemesanan: status }],
    },
  });

  return response.json({
    success: true,
    data: result,
    message: `Transaction have been loaded`,
  });
};
