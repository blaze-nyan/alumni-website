import express from "express";
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updatePassword,
  getAlumniDirectory,
  toggleFriend,
  updateUserStatus,
} from "../controllers/userController.js";
import { getUserStories } from "../controllers/storyController.js";
import { getUserEvents } from "../controllers/eventController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.get("/", admin, getUsers);
router.get("/alumni", getAlumniDirectory);
router.put("/profile", updateUserProfile);
router.put("/password", updatePassword);

// User specific routes
router.get("/:id", getUserById);
router.post("/:id/friend", toggleFriend);
router.put("/:id/status", admin, updateUserStatus);

// User stories and events
router.get("/:userId/stories", getUserStories);
router.get("/:userId/events", getUserEvents);

export default router;
