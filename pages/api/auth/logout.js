import { useIsAuthenticated } from "../../../backend/middleware/auth.middleware";
import endpointHandler from "../../../backend/middleware/endpointHandler";
import refreshTokenService from "../../../backend/services/refreshToken.service";


/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
 async function POST(req, res) {
  await refreshTokenService.deleteUserRefreshToken(req.user._id);
  res.status(200).end();
 }

export default endpointHandler(useIsAuthenticated, {
  POST
})