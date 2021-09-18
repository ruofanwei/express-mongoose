const express = require("express");
const router = express.Router();
const mongoStoreController = require("../controllers/storeController");

const {
  createStoreValidationRules,
  updateStoreValidationRules,
  validate,
} = require("../middlewares/userValidationRules.js");

router.post(
  "/mongo/store",
  createStoreValidationRules(),
  validate,
  mongoStoreController.createStore
);
router.put(
  "/mongo/store",
  updateStoreValidationRules(),
  validate,
  mongoStoreController.updateStore
);
router.get("/mongo/storeList", mongoStoreController.getStoreList);
router.get("/mongo/storeDetail", mongoStoreController.getStoreDetail);

module.exports = router;