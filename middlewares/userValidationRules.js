const {
  body,
  param,
  header,
  check,
  validationResult,
  oneOf,
} = require("express-validator");

const createStoreValidationRules = () => {
  return [
    header("companyUuid")
      // if the body companyName is not exists
      .if(body("companyName").not().exists())
      .bail()
      // If body companyName is  exists, below will never run
      .not()
      .isEmpty()
      .withMessage("companyUuid is invalid"),
    body("companyName")
      // if the param is exists
      .if(header("companyUuid").not().exists())
      .bail()
      // If companyUuid is  exists, below will never run
      .not()
      .isEmpty()
      .withMessage("companyName field error"),
    body("contactPerson").notEmpty().withMessage("contactPerson field error"),
    body("contactPhone")
      .not()
      .isEmpty()
      .matches(/^09\d{8}$/)
      .withMessage("contactPhone field error"),
    body("storeName").notEmpty().withMessage("storeName field error"),
    body("storeSlug").notEmpty().withMessage("storeSlug field error"),
    body("address").notEmpty().withMessage("address field error"),
    body("customerServicePhone")
      .notEmpty()
      .withMessage("customerServicePhone field error"),
    body("account").notEmpty().withMessage("account field error"),
    check("account").isEmail(),
    body("password").notEmpty().withMessage("password field error"),
    check("password").isLength({ min: 6 }).withMessage("密碼最低長度為6碼"),
    body("point").notEmpty().withMessage("point field error"),
    body("name").notEmpty().withMessage("name field error"),
    body("email").notEmpty().withMessage("email field error"),
    check("email").isEmail(),
  ];
};

const updateStoreValidationRules = () => {
  return [
    body("contactPerson").notEmpty().withMessage("contactPerson field error"),
    body("contactPhone")
      .not()
      .isEmpty()
      .matches(/^09\d{8}$/)
      .withMessage("contactPhone field error"),
    body("storeName").notEmpty().withMessage("storeName field error"),
    body("address").notEmpty().withMessage("address field error"),
    body("customerServicePhone")
      .notEmpty()
      .withMessage("customerServicePhone field error"),
    body("account").notEmpty().withMessage("account field error"),
    check("account").isEmail(),
  ];
};
const validate = (req, res, next) => {
  const errors = validationResult(req);
  // hasErrors is true
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors
      .array()
      .map((error) => extractedErrors.push({ [error.param]: error.msg }));
    return res.status(400).json({
      code: 400,
      errors: extractedErrors,
      message: "資料格式錯誤",
    });
  } else {
    next();
  }
};

module.exports = {

  /* for store */
  createStoreValidationRules,
  updateStoreValidationRules,


  validate,
};
