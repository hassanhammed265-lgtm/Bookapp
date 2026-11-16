const Joi = require("joi");
const joiPad = require("joi-password-complexity");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
});


const complexityOptions = {
  min: 6,
  max: 30, 
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};


module.exports.userVal = userSchema;
module.exports.pwdVal = joiPad(complexityOptions);