import { NextApiRequest, NextApiResponse } from "next";
import endpointHandler from "../../../backend/middleware/endpointHandler";
import jwtService from "../../../backend/services/jwt.service";
import refreshTokenService from "../../../backend/services/refreshToken.service";
import HTTPError from "../../../backend/utils/HTTPError";
import validator from "../../../backend/validation/validator";

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
async function POST(req, res) {
  const { value, error } = validator.USER.refreshToken(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, error.details);
  }
  let user = await refreshTokenService.verifyRefreshToken(value.refreshToken);
  let jwt = jwtService.createJWT(user.toJSON());
  res.status(200).json({ jwt });
}

export default endpointHandler({
  POST,
});
