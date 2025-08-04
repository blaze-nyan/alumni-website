const express = require("express");
const {
  createStory,
  getStories,
  getFeaturedStories,
  getStoryById,
  updateStory,
  deleteStory,
  likeStory,
  addComment,
  approveStory,
  getPendingStories,
  getAllStoriesForAdmin,
} = require("../controllers/storyController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getStories);
router.get("/featured", getFeaturedStories);
router.get("/:id", getStoryById);

// Protected routes
router.use(protect);
router.post("/", createStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);
router.post("/:id/like", likeStory);
router.post("/:id/comments", addComment);

// Admin only routes
router.get("/admin/all", admin, getAllStoriesForAdmin);
router.get("/admin/pending", admin, getPendingStories);
router.patch("/:id/approve", admin, approveStory);

module.exports = router;
