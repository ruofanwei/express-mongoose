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
    question: "No. 第一個問題?",
    answer:
      "第一個回答",
  },
]


module.exports = { features, colors, notifySetting, serviceTime, qa }
