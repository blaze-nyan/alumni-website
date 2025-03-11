const express = require("express");
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updatePassword,
  getAlumniDirectory,
  toggleFriend,
  updateUserStatus,
} = require("../controllers/userController");
const { getUserStories } = require("../controllers/storyController");
const { getUserEvents } = require("../controllers/eventController");
const { protect, admin } = require("../middleware/auth");

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

module.exports = router;
