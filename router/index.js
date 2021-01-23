const express = require("express");
const router = express.Router();

const IndexController = require("../controller/index");

router.route("/").get(IndexController.look);
router.route("/look").get(IndexController.look);
router.route("/allProducts").get(IndexController.allProducts);

router.route("/allBarcodeWithoutProducts").post(IndexController.allBarcodeWithoutProducts);
router.route("/addProduct").post(IndexController.addProduct);
router.route("/editProduct/:id").post(IndexController.editProduct);
router.route("/removeProduct/:id").post(IndexController.removeProduct);
router.route("/shortcutProduct/:id").post(IndexController.shortcutProduct);
router.route("/searchProductByBarcode").post(IndexController.searchProductByBarcode);
router.route("/searchProductByShortcut").post(IndexController.searchProductByShortcut);
router.route("/getQuantityTypes").post(IndexController.getQuantityTypes);

module.exports = router;