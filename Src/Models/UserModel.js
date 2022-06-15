import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_EXPIRE, JWT_SECRET } from "../../Config";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot exceed 30 characters"],
    minLength: [4, "Name Should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [4, "Password should not be greater than 4 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userIp: {
    type: String,
    required: true,
    default: "0.0.0.0",
  },
  userLocation: {
    required: true,
    type: String,
    default: "",
  },
  education: [
    {
      institutionName: {
        type: String,
        required: true,
      },
      startYear: {
        type: Number,
        min: 1930,
        max: new Date().getFullYear(),
        required: true,
        validate: Number.isInteger,
      },
      endYear: {
        type: Number,
        max: new Date().getFullYear(),
        validate: [
          { validator: Number.isInteger, msg: "Year should be an integer" },
          {
            validator: function (value) {
              return this.startYear <= value;
            },
            msg: "End year should be greater than or equal to Start year",
          },
        ],
      },
    },
  ],
  skills: [String],
  resume: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  phone: { type: Number, required: "true" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Compare Password
UserSchema.methods.comparePassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordTOken to UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //* this will valid only for 15 min
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

let UserModel = mongoose.model("User", UserSchema);
export default UserModel;
