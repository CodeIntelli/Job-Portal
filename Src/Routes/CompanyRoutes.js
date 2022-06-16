import express from "express";
let CompanyRoutes = express.Router();
import { CompanyController } from "../Controller";
import { Authentication, Authorization } from "../Middleware";

// [ + ] User Routes
CompanyRoutes.post("/register", CompanyController.registerUser);
CompanyRoutes.post("/:id/verify/:token", CompanyController.verifyEmail);
CompanyRoutes.post("/login", CompanyController.login);
CompanyRoutes.post("/password/forgot", CompanyController.forgotPassword);
CompanyRoutes.put("/password/reset/:token", CompanyController.resetPassword);
CompanyRoutes.get("/logout", CompanyController.logout);

// [ + ]After Login this url is used for user
CompanyRoutes.get("/profile", Authentication, CompanyController.getUserDetails);
CompanyRoutes.put(
  "/changePassword",
  Authentication,
  CompanyController.updatePassword
);
CompanyRoutes.put(
  "/edit_profile",
  Authentication,
  CompanyController.updateUserDetails
);

// [ + ] Admin Credentials
CompanyRoutes.get(
  "/details",
  Authentication,
  Authorization("admin"),
  CompanyController.getAllUserDetails
);
CompanyRoutes.get(
  "/admin/user/:id",
  Authentication,
  Authorization("admin"),
  CompanyController.getSingleUser
);
CompanyRoutes.put(
  "/admin/user/:id",
  Authentication,
  Authorization("admin"),
  CompanyController.updateUserRole
);
// CompanyRoutes.delete(
//   "/admin/user/:id",
//   Authentication,
//   Authorization("admin"),
//   CompanyController.deleteUser
// );
export default CompanyRoutes;
