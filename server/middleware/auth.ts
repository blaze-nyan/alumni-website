import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

interface DecodedToken {
  id: string
  iat: number
  exp: number
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken

    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ message: "Not authorized, token failed" })
  }
}

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.usertype === "admin") {
    next()
  } else {
    return res.status(403).json({ message: "Not authorized as an admin" })
  }
}

