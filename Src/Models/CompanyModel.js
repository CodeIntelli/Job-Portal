import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_EXPIRE, JWT_SECRET } from "../../Config";
const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot exceed 30 characters"],
    minLength: [4, "Name Should have more than 4 characters"],
  },
  companyEmail: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid email"],
  },
  companyPANCard: {
    type: String,
    required: [true, "Please Enter Your PAN Card Details"],
    validate: {
      validator: function (v) {
        return v === "" ? /([A-Z]){5}([0-9]){4}([A-Z]){1}$/ : true;
      },
      msg: "Phone number is invalid!",
    },
    select: false,
  },
  companyPassword: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [4, "Password should not be greater than 4 characters"],
    select: false,
  },
  profilePicture: {
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
    default: "company",
  },
  establishAt: {
    type: String,
    required: "true",
  },
  bio: {
    type: String,
    required: "true",
  },
  phone: {
    type: Number,
    required: "true",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  companyIp: {
    type: String,
    required: true,
    default: "0.0.0.0",
  },
  companyLocation: {
    required: true,
    type: String,
    default: "",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Bcrypt
CompanySchema.pre("save", async function (next) {
  if (!this.isModified("companyPassword")) {
    next();
  }
  this.companyPassword = await bcrypt.hash(this.companyPassword, 10);
});

// JWT TOKEN
CompanySchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Compare Password
CompanySchema.methods.comparePassword = async function (enteredpassword) {
  console.log("enteredPassword", enteredpassword);
  return await bcrypt.compare(enteredpassword, this.companyPassword);
};

// Generating Password Reset Token
CompanySchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordTOken to CompanySchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //* this will valid only for 15 min
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

let CompanyModel = mongoose.model("Company", CompanySchema);
export default CompanyModel;
