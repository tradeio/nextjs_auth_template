import { NextApiRequest, NextApiResponse } from "next";
import endpointHandler from "../../../backend/middleware/endpointHandler";
import jwtService from "../../../backend/services/jwt.service";
import refreshTokenService from "../../../backend/services/refreshToken.service";
import usersService from "../../../backend/services/users.service";
import HTTPError from "../../../backend/utils/HTTPError";
import validator from "../../../backend/validation/validator";

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
async function POST(req, res) {
  // Validate request body
  const { value, error } = validator.USER.register(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, error.details);
  }

  // Businesss logic
  const user = await usersService.createUser(value.email, value.password);
  const jwt = jwtService.createJWT(user.toJSON());
  const refreshToken = await refreshTokenService.createRefreshToken(user._id);
  res.status(200).json({ user: user.toJSON(), jwt, refreshToken });
}

export default endpointHandler({
  POST,
});
