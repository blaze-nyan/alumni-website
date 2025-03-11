import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Ensure upload directory exists
const createUploadDir = () => {
  const uploadDir = path.join(__dirname, "../uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  return uploadDir
}

// Save base64 image to file
export const saveBase64Image = async (base64Data: string, fileType: string) => {
  try {
    // Extract the actual base64 data
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 data")
    }

    const dataType = matches[1]
    const imageData = matches[2]
    const buffer = Buffer.from(imageData, "base64")

    // Generate a unique filename
    const fileName = `${uuidv4()}.${fileType || "jpg"}`
    const uploadDir = createUploadDir()
    const filePath = path.join(uploadDir, fileName)

    // Write the file
    fs.writeFileSync(filePath, buffer)

    return {
      fileName,
      filePath,
      fileUrl: `/uploads/${fileName}`,
    }
  } catch (error) {
    console.error("Error saving base64 image:", error)
    throw error
  }
}

// Delete file
export const deleteFile = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

