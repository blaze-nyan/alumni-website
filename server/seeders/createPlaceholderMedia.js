// server/seeders/createPlaceholderMedia.js
const Media = require("../models/Media");

// Helper to create placeholder media entries for testing
async function createPlaceholderMedia(mediaId, type = "image/jpeg") {
  // This is a minimal 1x1 transparent pixel in base64
  const base64Pixel =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  await Media.create({
    mediaId,
    dataType: type,
    base64data: base64Pixel,
  });

  return { mediaId, type };
}

module.exports = createPlaceholderMedia;
