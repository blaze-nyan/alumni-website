import type { Request, Response } from "express"
import User from "../models/User"
import Alumni from "../models/Alumni"
import Story from "../models/Story"
import Event from "../models/Event"
import { v4 as uuidv4 } from "uuid"
import Media from "../models/Media"

// @desc    Get all users (for admin)
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user.usertype !== "admin") {
      return res.status(403).json({ message: "Not authorized to access user list" })
    }

    const users = await User.find({}).select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (error: any) {
    console.error("Get users error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get alumni profile if exists
    const alumniProfile = await Alumni.findOne({ user: user._id })

    // Get story count
    const storyCount = await Story.countDocuments({ author: user._id, isDeleted: false })

    // Get event count (events user is attending)
    const eventCount = await Event.countDocuments({ attendees: user._id, isDeleted: false })

    // Get friend count if alumni
    const friendCount = alumniProfile ? alumniProfile.friends.length : 0

    res.json({
      ...user.toObject(),
      storyCount,
      eventCount,
      friendCount,
    })
  } catch (error: any) {
    console.error("Get user by ID error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, profileImage } = req.body
    const userId = req.user._id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update profile image if provided
    if (profileImage) {
      // Extract data type and base64 data
      const matches = profileImage.match(/^data:(.+);base64,(.+)$/)

      if (matches && matches.length === 3) {
        const dataType = matches[1]
        const base64data = matches[2]

        // Generate a unique ID for the media
        const mediaId = uuidv4()

        // Save the media
        await Media.create({
          mediaId,
          dataType,
          base64data,
        })

        // Update user's profile image
        user.profileImage = `data:${dataType};base64,${base64data}`
      }
    }

    // Update other fields
    user.firstname = firstname || user.firstname
    user.lastname = lastname || user.lastname

    // Only update email if it's changed and not already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email })
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" })
      }
      user.email = email
    }

    const updatedUser = await user.save()

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      usertype: updatedUser.usertype,
      profileImage: updatedUser.profileImage,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    })
  } catch (error: any) {
    console.error("Update user profile error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user._id

    const user = await User.findById(userId).select("+password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error: any) {
    console.error("Update password error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get alumni directory
// @route   GET /api/users/alumni
// @access  Private
export const getAlumniDirectory = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const search = (req.query.search as string) || ""

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { firstname: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    // Find alumni users
    const alumni = await User.find({
      usertype: "alumni",
      status: "active",
      ...searchQuery,
    })
      .select("-password")
      .sort({ firstname: 1, lastname: 1 })
      .skip(skip)
      .limit(limit)

    // Get total count for pagination
    const total = await User.countDocuments({
      usertype: "alumni",
      status: "active",
      ...searchQuery,
    })

    res.json({
      alumni,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total,
    })
  } catch (error: any) {
    console.error("Get alumni directory error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add or remove friend
// @route   POST /api/users/:id/friend
// @access  Private
export const toggleFriend = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const friendId = req.params.id

    // Check if friend exists and is an alumni
    const friend = await User.findOne({ _id: friendId, usertype: "alumni" })

    if (!friend) {
      return res.status(404).json({ message: "User not found or not an alumni" })
    }

    // Get alumni profile
    const alumniProfile = await Alumni.findOne({ user: userId })

    if (!alumniProfile) {
      return res.status(404).json({ message: "Alumni profile not found" })
    }

    // Check if already friends
    const isFriend = alumniProfile.friends.includes(friendId)

    if (isFriend) {
      // Remove friend
      alumniProfile.friends = alumniProfile.friends.filter((id) => id.toString() !== friendId.toString())
    } else {
      // Add friend
      alumniProfile.friends.push(friendId)
    }

    await alumniProfile.save()

    res.json({
      isFriend: !isFriend,
      message: isFriend ? "Friend removed successfully" : "Friend added successfully",
    })
  } catch (error: any) {
    console.error("Toggle friend error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Admin: Update user status
// @route   PUT /api/users/:id/status
// @access  Private (Admin only)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    // Check if user is admin
    if (req.user.usertype !== "admin") {
      return res.status(403).json({ message: "Not authorized to update user status" })
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update status
    user.status = status
    await user.save()

    res.json({
      id: user._id,
      status: user.status,
      message: "User status updated successfully",
    })
  } catch (error: any) {
    console.error("Update user status error:", error)
    res.status(500).json({ message: error.message })
  }
}

