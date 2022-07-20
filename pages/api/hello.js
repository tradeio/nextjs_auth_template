import { NextApiRequest, NextApiResponse } from "next";
import endpointHandler from "../../backend/middleware/endpointHandler";
import { useIsAuthenticated } from "../../backend/middleware/auth.middleware";

/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
async function GET(req, res) {
  res.status(200).json({ message: "Hello World", user: req.user });
}

export default endpointHandler(useIsAuthenticated, {
  GET,
});
