const express = require("express");
const router = express.Router();

const TransactionsController = require("../controller/transactions");

router.route("/sell").get(TransactionsController.sellPage);
router.route("/buy").get(TransactionsController.buyPage);
router
  .route("/transactionReport")
  .get(TransactionsController.transactionReportPage);

router.route("/addSales").post(TransactionsController.addSales);
router
  .route("/getSalesBySalesId")
  .post(TransactionsController.getSalesBySalesId);
router.route("/getAllSales").post(TransactionsController.getAllSales);
router
  .route("/getProductSalesReport")
  .post(TransactionsController.getProductSalesReport);

router.route("/removeSales").post(TransactionsController.removeSales);

module.exports = router;
