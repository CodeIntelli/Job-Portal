import express from "express";
let CompanyRoutes = express.Router();
import { CompanyController } from "../Controller";
import { CompanyAuth, Authorization } from "../Middleware";

// [ + ]After Login this url is used for user
CompanyRoutes.get("/profile", CompanyAuth, CompanyController.getCompanyDetails);
CompanyRoutes.put(
  "/changePassword",
  CompanyAuth,
  CompanyController.updatePassword
);
CompanyRoutes.put(
  "/edit_profile",
  CompanyAuth,
  CompanyController.updateCompanyDetails
);

// [ + ] Admin Credentials
CompanyRoutes.get(
  "/admin",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.getAllCompanyDetails
);
CompanyRoutes.get(
  "/admin/company/:id",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.getSingleCompany
);
CompanyRoutes.put(
  "/admin/company/:id",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.updateCompanyRole
);
CompanyRoutes.delete(
  "/admin/user/:id",
  CompanyAuth,
  Authorization("admin"),
  CompanyController.removeCompany
);
export default CompanyRoutes;
