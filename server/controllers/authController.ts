import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"
import Alumni from "../models/Alumni"

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  })
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, firstname, lastname, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create user
    const user = await User.create({
      username,
      email,
      firstname,
      lastname,
      password,
      usertype: "alumni",
    })

    // Create alumni profile
    await Alumni.create({
      user: user._id,
      friends: [],
      status: "active",
    })

    if (user) {
      const token = generateToken(user._id)

      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          usertype: user.usertype,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error: any) {
    console.error("Signup error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        usertype: user.usertype,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      usertype: user.usertype,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error: any) {
    console.error("Get me error:", error)
    res.status(500).json({ message: error.message })
  }
}

