// This will export all env variables to be easily importable in our code.
// Create a '.env.local' file in the root directory of the project
// and add the exported variables in the following format:
// [ENV_VARIABLE_NAME]=[VALUE]
// [ENV_VARIABLE2_NAME]=[VALUE2]
// etc.... (without the square brackets)
export const {
  MONGO_DB_CONNECTION_URI,
  JWT_SECRET,
  // Prefix NEXT_PUBLIC_ for all env that you want to use client-side
  NEXT_PUBLIC_BACKEND_URL
} = process.env;


export const BCRYPT_HASH_ROUNDS = 12;
export const REFRESH_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds
export const REFRESH_TOKEN_CHAR_LENGTH = 64;
export const JWT_TOKEN_EXPIRATION_TIME = "10m"; // 10 minutes