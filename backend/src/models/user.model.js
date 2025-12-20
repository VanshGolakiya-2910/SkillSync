import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    avatar: { type: String },
    fullname: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    requested: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    refreshToken: {
      type: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return null;

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
