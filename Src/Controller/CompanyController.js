import { CompanyModel, TokenModel } from "../Models";
import { ErrorHandler, SendToken, SendEmail, Encryption } from "../Services";
import { FRONTEND_URL } from "../../Config";
import crypto from "crypto";
// https://github1s.com/b30wulffz/job-portal/blob/HEAD/backend/db/JobApplicant.js#L13-L41
import cloudinary from "cloudinary";
const CompanyController = {
  async registerUser(req, res, next) {

    try {
      // req.body = await Encryption.Decrypt(req.body.secureData);
      console.log(req.body)
      let myCloud;
      myCloud = await cloudinary.v2.uploader.upload(req.body.profilePicture, {
        folder: "eComUserProfile",
        width: 150,
        crop: "scale",
      });
      const {
        name,
        companyEmail,
        companyPANCard,
        companyPassword,
        profilePicture,
        establishAt,
        bio,
        phone,
        companyIp,
        companyLocation,
      } = req.body;

      const company = await CompanyModel.create({
        name: req.body.name.trim(),
        companyEmail,
        companyPANCard,
        companyPassword,
        profilePicture: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        establishAt,
        bio,
        phone,
        companyIp,
        companyLocation,
      });

      const token = await TokenModel.create({
        userId: company._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      const url = `${FRONTEND_URL}/company/${company._id}/verify/${token.token}`;

      const message = `Your Email Verification token is:- ${url} \n\n If you Don't requested this email then ignore it\n\n `;
      const sendVerifyMail = await SendEmail({
        email: company.companyEmail,
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
      const company = await CompanyModel.findOne({ _id: req.params.id });
      if (!company) {
        return next(new ErrorHandler("Invalid Verification Link", 400));
      }
      const token = await TokenModel.findOne({
        companyId: company._id,
        token: req.params.token,
      });
      if (!token) {
        return next(new ErrorHandler("Invalid Verification Link", 400));
      }

      await CompanyModel.findByIdAndUpdate(
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
      // req.body = await Encryption.Decrypt(req.body.secureData);

      const { companyEmail, companyPassword } = req.body;
      console.log(req.body)
      if (!companyEmail || !companyPassword) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
      }
      const company = await CompanyModel.findOne({
        companyEmail: companyEmail,
      }).select("+companyPassword");
      if (!company) {
        return next(new ErrorHandler("Invalid Email and password", 400));
      }

      if (!company.verified) {
        const token = await TokenModel.create({
          userId: company._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
        const url = `${FRONTEND_URL}/company/${company._id}/verify/${token.token}`;

        const message = `Your Email Verification token is:- ${url} \n\n If you Don't requested this email then ignore it\n\n `;
        const sendVerifyMail = await SendEmail({
          email: company.companyEmail,
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
        return next(new ErrorHandler("please verify your email address", 400));
      }
      console.log(companyPassword)
      const isPasswordMatched = await company.comparePassword(companyPassword);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email and password", 400));
      }
      const token = company.getJWTToken();
      SendToken(company, 200, res);
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
    // req.body = await Encryption.Decrypt(req.body.secureData);
    const company = await CompanyModel.findOne({
      companyEmail: req.body.companyEmail,
    });
    if (!company) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    const resetToken = company.getResetPasswordToken();
    await company.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is:- ${resetPasswordUrl} \n\n If you Don't requested this email then ignore it\n\n `;

    try {
      await SendEmail({
        email: company.companyEmail,
        subject: `Password Recovery Email`,
        message,
      });
      let successMessage = await Encryption.Encrypt({
        success: true,
        message: `Email sent to ${company.email} successfully`,
      });
      res.status(200).json({
        secureData: successMessage,
      });
    } catch (error) {
      company.resetPasswordToken = undefined;
      company.resetPasswordExpire = undefined;
      await company.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  },

  async resetPassword(req, res, next) {
    try {
      // req.body = await Encryption.Decrypt(req.body.secureData);
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const company = await CompanyModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!company) {
        return next(
          new ErrorHandler(
            "Reset password token is Invalid or has been expired",
            404
          )
        );
      }

      if (req.body.companyPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400));
      }
      company.companyPassword = req.body.companyPassword;
      company.resetPasswordToken = undefined;
      company.resetPasswordExpire = undefined;
      await company.save();
      let successMessage = await Encryption.Encrypt({
        success: true,
        message: `Password Reset Successfully`,
      });
      res.status(200).json({
        secureData: successMessage,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  async getUserDetails(req, res, next) {
    try {
      const company = await CompanyModel.findById(req.companyUser.id);
      res.status(200).json({ success: true, company });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  async getAllUserDetails(req, res, next) {
    try {
      const company = await CompanyModel.find();
      let successMessage = await Encryption.Encrypt({ success: true, company });
      res.status(200).json({
        secureData: successMessage,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // if authenticated
  async updatePassword(req, res, next) {
    try {
      const company = await CompanyModel.findById(req.companyUser.id).select(
        "+companyPassword"
      );
      const isPasswordMatched = await company.comparePassword(
        req.body.oldPassword
      );
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password Is Incorrect", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Doesn't match", 400));
      }
      company.companyPassword = req.body.newPassword;
      await company.save();
      SendToken(company, 200, res);
      res.status(200).json({ success: true, company });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
  // get single user - admin
  async getSingleUser(req, res, next) {
    try {
      const company = await CompanyModel.findById(req.params.id);

      if (!company) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
      }

      res.status(200).json({
        success: true,
        company,
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
  async updateUserRole(req, res, next) {
    try {
      const newUserData = {
        name: req.body.name,
        companyEmail: req.body.email,
        role: req.body.role,
      };

      await CompanyModel.findByIdAndUpdate(req.params.id, newUserData, {
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
        companyEmail: req.body.email,
      };
      if (req.body.avatar !== "") {
        const company = await CompanyModel.findById(req.companyUser.id);

        const imageId = company.avatar.public_id;

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

      const company = await CompanyModel.findByIdAndUpdate(
        req.companyUser.id,
        newUserData,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
      });

      next();
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  async deleteCompany(req, res, next) {
    try {
      const company = await CompanyModel.findById(req.params.id);

      if (!company) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
      }

      await company.remove();

      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
};

export default CompanyController;
