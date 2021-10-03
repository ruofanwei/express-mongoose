const express = require("express");
const router = express.Router();
const mongoStoreController = require("../controllers/storeController");

router.get(
  "/mongo/store",
  mongoStoreController.getStore
);
router.get(
  "/mongo/roles",
  mongoUserController.listRoleWithUser
);

router.get("/mongo/users",  mongoUserController.listUser);
module.exports = router;