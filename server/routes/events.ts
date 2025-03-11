import express from "express"
import {
  createEvent,
  getEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
} from "../controllers/eventController"
import { protect, admin } from "../middleware/auth"

const router = express.Router()

// Public routes
router.get("/", getEvents)
router.get("/upcoming", getUpcomingEvents)
router.get("/:id", getEventById)

// Protected routes
router.use(protect)
router.post("/", admin, createEvent)
router.put("/:id", admin, updateEvent)
router.delete("/:id", admin, deleteEvent)
router.post("/:id/register", registerForEvent)

export default router

