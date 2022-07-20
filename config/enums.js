// This will export all env variables to be easily importable in our code.
// Create a '.env.local' file in the root directory of the project
// and add the exported variables in the following format:
// [ENV_VARIABLE_NAME]=[VALUE]
// [ENV_VARIABLE2_NAME]=[VALUE2]
// etc.... (without the square brackets)
export const {
  MONGO_DB_CONNECTION_URI,
  JWT_SECRET,
} = process.env;


export const BCRYPT_HASH_ROUNDS = 12;
export const REFRESH_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds
export const REFRESH_TOKEN_CHAR_LENGTH = 64;
export const JWT_TOKEN_EXPIRATION_TIME = "30s"; // 10 minutes