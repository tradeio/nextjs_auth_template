import { BCRYPT_HASH_ROUNDS } from "../../config/enums";
import UsersModel from "../models/Users.model";
import HTTPError from "../utils/HTTPError";
import bcrypt from "bcrypt";

const usersService = {
  createUser: async (email, password) => {
    let existingUser = await UsersModel.findOne({ email });
    if(existingUser) {
      throw new HTTPError("User already exists", 409, { message: "User already exists" });
    }
    let hashed_password = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
    return UsersModel.create({
      email,
      password: hashed_password,
    });
  },
  login: async (email, password) => {
    let user = await UsersModel.findOne({ email });
    if(!user) {
      throw new HTTPError("User does not exist", 400, { message: "User with that email does not exist" });
    }
    let isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) {
      throw new HTTPError("Invalid password", 400, { message: "Invalid password" });
    }
    return user;
  }
}

export default usersService; 