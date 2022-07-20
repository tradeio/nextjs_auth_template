import { NextApiRequest, NextApiResponse } from "next";
import jwtService from "../services/jwt.service";

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @param {() => void|(error: string|object, ?status:number) => void} next 
 */
export const useIsAuthenticated = async (req, res, next) => {
  if(!req.headers.authorization) {
    return next({ message: "No authorization header found" }, 401);
  }
  try {
    let token = req.headers.authorization.split(" ")[1];
    let user = jwtService.verifyJWT(token);
    req.user = user;
    next();
  } catch(err) {
    if(err.name === "TokenExpiredError") {
      return next({ message: "Json web token expired", code: "JWT_EXPIRED"  }, 403);
    }
    return next({ message: "invalid authorization header or jwt token" }, 401);
  }
}