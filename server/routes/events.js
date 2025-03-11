const express = require("express");
const {
  createEvent,
  getEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require("../controllers/eventController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);

// Protected routes
router.use(protect);
router.post("/", admin, createEvent);
router.put("/:id", admin, updateEvent);
router.delete("/:id", admin, deleteEvent);
router.post("/:id/register", registerForEvent);

module.exports = router;
