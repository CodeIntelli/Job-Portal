import express from "express";
let UserAuthRoutes = express.Router();
import { UserController } from "../Controller";

// [ + ] User Routes
// UserAuthRoutes.post("/test",UserController.testing)
UserAuthRoutes.post("/register", UserController.registerUser);
UserAuthRoutes.post("/users/:id/verify/:token", UserController.verifyEmail);
UserAuthRoutes.post("/login", UserController.login);
UserAuthRoutes.post("/password/forgot", UserController.forgotPassword);
UserAuthRoutes.put("/password/reset/:token", UserController.resetPassword);
UserAuthRoutes.get("/logout", UserController.logout);
export default UserAuthRoutes;
