const mongoDB = require("../models");
const { Store } = mongoDB;
const mongoose = require("mongoose");



module.exports = {
  getStoreInfo,
  getRoleWithUserByStoreId,
  getUserByType,
};


/**
 * 以 storeUuid 取得店家基本資料
 * @header {String} storeUuid
 */
async function getStoreInfo(storeUuid) {
  const ObjectId = mongoose.Types.ObjectId;
  const [result] = await Store.aggregate([
    { $match: { uuid: ObjectId(storeUuid) } },
    {
      $project: {
        _id: 0,
        uuid: "$uuid",
        name: "$info.name",
        servicePhone: "$info.servicePhone",
        address: "$info.address",
      },
    },
  ]);
  return result;
}

/**
 * 取得角色列表並附帶所屬服務人員
 * @param {Integer} storeId 店家ID
 * @return {Array}
 */
async function getRoleWithUserByStoreId(storeId) {
  const ObjectId = mongoose.Types.ObjectId;
  const result = await Role.aggregate([
    { $match: { store: ObjectId(storeId) } },
    {
      $lookup: {
        from: "storeuserroles",
        pipeline: [
          {
            $lookup: {
              from: "users", // Collection name
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              _id: 0,
              id: { $toString: "$user._id" },
              uuid: { $toString: "$user.uuid" },
              name: "$user.name",
              email: "$user.email",
              phone: "$user.phone",
              photoUrl: "$user.photoUrl",
              intro: "$user.intro",
            },
          },
        ],
        as: "users",
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: "$name",
        users: "$users",
      },
    },
  ]);

  return result;
}

/**
 * 依店家 ID & userType 取得使用者列表
 * @param {Integer} storeId 店家ID
 * @param {String} userType user or staff
 * @return {Array}
 */
async function getUserByType(storeId, userType = null) {
  const ObjectId = mongoose.Types.ObjectId;
  const result = await StoreUserRole.aggregate([
    { $match: { store: ObjectId(storeId) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $project: {
        _id: 0,
        uuid: { $toString: "$user.uuid" },
        name: "$user.name",
        email: "$user.email",
        phone: "$user.phone",
        photoUrl: "$user.photoUrl",
        intro: "$user.intro",
        role: {
          id: 0,
          id: { $toString: "$role._id" },
          name: "$role.name",
          isSuperAdmin: {
            $cond: [
              { $eq: [userType, null] },
              "$role.isSuperAdmin",
              "$$REMOVE",
            ],
          },
        },
      },
    },
  ]);
  return result;
}
