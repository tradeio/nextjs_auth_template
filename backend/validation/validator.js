import validationSchemas from "./validation.schemas";

const validator = {
  USER: {
    register: (obj) => validationSchemas.registerUserSchema.validate(obj),
    login: (obj) => validationSchemas.loginUserSchema.validate(obj),
    refreshToken: (obj) => validationSchemas.refreshTokenSchema.validate(obj),
  },
  UTIL: {
    pagination: (obj) => validationSchemas.paginationSchema.validate(obj),
    mongooseID: (obj) => validationSchemas.mongooseIDSchema.validate(obj),
  }
}

export default validator;