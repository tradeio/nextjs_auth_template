import Joi from "joi";
import mongoose from "mongoose";

/**
 * @constant
 * @type {Joi.Root}
 * @default
 */
const extendedJoi = Joi.extend(
  {
    type: "password",
    base: Joi.string(),
    messages: {
      "password.base":
        "{{#label}} must be at least 8 characters long, contain at least one number, one special character and one uppercase letter",
    },
    validate(value, helpers) {
      const password_regex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&]).{8,}$/gm;
        if (!password_regex.test(value)) {
        return { value, errors: helpers.error("password.base") };
      }
      return { value };
    },
  },
  {
    type: "mongooseID",
    base: Joi.string(),
    messages: {
      "mongooseID.base": "{{#label}} must be a valid mongoose ID",
    },
    validate(value, helpers) {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return { value };
      }
      return { value, errors: helpers.error("mongooseID.base") };
    },
  }
);

export default extendedJoi;
