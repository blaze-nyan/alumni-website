import type { Request, Response } from "express"
import Story from "../models/Story"
import Media from "../models/Media"
import Comment from "../models/Comment"
import { v4 as uuidv4 } from "uuid"

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req: Request, res: Response) => {
  try {
    const { title, description, mediaFiles } = req.body
    const userId = req.user._id

    // Handle media files
    const mediaIds = []
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaId = uuidv4()
        await Media.create({
          mediaId,
          dataType: file.type,
          base64data: file.data,
        })
        mediaIds.push(mediaId)
      }
    }

    const story = await Story.create({
      title,
      description,
      author: userId,
      mediaIds,
    })

    res.status(201).json(story)
  } catch (error: any) {
    console.error("Create story error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all stories with pagination
// @route   GET /api/stories
// @access  Public
export const getStories = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const stories = await Story.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "firstname lastname username profileImage")
      .lean()

    // Get total count for pagination
    const total = await Story.countDocuments({ isDeleted: false })

    // Enhance stories with media URLs and comment counts
    const enhancedStories = await Promise.all(
      stories.map(async (story) => {
        // Get media URLs
        const mediaUrls = []
        if (story.mediaIds && story.mediaIds.length > 0) {
          for (const mediaId of story.mediaIds) {
            const media = await Media.findOne({ mediaId })
            if (media) {
              mediaUrls.push(`data:${media.dataType};base64,${media.base64data}`)
            }
          }
        }

        // Get comment count
        const commentCount = await Comment.countDocuments({ story: story._id })

        return {
          ...story,
          mediaUrls,
          comments: commentCount,
          likes: story.likes ? story.likes.length : 0,
        }
      }),
    )

    res.json({
      stories: enhancedStories,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total,
    })
  } catch (error: any) {
    console.error("Get stories error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get featured stories
// @route   GET /api/stories/featured
// @access  Public
export const getFeaturedStories = async (req: Request, res: Response) => {
  try {
    const stories = await Story.find({ isDeleted: false })
      .sort({ likes: -1, createdAt: -1 })
      .limit(3)
      .populate("author", "firstname lastname username profileImage")
      .lean()

    // Enhance stories with media URLs
    const enhancedStories = await Promise.all(
      stories.map(async (story) => {
        // Get media URLs
        const mediaUrls = []
        if (story.mediaIds && story.mediaIds.length > 0) {
          for (const mediaId of story.mediaIds) {
            const media = await Media.findOne({ mediaId })
            if (media) {
              mediaUrls.push(`data:${media.dataType};base64,${media.base64data}`)
            }
          }
        }

        return {
          ...story,
          mediaUrls,
        }
      }),
    )

    res.json(enhancedStories)
  } catch (error: any) {
    console.error("Get featured stories error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get a story by ID
// @route   GET /api/stories/:id
// @access  Public
export const getStoryById = async (req: Request, res: Response) => {
  try {
    const story = await Story.findOne({ _id: req.params.id, isDeleted: false })
      .populate("author", "firstname lastname username profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstname lastname username profileImage",
        },
      })
      .lean()

    if (!story) {
      return res.status(404).json({ message: "Story not found" })
    }

    // Get media URLs
    const mediaUrls = []
    if (story.mediaIds && story.mediaIds.length > 0) {
      for (const mediaId of story.mediaIds) {
        const media = await Media.findOne({ mediaId })
        if (media) {
          mediaUrls.push(`data:${media.dataType};base64,${media.base64data}`)
        }
      }
    }

    res.json({
      ...story,
      mediaUrls,
      likes: story.likes ? story.likes.length : 0,
    })
  } catch (error: any) {
    console.error("Get story by ID error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update a story
// @route   PUT /api/stories/:id
// @access  Private
export const updateStory = async (req: Request, res: Response) => {
  try {
    const { title, description, mediaFiles } = req.body
    const userId = req.user._id

    const story = await Story.findById(req.params.id)

    if (!story) {
      return res.status(404).json({ message: "Story not found" })
    }

    // Check if user is the author
    if (story.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this story" })
    }

    // Handle media files
    const mediaIds = [...story.mediaIds] // Keep existing media IDs
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaId = uuidv4()
        await Media.create({
          mediaId,
          dataType: file.type,
          base64data: file.data,
        })
        mediaIds.push(mediaId)
      }
    }

    story.title = title || story.title
    story.description = description || story.description
    story.mediaIds = mediaIds

    const updatedStory = await story.save()

    res.json(updatedStory)
  } catch (error: any) {
    console.error("Update story error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private
export const deleteStory = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const userType = req.user.usertype

    const story = await Story.findById(req.params.id)

    if (!story) {
      return res.status(404).json({ message: "Story not found" })
    }

    // Check if user is the author or an admin
    if (story.author.toString() !== userId.toString() && userType !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this story" })
    }

    // Soft delete
    story.isDeleted = true
    await story.save()

    res.json({ message: "Story deleted successfully" })
  } catch (error: any) {
    console.error("Delete story error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Like a story
// @route   POST /api/stories/:id/like
// @access  Private
export const likeStory = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const story = await Story.findById(req.params.id)

    if (!story) {
      return res.status(404).json({ message: "Story not found" })
    }

    // Check if user already liked the story
    const alreadyLiked = story.likes.includes(userId)

    if (alreadyLiked) {
      // Unlike the story
      story.likes = story.likes.filter((id) => id.toString() !== userId.toString())
    } else {
      // Like the story
      story.likes.push(userId)
    }

    await story.save()

    res.json({
      likes: story.likes.length,
      liked: !alreadyLiked,
    })
  } catch (error: any) {
    console.error("Like story error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add a comment to a story
// @route   POST /api/stories/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const userId = req.user._id
    const storyId = req.params.id

    const story = await Story.findById(storyId)

    if (!story) {
      return res.status(404).json({ message: "Story not found" })
    }

    const comment = await Comment.create({
      content,
      author: userId,
      story: storyId,
    })

    // Add comment to story
    story.comments.push(comment._id)
    await story.save()

    // Populate author details
    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "firstname lastname username profileImage",
    )

    res.status(201).json(populatedComment)
  } catch (error: any) {
    console.error("Add comment error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user's stories
// @route   GET /api/users/:userId/stories
// @access  Private
export const getUserStories = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const stories = await Story.find({ author: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("author", "firstname lastname username profileImage")
      .lean()

    // Enhance stories with media URLs and comment counts
    const enhancedStories = await Promise.all(
      stories.map(async (story) => {
        // Get media URLs
        const mediaUrls = []
        if (story.mediaIds && story.mediaIds.length > 0) {
          for (const mediaId of story.mediaIds) {
            const media = await Media.findOne({ mediaId })
            if (media) {
              mediaUrls.push(`data:${media.dataType};base64,${media.base64data}`)
            }
          }
        }

        // Get comment count
        const commentCount = await Comment.countDocuments({ story: story._id })

        return {
          ...story,
          mediaUrls,
          comments: commentCount,
          likes: story.likes ? story.likes.length : 0,
        }
      }),
    )

    res.json(enhancedStories)
  } catch (error: any) {
    console.error("Get user stories error:", error)
    res.status(500).json({ message: error.message })
  }
}

