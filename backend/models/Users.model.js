import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
      },
    },
  }
);

// Models will always be converted to lowercase plurar therefore use that convention from the get go.
export default mongoose.models.users || mongoose.model("users", UsersSchema);
