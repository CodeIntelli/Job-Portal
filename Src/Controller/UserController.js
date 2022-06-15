import { UserModel, TokenModel } from "../Models";
import { ErrorHandler, SendToken, SendEmail, Encryption } from "../Services";
import { FRONTEND_URL } from "../../Config";
import crypto from "crypto";
import cloudinary from "cloudinary";
const UserController = {
  async registerUser(req, res, next) {
    try {
      req.body = await Encryption.Decrypt(req.body.secureData);
      let myCloud;
      if (req.body.avatar) {
        myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "eComUserProfile",
          width: 150,
          crop: "scale",
        });
      }
      // const public_id = myCloud.public_id == undefine ? "" : myCloud.public_id;
      // let myCloud_url =
      //   myCloud.secure_url == undefine ? "" : myCloud.secure_url;
      const { name, email, password, userLocation } = req.body;

      const user = await UserModel.create({
        name: req.body.name.trim(),
        email,
        password,
        userLocation,
      });

      const token = await TokenModel.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      const url = `${FRONTEND_URL}/users/${user._id}/verify/${token.token}`;

      const message = `Your Email Verification token is:- ${url} \n\n If you Don't requested this email then ignore it\n\n `;
      const sendVerifyMail = await SendEmail({
        email: user.email,
        subject: `Email Verification`,
        message,
      });
      if (!sendVerifyMail) {
        return next(
          new ErrorHandler(
            "Something Error Occurred Please Try After Some Time",
            422
          )
        );
      }
      // SendToken(user, 201, res);
      let successMessage = await Encryption.Encrypt({
        success: "Pending",
        message:
          "An Email send to your account please verify your email address",
      });
      res.status(201).json({
        secureData: successMessage,
      });
      res.status(201).json();
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error, 500));
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const user = await UserModel.findOne({ _id: req.params.id });
      if (!user) {
        return next(new ErrorHandler("Invalid Verification Link", 400));
      }
      const token = await TokenModel.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) {
        return next(new ErrorHandler("Invalid Verification Link", 400));
      }

      await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          verified: true,
        },
        { new: true, runValidators: true, useFindAndModify: false }
      );
      await token.remove();

      res.status(200).send({
        success: true,
        message: "Email Verification Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  },

  async login(req, res, next) {
    try {
      req.body = await Encryption.Decrypt(req.body.secureData);

      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
      }
      const user = await UserModel.findOne({ email: email }).select(
        "+password"
      );
      if (!user) {
        return next(new ErrorHandler("Invalid Email and password", 400));
      }

      if (!user.verified) {
        return next(new ErrorHandler("please verify your email address", 400));
      }
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email and password", 400));
      }
      const token = user.getJWTToken();
      SendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  },

  async logout(req, res, next) {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Successfully Logout",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  },
  async forgotPassword(req, res, next) {
    req.body = await Encryption.Decrypt(req.body.secureData);
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is:- ${resetPasswordUrl} \n\n If you Don't requested this email then ignore it\n\n `;

    try {
      await SendEmail({
        email: user.email,
        subject: `Password Recovery Email`,
        message,
      });
      let successMessage = await Encryption.Encrypt({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
      res.status(200).json({
        secureData: successMessage,
      });
      // res.status(200).json();
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  },

  async resetPassword(req, res, next) {
    try {
      req.body = await Encryption.Decrypt(req.body.secureData);
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return next(
          new ErrorHandler(
            "Reset password token is Invalid or has been expired",
            404
          )
        );
      }
      // if(user.password === req.body.password){
      //    return next(new ErrorHandler("Please Choose Different Password", 422));
      // }

      if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400));
      }
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      let successMessage = await Encryption.Encrypt({
        success: true,
        message: `Password Reset Successfully`,
      });
      res.status(200).json({
        secureData: successMessage,
      });

      // SendToken(user, 200, res);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  async getUserDetails(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  async getAllUserDetails(req, res, next) {
    try {
      
      const users = await UserModel.find();
      let successMessage = await Encryption.Encrypt({ success: true, users });
      res.status(200).json({
        secureData: successMessage,
      });
      // res.status(200).json();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // if authenticated
  async updatePassword(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id).select("+password");
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password Is Incorrect", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Doesn't match", 400));
      }
      user.password = req.body.newPassword;
      await user.save();
      SendToken(user, 200, res);
      res.status(200).json({ success: true, user });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
  // get single user - admin
  async getSingleUser(req, res, next) {
    try {
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
  async updateUserRole(req, res, next) {
    try {
      const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      };

      await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  async updateUserDetails(req, res, next) {
    try {
      const newUserData = {
        name: req.body.name,
        email: req.body.email,
      };
      if (req.body.avatar !== "") {
        const user = await UserModel.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });

        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const user = await UserModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
      });

      next();
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
      }

      await user.remove();

      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
};

export default UserController;
