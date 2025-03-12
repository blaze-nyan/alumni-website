const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Alumni = require("../models/Alumni");
const Story = require("../models/Story");
const Event = require("../models/Event");
const Comment = require("../models/Comment");
const Media = require("../models/Media");
const { v4: uuidv4 } = require("uuid");

// Load environment variables
dotenv.config({ path: ".env.local" });

// Function to create a placeholder media
async function createPlaceholderMedia(id, type = "image/jpeg") {
  // This is a minimal 1x1 transparent pixel in base64
  const base64Pixel =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  await Media.create({
    mediaId: id,
    dataType: type,
    base64data: base64Pixel,
  });
}

// Sample data for seeding
const users = [
  {
    username: "admin1",
    email: "admin@example.com",
    firstname: "Admin",
    lastname: "User",
    password: "password123",
    usertype: "admin",
    status: "active",
  },
  {
    username: "jsmith",
    email: "john@example.com",
    firstname: "John",
    lastname: "Smith",
    password: "password123",
    usertype: "alumni",
    status: "active",
  },
  {
    username: "sjohnson",
    email: "sarah@example.com",
    firstname: "Sarah",
    lastname: "Johnson",
    password: "password123",
    usertype: "alumni",
    status: "active",
  },
  {
    username: "mwong",
    email: "michael@example.com",
    firstname: "Michael",
    lastname: "Wong",
    password: "password123",
    usertype: "alumni",
    status: "active",
  },
  {
    username: "edavis",
    email: "emma@example.com",
    firstname: "Emma",
    lastname: "Davis",
    password: "password123",
    usertype: "alumni",
    status: "active",
  },
];

const storyTemplates = [
  {
    title: "From Campus to CEO: My Journey",
    description:
      "After graduating, I founded a tech startup that's now valued at $50 million. Here's how my university experience shaped my entrepreneurial journey.",
    mediaIds: [uuidv4()],
  },
  {
    title: "Breaking Barriers in Medical Research",
    description:
      "My research team just received a major grant to continue our work on cancer treatment. I credit my university professors for inspiring this path.",
    mediaIds: [uuidv4()],
  },
  {
    title: "Building Schools Across Africa",
    description:
      "My nonprofit has built 15 schools in rural communities. The leadership skills I gained during my university years were instrumental to this success.",
    mediaIds: [uuidv4()],
  },
  {
    title: "My Olympic Gold Medal Journey",
    description:
      "From university athletics to Olympic gold - this is the story of perseverance, dedication, and the support of my alma mater.",
    mediaIds: [uuidv4()],
  },
  {
    title: "Revolutionizing Sustainable Energy",
    description:
      "Our team has developed a breakthrough in solar energy efficiency. Here's how my engineering degree prepared me for this innovation.",
    mediaIds: [uuidv4()],
  },
];

const eventTemplates = [
  {
    title: "Annual Alumni Reunion",
    description:
      "Join us for our biggest event of the year! Network with fellow alumni, enjoy great food, and hear inspiring talks from distinguished graduates.",
    calendar: {
      date: new Date(Date.now() + 1209600000), // 2 weeks from now
      location: "University Main Campus",
    },
    mediaIds: [uuidv4()],
  },
  {
    title: "Tech Industry Networking Night",
    description:
      "Connect with alumni working in tech companies. Perfect opportunity for recent graduates looking to break into the industry.",
    calendar: {
      date: new Date(Date.now() + 604800000), // 1 week from now
      location: "Innovation Hub, Downtown",
    },
    mediaIds: [uuidv4()],
  },
  {
    title: "Career Development Workshop",
    description:
      "Learn how to enhance your resume, improve interview skills, and navigate the current job market with expert guidance.",
    calendar: {
      date: new Date(Date.now() + 259200000), // 3 days from now
      location: "Online (Zoom)",
    },
    mediaIds: [],
  },
  {
    title: "Homecoming Weekend",
    description:
      "Return to campus for a weekend of nostalgia, sports events, and reconnecting with old friends and professors.",
    calendar: {
      date: new Date(Date.now() + 2419200000), // 4 weeks from now
      location: "University Campus",
    },
    mediaIds: [uuidv4()],
  },
  {
    title: "Entrepreneurship Panel",
    description:
      "Hear from successful alumni entrepreneurs about their journeys, challenges, and advice for aspiring business owners.",
    calendar: {
      date: new Date(Date.now() + 1814400000), // 3 weeks from now
      location: "Business School Auditorium",
    },
    mediaIds: [uuidv4()],
  },
];

const commentTemplates = [
  {
    content: "This is truly inspiring! Thanks for sharing your journey.",
  },
  {
    content:
      "I remember being in the same class as you. So proud of what you've accomplished!",
  },
  {
    content:
      "Would love to learn more about how you got started. Can we connect?",
  },
  {
    content:
      "Amazing work! Our university prepared us well for the real world.",
  },
  {
    content: "Your story motivates me to pursue my dreams as well.",
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    seedDatabase();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Seed database with initial data
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Alumni.deleteMany({});
    await Story.deleteMany({});
    await Event.deleteMany({});
    await Comment.deleteMany({});
    await Media.deleteMany({});

    console.log("Previous data cleared");

    // Create users
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created`);

    // Create alumni profiles
    const alumniUsers = createdUsers.filter(
      (user) => user.usertype === "alumni"
    );
    console.log(`Found ${alumniUsers.length} alumni users`);

    const alumniProfiles = alumniUsers.map((user) => ({
      user: user._id,
      friends: [],
      status: "active",
    }));

    await Alumni.create(alumniProfiles);
    console.log(`${alumniProfiles.length} alumni profiles created`);

    // Create placeholder media for stories and events
    console.log("Creating media...");
    for (const story of storyTemplates) {
      for (const mediaId of story.mediaIds) {
        await createPlaceholderMedia(mediaId);
      }
    }

    for (const event of eventTemplates) {
      for (const mediaId of event.mediaIds) {
        await createPlaceholderMedia(mediaId);
      }
    }
    console.log("Media created");

    // Find admin user
    const adminUser = createdUsers.find((user) => user.usertype === "admin");
    if (!adminUser) {
      throw new Error("Admin user not found!");
    }
    console.log(`Admin user found: ${adminUser.username}`);

    // Create stories
    console.log("Creating stories...");
    const createdStories = [];

    // Make sure we don't try to create more stories than we have alumni
    const numStoriesToCreate = Math.min(
      storyTemplates.length,
      alumniUsers.length
    );

    for (let i = 0; i < numStoriesToCreate; i++) {
      const storyData = {
        ...storyTemplates[i],
        author: alumniUsers[i]._id,
        likes: [],
        comments: [],
      };

      const story = await Story.create(storyData);
      createdStories.push(story);
    }

    console.log(`${createdStories.length} stories created`);

    // Create events
    console.log("Creating events...");
    const createdEvents = [];

    for (const eventTemplate of eventTemplates) {
      const eventData = {
        ...eventTemplate,
        author: adminUser._id,
        attendees: alumniUsers
          .slice(0, Math.floor(Math.random() * alumniUsers.length) + 1)
          .map((user) => user._id),
      };

      const event = await Event.create(eventData);
      createdEvents.push(event);
    }

    console.log(`${createdEvents.length} events created`);

    // Create comments
    console.log("Creating comments...");
    let commentCount = 0;

    for (let i = 0; i < commentTemplates.length; i++) {
      if (createdStories.length === 0) {
        console.log("No stories to add comments to");
        break;
      }

      const storyIndex = i % createdStories.length;
      const userIndex = (i + 1) % alumniUsers.length;

      const storyId = createdStories[storyIndex]._id;
      const userId = alumniUsers[userIndex]._id;

      if (!storyId || !userId) {
        console.log(`Skipping comment: storyId=${storyId}, userId=${userId}`);
        continue;
      }

      const comment = await Comment.create({
        content: commentTemplates[i].content,
        author: userId,
        story: storyId,
      });

      // Add comment to story
      await Story.findByIdAndUpdate(storyId, {
        $push: { comments: comment._id },
      });

      commentCount++;
    }
    console.log(`${commentCount} comments created`);

    // Add some likes to stories
    console.log("Adding likes to stories...");
    for (const story of createdStories) {
      const likeCount = Math.floor(Math.random() * alumniUsers.length) + 1;
      const likers = alumniUsers.slice(0, likeCount).map((user) => user._id);

      await Story.findByIdAndUpdate(story._id, { likes: likers });
    }
    console.log("Added likes to stories");

    console.log("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}
