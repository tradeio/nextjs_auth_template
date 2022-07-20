import HTTPError from "../utils/HTTPError";
import randToken from "rand-token";
import { REFRESH_TOKEN_CHAR_LENGTH, REFRESH_TOKEN_EXPIRATION_TIME } from "../../config/enums";
import RefreshTokenModel from "../models/RefreshToken.model";

const refreshTokenService = {
  createRefreshToken: async (userId) => {
    let randomToken = randToken.generate(REFRESH_TOKEN_CHAR_LENGTH);
    await RefreshTokenModel.updateOne(
      { user: userId },
      {
        token: randomToken,
        expiresIn: Date.now() + REFRESH_TOKEN_EXPIRATION_TIME,
      },
      { upsert: true }
    );
    return randomToken;
  },
  verifyRefreshToken: async (token) => {
    const refreshToken = await RefreshTokenModel.findOne({
      token,
    }).populate("user");
    if (!refreshToken) {
      throw new HTTPError("Invalid token", 401, {
        message: "Invalid refresh token",
      });
    }
    if (refreshToken.expiredAt < new Date()) {
      throw new HTTPError("Token expired", 401, {
        message: "Refresh Token expired",
      });
    }
    return refreshToken.user;
  },
  deleteUserRefreshToken: async (userId) => {
    return RefreshTokenModel.deleteOne({ user: userId });
  }
};

export default refreshTokenService;
