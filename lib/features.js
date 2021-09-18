const features = {
  calendar: {
    tabs: ["calendar"],
    utils: ["readOthers"],
  },
  schedule: {
    tabs: ["roster", "dayOff", "staffList", "feature"],
    utils: [],
  },
  service: {
    tabs: ["service"],
    utils: [],
  },
  setting: {
    tabs: [
      "storeSetting",
      "bookingSetting",
      "notifySetting",
      "qaSetting",
      "systemSetting",
    ],
    utils: [],
  },
}

const colors = {
  mainColor: "rgba(69, 82, 108, 1)",
  subColor: "rgba(69, 82, 108, 0.1)",
}

const notifySetting = {
  cancel: {
    email: true,
    sms: true,
    line: true,
    note: "",
  },
  process: {
    email: true,
    sms: true,
    line: true,
    note: "",
  },
  update: {
    email: true,
    sms: true,
    line: true,
    note: "",
  },
}

const serviceTime = {
  monday: {
    open: false,
    times: [
      {
        endTime: "21:00",
        startTime: "09:00",
      },
    ],
  },
  tuesday: {
    open: true,
    times: [
      {
        endTime: "12:00",
        startTime: "09:00",
      },
    ],
  },
  wednesday: {
    open: false,
    times: [
      {
        endTime: "12:00",
        startTime: "09:00",
      },
    ],
  },
  thursday: {
    open: true,
    times: [
      {
        endTime: "12:00",
        startTime: "09:00",
      },
    ],
  },
  friday: {
    open: true,
    times: [
      {
        endTime: "12:00",
        startTime: "09:00",
      },
    ],
  },
  saturday: {
    open: true,
    times: [
      {
        endTime: "12:00",
        startTime: "09:00",
      },
    ],
  },
  sunday: {
    open: false,
    times: [
      {
        endTime: "12:00",
        startTime: "09:00",
      },
    ],
  },
}

const qa = [
  {
    question: "線上預約完成後，我還需要和店家確認嗎?",
    answer:
      "線上預約完成後，請麻煩至預約記錄確認是否有出現新的記錄，如果記錄有被新增，請放心，預約已完成!",
  },
]


module.exports = { features, colors, notifySetting, serviceTime, qa }
