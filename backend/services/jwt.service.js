import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_TOKEN_EXPIRATION_TIME } from "../../config/enums";

const jwtService = {
  createJWT: (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION_TIME });
  },
  verifyJWT: (token) => {
    return jwt.verify(token, JWT_SECRET);
  },
}

export default jwtService;