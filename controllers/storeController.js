const mongoDB = require("../mongoModels");
const mongoose = require("mongoose");
const { Store, Company, Role, User, StoreUserRole, SmsPoint, SmsPointOrder } =
  mongoDB;
const {
  features,
  colors,
  notifySetting,
  serviceTime,
  qa,
} = require("../lib/features");
const storeService = require("../mongoServices/storeService");

const mongoStoreController = {
  getStore: async (req, res, next) => {
    try {
      const storeUuid = req.headers.store;
      const result = await storeService.getStoreInfo(storeUuid);
      return res.status(200).json({
        data: result,
        code: 200,
        message: "執行成功",
      });
    } catch (e) {
      next(e);
    }
  },
  listRoleWithUser: async (req, res, next) => {
    try {
      const storeId = req.storePayload.id;
      const roles = await userService.getRoleWithUserByStoreId(storeId);
      return res.status(200).json({
        data: roles,
        code: 200,
        message: "執行完成",
      });
    } catch (e) {
      next(e);
    }
  },
  listUser: async (req, res, next) => {
    try {
      const storeId = req.storePayload.id;

      const userList = await userService.getUserByType(storeId);

      return res.status(200).json({
        data: userList,
        code: 200,
        message: "執行完成",
      });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = mongoStoreController;
