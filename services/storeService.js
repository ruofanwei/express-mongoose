const mongoDB = require("../models");
const { Store } = mongoDB;
const mongoose = require("mongoose");
const dateHelper = require("../lib/dateHelper");
const _ = require("lodash");
const moment = require("moment");
const MomentRange = require("moment-range");
const momentRange = MomentRange.extendMoment(moment);


module.exports = {
  getStoreInfo,
  findSettingByType,
  findConfigBySlug,
  updateSettingByType,
  checkDayOffByPeriod,
  createStoreDayOff,
  getDayOff,
  getDayOffByPeriod,
  getStoreDayOffById,
  updateStoreDayOff,
  deleteStoreDayOff,
  getServiceTime,
  getActiveStoreListByCompanyUuid,
  getInActiveStoreListByCompanyUuid,
  getStoreDetailByStoreId,
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
        announcement: "$info.announcement",
        color: "$info.color",
        liffId: "$lineOa.liffId",
        serviceTime: "$serviceTime",
      },
    },
  ]);
  return result;
}

/**
 * 以 storeUuid, typeName 取得店家設定
 * @header {String} storeUuid
 * @query {String} settingType
 */
async function findSettingByType(typeName, storeUuid) {
  let result;
  const ObjectId = mongoose.Types.ObjectId;
  switch (typeName) {
    case "storeSetting":
      [result] = await Store.aggregate([
        { $match: { uuid: ObjectId(storeUuid) } },
        {
          $project: {
            _id: 0,
            storeInfo: {
              name: "$info.name",
              phone: "$info.phone",
              address: "$info.address",
              manager: "$info.manager",
              servicePhone: "$info.servicePhone",
            },
            serviceTime: "$serviceTime",
          },
        },
      ]);
      break;
    case "bookingSetting":
      [result] = await Store.aggregate([
        { $match: { uuid: ObjectId(storeUuid) } },
        {
          $project: {
            _id: 0,
            daysBookable: "$bookingSetting.daysBookable",
            maxBookingCount: "$bookingSetting.maxBookingCount",
            isBookingRepeatable: "$bookingSetting.isBookingRepeatable",
            isBookingCancelable: "$bookingSetting.isBookingCancelable",
            isBookingEditable: "$bookingSetting.isBookingEditable",
          },
        },
      ]);
      break;
    case "notifySetting":
      [result] = await Store.aggregate([
        { $match: { uuid: ObjectId(storeUuid) } },
        {
          $project: {
            _id: 0,
            update: "$notifySetting.update",
            cancel: "$notifySetting.cancel",
            process: "$notifySetting.process",
          },
        },
      ]);
      break;
    case "qaSetting":
      [result] = await Store.aggregate([
        { $match: { uuid: ObjectId(storeUuid) } },
        {
          $project: {
            _id: 0,
            qa: "$questionsAnswers",
          },
        },
      ]);
      result = result.qa;
      break;
  }

  return result;
}

/**
 * 以 SLUG 取得店家設定檔
 * @param {String} slug 店家SLUG
 * @return {Object}
 */
async function findConfigBySlug(slug) {
  const [result] = await Store.aggregate([
    { $match: { slug: slug } },
    {
      $project: {
        _id: 0,
        uuid: "$uuid",
        name: "$info.name",
        servicePhone: "$info.servicePhone",
        address: "$info.address",
        announcement: "$info.announcement",
        color: "$info.color",
        liffId: "$lineOa.liffId",
        serviceTime: "$serviceTime",
      },
    },
  ]);
  return result;
}

/**
 * 以 storeUuid, typeName 編輯店家設定
 * @header {String} storeUuid
 * @param {String} typeName
 * @body
 */
async function updateSettingByType(typeName, body, storeUuid) {
  let result;
  let serviceTime = {};

  switch (typeName) {
    case "storeSetting":
      _.forEach(dateHelper.weekdays, function (weekDay) {
        serviceTime[weekDay] = {
          open: body.serviceTime[weekDay].open,
          times: body.serviceTime[weekDay].times,
        };
      });

      result = await Store.findOneAndUpdate(
        storeUuid,
        {
          info: {
            name: body.storeInfo.name,
            phone: body.storeInfo.phone,
            address: body.storeInfo.address,
            manager: body.storeInfo.manager,
            servicePhone: body.storeInfo.servicePhone,
          },
          serviceTime: serviceTime,
        },
        { new: true }
      );
      break;
    case "bookingSetting":
      result = await Store.findOneAndUpdate(
        storeUuid,
        {
          bookingSetting: {
            daysBookable: body.daysBookable,
            maxBookingCount: body.maxBookingCount,
            isBookingRepeatable: body.isBookingRepeatable,
            isBookingCancelable: body.isBookingCancelable,
            isBookingEditable: body.isBookingEditable,
          },
        },
        { new: true }
      );
      break;
    case "notifySetting":
      result = await Store.findOneAndUpdate(
        storeUuid,
        {
          notifySetting: {
            update: body.update,
            cancel: body.cancel,
            process: body.process,
          },
        },
        { new: true }
      );
      break;
    case "qaSetting":
      result = await Store.findOneAndUpdate(
        storeUuid,
        {
          questionsAnswers: body,
        },
        { new: true }
      );
      break;
  }

  return result;
}

/**
 * 檢查店休是否重疊
 * @param {String} storeId 店家uuid
 * @param {String} startDate 開始時間
 * @param {String} endDate 結束時間
 * @return {Boolean}
 */
async function checkDayOffByPeriod(storeUuid, startDate, endDate) {
  const dayOffArray = await getDayOff(storeUuid);
  let isOverlaps = false;

  _.forEach(dayOffArray, function (data) {
    const existDayOffRange = momentRange.range(data.startDate, data.endDate);
    const newDayOffRange = momentRange.range(startDate, endDate);
    // Check if two ranges are overlap
    if (existDayOffRange.overlaps(newDayOffRange)) {
      isOverlaps = true;
    }
  });

  return isOverlaps;
}

/**
 * 取得店休
 * @param {Integer} storeUuid 店家uuid
 * @return {Array}
 */
async function getDayOff(storeUuid) {
  const ObjectId = mongoose.Types.ObjectId;
  const [result] = await Store.aggregate([
    { $match: { uuid: ObjectId(storeUuid) } },
    {
      $project: {
        _id: 0,
        dayOffs: "$dayOffs",
      },
    },
  ]);

  return result.dayOffs;
}

/**
 * 依日期區間取得店休
 * @param {Integer} storeId 店家uuid
 * @param {String} startDate 開始時間
 * @param {String} endDate 結束時間
 * @param {Integer} dayOffId 店休ID
 * @return {Array}
 */
async function getDayOffByPeriod(storeUuid, startDate, endDate) {
  const dayOffArray = await getDayOff(storeUuid);

  let dayOffs = [];
  _.forEach(dayOffArray, function (data) {
    const existDayOffRange = momentRange.range(data.startDate, data.endDate);
    const newDayOffRange = momentRange.range(startDate, endDate);
    let newDayOffArray = Array.from(newDayOffRange.by("days"));
    // Check request dayOff is exist
    if (existDayOffRange.overlaps(newDayOffRange)) {
      newDayOffArray.map((date) => {
        dayOffs.push({
          fDate: date.format("YYYY-MM-DD"),
          description: data.description,
        });
      });
    }
  });
  return dayOffs;
}

/**
 * 新增店休
 * @header {String} storeId 店家uuid
 * @param {String} startDate 開始時間
 * @param {String} endDate 結束時間
 * @param {String} description 店休描述
 * @return {Array}
 */
async function createStoreDayOff(storeUuid, startDate, endDate, description) {
  const existDayOffArray = await getDayOff(storeUuid);

  let dayOffId = _.maxBy(existDayOffArray, function (o) {
    return o.id;
  });

  if (!dayOffId) {
    dayOffId = {
      id: 0,
    };
  }

  const newDayOff = {
    id: dayOffId.id + 1,
    startDate,
    endDate,
    description,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  let concatArray = [newDayOff].concat(existDayOffArray);

  const response = await Store.findOneAndUpdate(
    storeUuid,
    {
      dayOffs: concatArray,
    },
    { new: true, upsert: true }
  );
  return response;
}

/**
 * 取得店休BY ID
 * @param {Integer} storeId 店家uuid
 * @param {Integer} storeDayOffId 店休ID
 * @return {Object}
 */
async function getStoreDayOffById(storeUuid, storeDayOffId) {
  const dayOffArray = await getDayOff(storeUuid);
  return _.find(dayOffArray, { id: parseInt(storeDayOffId) });
}

/**
 * 更新店休
 * @param {Integer} storeId 店家uuid
 * @param {Integer} storeDayOffId 店休ID
 * @param {String} startDate 開始時間
 * @param {String} endDate 結束時間
 * @param {String} description 店休描述
 * @return {Array}
 */
async function updateStoreDayOff(
  storeUuid,
  storeDayOffId,
  startDate,
  endDate,
  description
) {
  const dayOffArray = await getDayOff(storeUuid);
  const dayOffIndex = _.findIndex(dayOffArray, { id: parseInt(storeDayOffId) });

  const newDayOffObj = {
    id: dayOffArray[dayOffIndex].id,
    startDate,
    endDate,
    description,
    createdAt: dayOffArray[dayOffIndex].createdAt,
  };

  dayOffArray[dayOffIndex] = newDayOffObj;

  const response = await Store.findOneAndUpdate(
    storeUuid,
    {
      dayOffs: dayOffArray,
    },
    { new: true, upsert: true }
  );
  return response;
}

/**
 * 刪除店休
 * @param {Integer} storeId 店家ID
 * @param {Integer} storeDayOffId 店休ID
 */
async function deleteStoreDayOff(storeUuid, storeDayOffId) {
  const dayOffArray = await getDayOff(storeUuid);
  _.remove(dayOffArray, function (dayOff) {
    return dayOff.id == parseInt(storeDayOffId);
  });
  await Store.findOneAndUpdate(
    storeUuid,
    {
      dayOffs: dayOffArray,
    },
    { new: true, upsert: true }
  );
}

/**
 * 取得營業時間
 * @param {Integer} storeId 店家uuid
 * @return {Object}
 */
async function getServiceTime(storeUuid) {
  const result = await Store.findOne({ uuid: storeUuid })
    .select("serviceTime")
    .exec();

  return result.serviceTime;
}

/**
 * 以 COMPANY UUID 取得店家清單
 * @query {Integer} offset 店家UUID
 * @query {Integer} limit 店家UUID
 * @header {String} uuid 品牌UUID
 * @return {Object}
 */
async function getActiveStoreListByCompanyUuid(limit, offset, companyuuid) {
  const ObjectId = mongoose.Types.ObjectId;

  const activeStoreArray = await Store.aggregate([
    { $match: { company: ObjectId(companyuuid), isActive: true } },
    {
      $lookup: {
        from: "smspoints",
        localField: "smsPoint",
        foreignField: "_id",
        as: "smsPoint",
      },
    },
    { $unwind: "$smsPoint" },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        storeUuid: { $toString: "$uuid" },
        storeName: "$info.name",
        storeSlug: "$info.servicePhone",
        point: "$smsPoint.remainPoint",
      },
    },
    { $skip: offset },
    { $limit: limit },
  ]);

  const [count] = await Store.aggregate([
    { $match: { company: ObjectId(companyuuid), isActive: true } },
    { $count: "total" },
  ]);
  console.log(count);
  let result = {
    row: activeStoreArray,
    count: count ? count.total : 0,
  };

  return result;
}

/**
 * 以 COMPANY UUID 取得店家清單
 * @query {Integer} offset 店家UUID
 * @query {Integer} limit 店家UUID
 * @header {String} uuid 品牌UUID
 * @return {Object}
 */
async function getInActiveStoreListByCompanyUuid(limit, offset, companyuuid) {
  const ObjectId = mongoose.Types.ObjectId;

  const inactiveStoreArray = await Store.aggregate([
    { $match: { company: ObjectId(companyuuid), isActive: false } },
    {
      $lookup: {
        from: "smspoints",
        localField: "smsPoint",
        foreignField: "_id",
        as: "smsPoint",
      },
    },
    { $unwind: "$smsPoint" },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        storeUuid: { $toString: "$uuid" },
        storeName: "$info.name",
        storeSlug: "$info.servicePhone",
        point: "$smsPoint.remainPoint",
      },
    },
    { $skip: offset },
    { $limit: limit },
  ]);

  const [count] = await Store.aggregate([
    { $match: { company: ObjectId(companyuuid), isActive: false } },
    { $count: "total" },
  ]);

  let result = {
    row: inactiveStoreArray,
    count: count ? count.total : 0,
  };

  return result;
}

/**
 * 以 store id, companyId 取得店家詳細資料
 * @query {Integer} id 店家 ID
 * @header {String} header 品牌UUID
 * @return {Object}
 */
async function getStoreDetailByStoreId(id, companyuuid) {
  const ObjectId = mongoose.Types.ObjectId;

  const [result] = await Store.aggregate([
    { $match: { company: ObjectId(companyuuid), _id: ObjectId(id) } },
    {
      $lookup: {
        from: "smspoints",
        localField: "smsPoint",
        foreignField: "_id",
        as: "smsPoint",
      },
    },
    { $unwind: "$smsPoint" },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $lookup: {
        from: "storeuserroles",
        localField: "storeUserRole",
        foreignField: "_id",
        as: "storeUserRole",
      },
    },
    { $unwind: "$storeUserRole" },
    {
      $lookup: {
        from: "users",
        localField: "storeUserRole.user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        storeUuid: { $toString: "$uuid" },
        name: "$info.name",
        storeSlug: "$info.servicePhone",
        point: "$smsPoint.remainPoint",
        warningPoint: "$smsPoint.warningPoint",
        liffId: "$lineOa.liffId",
        manager: "$info.manager",
        servicePhone: "$info.servicePhone",
        channelToken: "$lineOa.channelToken",
        channelSecret: "$lineOa.channelSecret",
        address: "$info.address",
        phone: "$info.phone",
        account: "$user.email",
      },
    },
  ]);

  return result;
}
