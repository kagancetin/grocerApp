const Product = require("../model/product");
const Transactions = require("../model/transactions");
const DateConverter = require("../helpers/dateConverter");

module.exports = {
  sellPage: async (req, res, next) => {
    let products = await Product.find({});
    res.render("pages/transactions/sellPage", {
      products: products.map((part) => part.toJSON()),
    });
  },

  buyPage: async (req, res, next) => {
    res.render("pages/transactions/buyPage");
  },
  transactionReportPage: async (req, res, next) => {
    let products = await Product.find({});
    res.render("pages/transactions/transactionReport", {
      products: products.map((part) => part.toJSON()),
    });
  },

  addSales: async (req, res, next) => {
    let data = req.body;
    data.date = new Date();

    const addData = new Transactions(data);
    addData.save((err, doc) => {
      if (err) {
        console.log(err);
        res.send(false);
      } else {
        res.send(doc);
      }
    });
  },

  getAllSales: async (req, res, next) => {
    if (req.body.allSalesTimeRange) {
      let allSalesTimeRange = req.body.allSalesTimeRange.split("-");
      let startTime = DateConverter.convertForDB(
        allSalesTimeRange[0].replace(/\s/g, "")
      );
      let endTime = DateConverter.convertForDB(
        allSalesTimeRange[1].replace(/\s/g, "")
      );

      let allSales = await Transactions.find({
        date: {
          $gte: startTime,
          $lt: endTime,
        },
      })
        .sort({ date: "descending" })
        .populate("salesList.product");
      res.send({ allSales: allSales, startTime: startTime, endTime: endTime });
    } else {
      let allSales = await Transactions.find({})
        .sort({ date: "descending" })
        .populate("salesList.product");
      res.send({ allSales: allSales, startTime: false, endTime: false });
    }
  },
  getProductSalesReport: async (req, res, next) => {
    if (req.body.productTimeRange) {
      let productTimeRange = req.body.productTimeRange.split("-");
      let startTime = DateConverter.convertForDB(
        productTimeRange[0].replace(/\s/g, "")
      );
      let endTime = DateConverter.convertForDB(
        productTimeRange[1].replace(/\s/g, "")
      );

      let allSales = await Transactions.find({
        date: {
          $gte: startTime,
          $lt: endTime,
        },
        salesList: {
          $elemMatch: {
            product: { $in: req.body.productId },
          },
        },
      })
        .sort({ date: "descending" })
        .populate("salesList.product")
        .select({
          sumPrice: 1,
          saleslist: 1,
          date: 1,
          salesList: {
            $elemMatch: {
              product: req.body.productId,
            },
          },
        });
      res.send({ allSales: allSales, startTime: startTime, endTime: endTime });
    } else {
      let allSales = await Transactions.find({
        salesList: {
          $elemMatch: {
            product: req.body.productId,
          },
        },
      })
        .sort({ date: "descending" })
        .populate("salesList.product")
        .select({
          sumPrice: 1,
          saleslist: 1,
          date: 1,
          salesList: {
            $elemMatch: {
              product: req.body.productId,
            },
          },
        });
      res.send({ allSales: allSales, startTime: false, endTime: false });
    }
  },

  getSalesBySalesId: async (req, res, next) => {
    let salesId = req.body.id;
    let sales = await Transactions.findById(salesId).populate(
      "salesList.product"
    );
    res.send(sales);
  },

  removeSales: async (req, res, next) => {
    let salesId = req.body.id;
    let sales = await Transactions.findByIdAndRemove(salesId, (err, doc) => {
      if (err) {
        res.send(false);
      }
      res.send(doc);
    });
  },
};
