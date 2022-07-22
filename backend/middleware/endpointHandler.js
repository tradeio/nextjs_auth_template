import { NextApiResponse, NextApiRequest } from "next";
import HTTPError from "../utils/HTTPError";
import Joi from "joi";
import connectToMongoDB from "../../config/connectToMongoDB";

const httpFunctionsSchema = Joi.object({
  GET: Joi.allow(Joi.function(), Joi.array().min(1).items(Joi.function())),
  POST: Joi.allow(Joi.function(), Joi.array().min(1).items(Joi.function())),
  PUT: Joi.allow(Joi.function(), Joi.array().min(1).items(Joi.function())),
  PATCH: Joi.allow(Joi.function(), Joi.array().min(1).items(Joi.function())),
  DELETE: Joi.allow(Joi.function(), Joi.array().min(1).items(Joi.function())),
}).unknown(false);

const endpointMiddlewareSchema = Joi.array().items(Joi.function());
const endpointArraySchema = Joi.array().items(Joi.function()).min(1);

function runMiddleware(req, res, ...args) {
  if (args.length > 0) {
    if (typeof args[0] === "function") {
      let run = false;
      return new Promise((resolve, reject)=> {
        args[0](req, res, (error, status = 500) => {
          if (run) {
            console.error(
              "Middleware error: next() attempted to run more than once"
            );
            return;
          }
          run = true;
          if (!error) {
            resolve(runMiddleware(req, res, ...args.slice(1)));
          } else {
            reject(new HTTPError("Middleware error", status, error));
          }
        });
      }) 
    } else {
      throw new Error("Middleware must be a function");
    }
  }
}

async function runFunction(req, res, arg) {
  if (typeof arg === "function") {
    return arg(req, res);
  }
  const { value, error } = endpointArraySchema.validate(arg);
  if (error) {
    throw new HTTPError("Middleware endpoint error", 500, {
      ...error.details,
      message:
        "Middleware endpoint error (endpoint handler not setup correctly)",
    });
  }
  let httpFunction = arg.pop();
  await runMiddleware(req, res, ...arg);
  return httpFunction(req, res);
}

/**
 * *--The last item of args needs to be an object--*
 * @param  {...function|object} args
 * @returns {(req: NextApiRequest, res: NextApiResponse) => void}
 */
export default function endpointHandler(...args) {
  let errors = [];
  if (args.length < 1) {
    errors.push(
      "Endpoint handler needs to have at least an object as a parameter"
    );
  }
  let httpFunctions = args.pop();
  let validateMiddleware = endpointMiddlewareSchema.validate(args);
  if (validateMiddleware.error) {
    errors.push({
      ...validateMiddleware.error,
      message: "Middleware needs to be functions",
    });
  }
  const validateFunctions = httpFunctionsSchema.validate(httpFunctions);
  if (validateFunctions.error) {
    errors.push({
      ...validateFunctions.error,
      message:
        "Last endpoint handler parameter must be an object with any of the following keys: GET, POST, PUT, PATCH, DELETE",
    });
  }
  /**
   * @param {NextApiRequest} req
   * @param {NextApiResponse} res
   */
  return async (req, res) => {
    if (errors.length > 0) {
      return res.status(500).json({
        message:
          "Internal server error => (endpoint handler incorrectly configured)",
        errors: errors,
      });
    }
    // the following is necessary to avoid cors issues with pre-flight requests!
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    try {
      await connectToMongoDB();
      let middleware = [...args]; // [...args] will create a copy of the array!
      await runMiddleware(req, res, ...middleware);
      if (httpFunctions[req.method]) {
        await runFunction(req, res, httpFunctions[req.method]);
      } else {
        res
          .status(405)
          .json({ message: `Unsupported Method verb "${req.method}"` });
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        res.status(error.status).json(error.body);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
}
