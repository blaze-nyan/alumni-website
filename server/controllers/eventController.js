const Event = require("../models/Event");
const Media = require("../models/Media");
const { v4: uuidv4 } = require("uuid");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, mediaFiles } = req.body;
    const userId = req.user._id;

    // Check if user is admin
    if (req.user.usertype !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to create events" });
    }

    // Handle media files
    const mediaIds = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaId = uuidv4();
        await Media.create({
          mediaId,
          dataType: file.type,
          base64data: file.data,
        });
        mediaIds.push(mediaId);
      }
    }

    const event = await Event.create({
      title,
      description,
      author: userId,
      mediaIds,
      calendar: {
        date,
        location,
      },
      attendees: [],
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events with pagination
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({ isDeleted: false })
      .sort({ "calendar.date": 1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "firstname lastname username profileImage")
      .lean();

    // Get total count for pagination
    const total = await Event.countDocuments({ isDeleted: false });

    // Enhance events with media URLs
    const enhancedEvents = await Promise.all(
      events.map(async (event) => {
        // Get media URLs
        const mediaUrls = [];
        if (event.mediaIds && event.mediaIds.length > 0) {
          for (const mediaId of event.mediaIds) {
            const media = await Media.findOne({ mediaId });
            if (media) {
              mediaUrls.push(
                `data:${media.dataType};base64,${media.base64data}`
              );
            }
          }
        }

        return {
          ...event,
          mediaUrls,
        };
      })
    );

    res.json({
      events: enhancedEvents,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isDeleted: false,
      "calendar.date": { $gte: new Date() },
    })
      .sort({ "calendar.date": 1 })
      .limit(3)
      .populate("author", "firstname lastname username profileImage")
      .lean();

    // Enhance events with media URLs
    const enhancedEvents = await Promise.all(
      events.map(async (event) => {
        // Get media URLs
        const mediaUrls = [];
        if (event.mediaIds && event.mediaIds.length > 0) {
          for (const mediaId of event.mediaIds) {
            const media = await Media.findOne({ mediaId });
            if (media) {
              mediaUrls.push(
                `data:${media.dataType};base64,${media.base64data}`
              );
            }
          }
        }

        return {
          ...event,
          mediaUrls,
        };
      })
    );

    res.json(enhancedEvents);
  } catch (error) {
    console.error("Get upcoming events error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get an event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false })
      .populate("author", "firstname lastname username profileImage")
      .populate("attendees", "firstname lastname username profileImage")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get media URLs
    const mediaUrls = [];
    if (event.mediaIds && event.mediaIds.length > 0) {
      for (const mediaId of event.mediaIds) {
        const media = await Media.findOne({ mediaId });
        if (media) {
          mediaUrls.push(`data:${media.dataType};base64,${media.base64data}`);
        }
      }
    }

    res.json({
      ...event,
      mediaUrls,
    });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, mediaFiles } = req.body;

    // Check if user is admin
    if (req.user.usertype !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update events" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Handle media files
    const mediaIds = [...event.mediaIds]; // Keep existing media IDs
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaId = uuidv4();
        await Media.create({
          mediaId,
          dataType: file.type,
          base64data: file.data,
        });
        mediaIds.push(mediaId);
      }
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.mediaIds = mediaIds;

    if (date) {
      event.calendar.date = new Date(date);
    }

    if (location) {
      event.calendar.location = location;
    }

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.usertype !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete events" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Soft delete
    event.isDeleted = true;
    await event.save();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event date is in the past
    if (new Date(event.calendar.date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot register for past events" });
    }

    // Check if user is already registered
    const alreadyRegistered = event.attendees.includes(userId);

    if (alreadyRegistered) {
      // Unregister from the event
      event.attendees = event.attendees.filter(
        (id) => id.toString() !== userId.toString()
      );
      await event.save();

      res.json({
        registered: false,
        message: "Successfully unregistered from the event",
      });
    } else {
      // Register for the event
      event.attendees.push(userId);
      await event.save();

      res.json({
        registered: true,
        message: "Successfully registered for the event",
      });
    }
  } catch (error) {
    console.error("Register for event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's events
// @route   GET /api/users/:userId/events
// @access  Private
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.params.userId;

    const events = await Event.find({
      attendees: userId,
      isDeleted: false,
    })
      .sort({ "calendar.date": -1 })
      .populate("author", "firstname lastname username profileImage")
      .lean();

    // Enhance events with media URLs
    const enhancedEvents = await Promise.all(
      events.map(async (event) => {
        // Get media URLs
        const mediaUrls = [];
        if (event.mediaIds && event.mediaIds.length > 0) {
          for (const mediaId of event.mediaIds) {
            const media = await Media.findOne({ mediaId });
            if (media) {
              mediaUrls.push(
                `data:${media.dataType};base64,${media.base64data}`
              );
            }
          }
        }

        return {
          ...event,
          mediaUrls,
        };
      })
    );

    res.json(enhancedEvents);
  } catch (error) {
    console.error("Get user events error:", error);
    res.status(500).json({ message: error.message });
  }
};
