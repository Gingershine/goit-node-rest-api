import AuthController from "../controllers/usersControllers.js";
import express from "express";
import authMiddleware from "../middlewares/auth.js";
import validateBody from "../helpers/validateBody.js";
import { createUserSchema, loginUserSchema, subscriptionSchema } from "../schemas/usersSchema.js";
import uploadMiddleware from "../middlewares/upload.js";
import updateAvatar from "../controllers/avatarComtrollers.js";



const router = express.Router();
const jsonParser = express.json();

router.post("/register", validateBody(createUserSchema), jsonParser, AuthController.register);
router.post("/login", validateBody(loginUserSchema), jsonParser, AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/current", authMiddleware, AuthController.getCurrentUser);
router.patch("/", validateBody(subscriptionSchema), authMiddleware, AuthController.updateSubscription);
router.patch("/avatars", authMiddleware, uploadMiddleware.single("avatar"), updateAvatar);

export default router;