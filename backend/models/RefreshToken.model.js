import mongoose from "mongoose";
import { REFRESH_TOKEN_EXPIRATION_TIME } from "../../config/enums";

const RefreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    token: { type: String, required: true },
    expiredAt: { type: Date, default: () => Date.now() + REFRESH_TOKEN_EXPIRATION_TIME },
  },
  { timestamps: true }
);

// Models will always be converted to lowercase plurar therefore use that convention from the get go.
export default mongoose.models.refreshtokens ||
  mongoose.model("refreshtokens", RefreshTokenSchema);
