  const { body } = require("express-validator");
  
  const userDataValidateChainMethod = [
    body("firstname")
      .exists({ checkFalsy: false })
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("First name is required and should be string")
      .isString()
      .withMessage("First name is required and should be string"),
    body("lastname")
      .exists({ checkFalsy: false })
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("First name is required and should be string")
      .isString()
      .withMessage("Last name is required should be string"),
    body("password")
      .exists()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password should be string")
      .isLength({ min: 5 })
      .withMessage("Password should be at least 5 characters"),
      body('confirm_password')
      .exists({checkFalsy: true}).withMessage('You must type a confirmation password')
      .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email Exists. Comming from Middleware")
      .isEmail()
      .withMessage("Provide valid email"),
    // body("gender")
    //   .optional()
    //   .isString()
    //   .withMessage("Gender should be string")
    //   .isIn(['m','f','o','na'])
    //   .withMessage("Gender value is invalid"),
  
    body("phoneNumber")
      .optional()
      .escape()
      .isString()
      .withMessage("phone number should be string")
      
  ];
  

  module.exports = {
    userDataValidateChainMethod
  };