const mongoDB = require("../models");
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
const {
  getActiveStoreListByCompanyUuid,
  getInActiveStoreListByCompanyUuid,
  getStoreDetailByStoreId,
} = require("../services/storeService");

const mongoStoreController = {
  createStore: async (req, res, next) => {
    const companyName = req.body.companyName; // option
    const companyUuid = req.headers.companyuuid; // option

    const storeName = req.body.storeName; // 店家名稱
    const storeSlug = req.body.storeSlug; // 店家slug
    const account = req.body.account; // 通知信箱 admin 帳號
    //const password = req.body.password // 密碼
    const contactPhone = req.body.contactPhone; // 通知手機
    const address = req.body.address; // 店家地址
    const contactPerson = req.body.contactPerson; // 聯絡人
    const customerServicePhone = req.body.customerServicePhone; // 店家電話(客服電話

    const liffId = req.body.liffId;
    const smsWarningPoint = 50; // 簡訊儲值點數下限，初次儲值最低100
    const point = req.body.point; // 初次儲值點數
    const lineAccessToken = req.body.lineAccessToken;
    const lineChannelSecret = req.body.lineChannelSecret;
    const name = req.body.name; // 贈點人員姓名
    const email = req.body.email; // 贈點人員信箱

    let session;
    let isMainStore;
    let companyData;
    session = await mongoose.startSession();
    try {
      session.startTransaction();

      // find the company which store belongs to
      // if no company exist, create it !
      if (companyUuid) {
        const response = await Company.findOne({
          uuid: companyUuid,
        })
          .session(session)
          .exec();
        isMainStore = "0";
        companyData = response;
      } else {
        const [response] = await Company.create(
          [
            {
              name: companyName,
            },
          ],
          { session }
        );

        isMainStore = "1";
        companyData = [response];
      }

      const [store] = await Store.create(
        [
          {
            slug: storeSlug,
            mainStore: isMainStore,
            company: companyData._id,
            info: {
              name: storeName,
              phone: contactPhone,
              address: address,
              manager: contactPerson,
              servicePhone: customerServicePhone,
              color: colors,
              announcement: "防疫期間，須全程帶口罩",
            },
            lineOa: {
              liffId: liffId,
              channelSecret: lineChannelSecret,
              channelToken: lineAccessToken,
            },
            serviceTime: serviceTime,
            notifySetting: notifySetting,
            questionsAnswers: qa,
            bookingSetting: {
              daysBookable: 5,
              maxBookingCount: 1,
              isBookingRepeatable: 1,
              isBookingCancelable: 1,
              isBookingEditable: 1,
            },
          },
        ],
        { session }
      );

      await Company.findByIdAndUpdate(
        companyData._id,
        {
          $push: { stores: store._id },
        },
        { new: true, session: session }
      );

      const [role] = await Role.create(
        [
          {
            store: store._id,
            name: "管理員",
            isSuperAdmin: true,
            features: features,
            isRoster: true,
          },
        ],
        { session }
      );

      // create admin user
      const [adminUser] = await User.create(
        [
          {
            name: contactPerson,
            email: account,
            phone: contactPhone,
          },
        ],
        { session }
      );

      // create store user role
      const [storeUserRole] = await StoreUserRole.create(
        [
          {
            store: store._id,
            user: adminUser._id,
            role: role._id,
          },
        ],
        { session }
      );

      await Role.findByIdAndUpdate(
        role._id,
        {
          $push: { storeUserRoles: storeUserRole._id },
        },
        { new: true, session: session }
      );

      const [smsPointData] = await SmsPoint.create(
        [
          {
            store: store._id, // 店家ID
            remainPoint: point,
            warningPoint: smsWarningPoint, // 低水位點數額度
          },
        ],
        { session }
      );

      // 手動加點 同時紀錄到 sms point order
      const [smsPointOrderData] = await SmsPointOrder.create(
        [
          {
            name: name, // 贈點人員姓名
            email: email, // 贈點人員信箱
            store: store._id,
            user: adminUser._id,
            type: "2", // 1 : 儲值 , 2 : 贈點
            smsPoint: smsPointData._id,
            orderPoint: point,
            amount: point,
            status: "success",
          },
        ],
        { session }
      );

      await User.findByIdAndUpdate(
        adminUser._id,
        {
          storeUserRole: storeUserRole._id,
          smsPointOrders: smsPointOrderData._id,
        },
        { new: true, session: session }
      );

      await Store.findByIdAndUpdate(
        store._id,
        {
          smsPointOrders: smsPointOrderData._id,
          smsPoint: smsPointData._id,
          storeUserRole: storeUserRole._id,
        },
        { new: true, session: session }
      );

      // Once the transaction is committed, the write operation becomes
      // visible outside of the transaction.
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        code: 200,
        message: "執行成功",
      });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      next(e);
    }
  },
  updateStore: async (req, res, next) => {
    let session;
    session = await mongoose.startSession();
    try {
      session.startTransaction();
      const adminAccount = req.body.account; // 通知信箱 admin 帳號(低水位通知信箱)
      //const adminPassword = req.body.password // 密碼
      const manager = req.body.contactPerson; // 聯絡人
      const phone = req.body.contactPhone; // 通知手機(低水位通知手機)
      const name = req.body.storeName; // 店家名稱
      const address = req.body.address; // 店家地址
      const servicePhone = req.body.customerServicePhone; // 店家電話(客服電話
      const liffId = req.body.liffId;
      const channelToken = req.body.lineAccessToken;
      const channelSecret = req.body.lineChannelSecret;
      const smsWarningPoint = req.body.smsWarningPoint; // 簡訊儲值點數下限(低水位點數額度)
      const storeUuid = req.headers.store;

      const updateStoreData = await Store.findOneAndUpdate(
        storeUuid,
        {
          info: {
            name: name,
            phone: phone,
            address: address,
            manager: manager,
            servicePhone: servicePhone,
          },
          lineOa: {
            liffId: liffId,
            channelSecret: channelSecret,
            channelToken: channelToken,
          },
        },
        { new: true, session: session }
      );

      await SmsPoint.findOneAndUpdate(
        updateStoreData._id,
        {
          warningPoint: smsWarningPoint,
        },
        { new: true, session: session }
      );

      const storeUserRole = await StoreUserRole.findOne({
        store: updateStoreData._id,
      });

      await User.findOneAndUpdate(
        storeUserRole._id,
        {
          email: adminAccount,
        },
        { new: true, session: session }
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        code: 200,
        message: "執行成功",
      });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      next(e);
    }
  },
  getStoreList: async (req, res, next) => {
    try {
      let limit = Number(req.query.limit);
      let offset = Number(req.query.offset);
      const companyuuid = req.headers.companyuuid;

      const activeStore = await getActiveStoreListByCompanyUuid(
        limit,
        offset,
        companyuuid
      );

      const inactiveStore = await getInActiveStoreListByCompanyUuid(
        limit,
        offset,
        companyuuid
      );

      return res.status(200).json({
        companyUuid: companyuuid,
        active: {
          totalStore: activeStore.count,
          offsetStore: parseInt(offset),
          stores: activeStore.row,
        },
        inactive: {
          totalStore: inactiveStore.count,
          offsetStore: parseInt(offset),
          stores: inactiveStore.row,
        },
        code: 200,
        message: "執行完成",
      });
    } catch (error) {
      next(error);
    }
  },
  getStoreDetail: async (req, res, next) => {
    try {
      let { id } = req.query;
      const companyuuid = req.headers.companyuuid;
      const result = await getStoreDetailByStoreId(id, companyuuid);

      return res.status(200).json({
        data: result,
        code: 200,
        message: "執行完成",
      });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = mongoStoreController;
