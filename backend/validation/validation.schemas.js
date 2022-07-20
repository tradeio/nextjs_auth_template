import Joi from "./extendedJoi";

export default {
  registerUserSchema: Joi.object().keys({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.password().trim().required(),
  }),
  loginUserSchema: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
  refreshTokenSchema: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
  paginationSchema: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(50),
  }),
  mongooseIDSchema: Joi.mongooseID().required(),
};
