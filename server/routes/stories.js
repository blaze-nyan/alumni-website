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
} = require("../controllers/storyController");
const { protect } = require("../middleware/auth");

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

module.exports = router;
