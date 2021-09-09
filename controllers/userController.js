"use strict";
const userController = {
    listStaff: async (req, res, next) => {
        try {
          return res.status(200).json({
            data: storeUsers,
            code: 200,
            message: "執行完成",
          });
        } catch (e) {
          next(e);
        }
    },
}
module.exports = userController;