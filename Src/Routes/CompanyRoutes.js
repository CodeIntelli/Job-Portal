import express from "express";
let CompanyRoutes = express.Router();
import { CompanyController } from "../Controller";
import { CompanyAuth, Authorization } from "../Middleware";

// [ + ]After Login this url is used for user
CompanyRoutes.get("/profile", CompanyAuth, CompanyController.getUserDetails);
CompanyRoutes.put(
  "/changePassword",
  CompanyAuth,
  CompanyController.updatePassword
);
CompanyRoutes.put(
  "/edit_profile",
  CompanyAuth,
  CompanyController.updateUserDetails
);

// [ + ] Admin Credentials
CompanyRoutes.get(
  "/details",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.getAllUserDetails
);
CompanyRoutes.get(
  "/admin/user/:id",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.getSingleUser
);
CompanyRoutes.put(
  "/admin/user/:id",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.updateUserRole
);
// CompanyRoutes.delete(
//   "/admin/user/:id",
//   CompanyAuth,
//   Authorization("admin"),
//   CompanyController.deleteUser
// );
export default CompanyRoutes;
