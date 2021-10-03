const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceTimesMetaSchema = new Schema({
  _id: false,
  open: { type: Boolean, default: true },
  times: [
    {
      startTime: { type: String },
      endTime: { type: String },
      _id: false,
    },
  ],
});

const ServiceTimeSchema = new Schema({
  monday: { type: ServiceTimesMetaSchema },
  tuesday: { type: ServiceTimesMetaSchema },
  wednesday: { type: ServiceTimesMetaSchema },
  thursday: { type: ServiceTimesMetaSchema },
  friday: { type: ServiceTimesMetaSchema },
  saturday: { type: ServiceTimesMetaSchema },
  sunday: { type: ServiceTimesMetaSchema },
});

const ColorSchema = new Schema({
  mainColor: { type: String },
  subColor: { type: String },
  _id: false,
});

const DayOffSchema = new Schema({
  id: { type: Number, index: true, unique: false, required: false },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  createdAt: { type: String },
  _id: false,
});

const QaSchema = new Schema({
  question: { type: String },
  answer: { type: String },
  _id: false,
});

const NotifySettingMetaSchema = new Schema({
  sms: { type: Boolean, default: false },
  email: { type: Boolean, default: false },
  line: { type: Boolean, default: false },
  note: { type: String, default: "" },
});

const NotifySettingSchema = new Schema({
  update: { type: NotifySettingMetaSchema, _id: false },
  cancel: { type: NotifySettingMetaSchema, _id: false },
  process: { type: NotifySettingMetaSchema, _id: false },
});

const StoreSchema = new Schema(
  {
    // UUID
    uuid: {
      type: Schema.Types.ObjectId,
      index: true,
      unique: true,
      required: true,
      auto: true,
    },
    // 店家網址別稱
    slug: { type: String, required: true, unique: true },
    // 是否為總店
    mainStore: { type: Boolean, default: true },
    // 是否啟用
    isActive: { type: Boolean, default: true },
    // 基本資訊
    info: {
      // 店名
      name: { type: String },
      // 聯絡電話
      phone: { type: String },
      // 地址
      address: { type: String },
      // 聯絡人
      manager: { type: String },
      // 客服電話
      servicePhone: { type: String },
      // 公告
      announcement: { type: String },
      // 業種
      category: { type: String },
      // 色票
      color: { type: ColorSchema, required: false },
    },
    // 營業時間資訊
    serviceTime: { type: ServiceTimeSchema, required: false, _id: false },
    // LINE OA 資訊
    lineOa: {
      liffId: { type: String },
      channelSecret: { type: String },
      channelToken: { type: String },
    },
    // 店休資訊
    dayOffs: { type: [DayOffSchema] },
    // 問與答
    questionsAnswers: { type: [QaSchema] },
    // 通知設定
    notifySetting: { type: NotifySettingSchema, required: true, _id: false },
    // 預約設定
    bookingSetting: {
      daysBookable: { type: Number, default: 0 },
      maxBookingCount: { type: Number, default: 0 },
      isBookingRepeatable: { type: Boolean, default: false },
      isBookingCancelable: { type: Boolean, default: false },
      isBookingEditable: { type: Boolean, default: false },
    },
    // 所屬品牌
    company: { type: Schema.Types.ObjectId, ref: "Company", required: false },
    // 發出的通知
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
    // 簡訊點數儲值交易
    smsPointOrders: [{ type: Schema.Types.ObjectId, ref: "SmsPointOrder" }],
    // 簡訊剩餘點數
    smsPoint: { type: Schema.Types.ObjectId, ref: "SmsPoint" },
    // 員工職稱
    storeUserRole: [{ type: Schema.Types.ObjectId, ref: "StoreUserRole" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamp: true,
  }
);

StoreSchema.pre("save", (next) => {
  this.updatedAt = Date.now();
  next();
});



module.exports = mongoose.model("Store", StoreSchema);
