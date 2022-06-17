import express from "express";
let CompanyAuthRoutes = express.Router();
import { CompanyController } from "../Controller";

// [ + ] Company Routes
CompanyAuthRoutes.post("/register", CompanyController.registerUser);
CompanyAuthRoutes.post("/:id/verify/:token", CompanyController.verifyEmail);
CompanyAuthRoutes.post("/login", CompanyController.login);
CompanyAuthRoutes.post("/password/forgot", CompanyController.forgotPassword);
CompanyAuthRoutes.put(
  "/password/reset/:token",
  CompanyController.resetPassword
);
CompanyAuthRoutes.get("/logout", CompanyController.logout);
export default CompanyAuthRoutes;
