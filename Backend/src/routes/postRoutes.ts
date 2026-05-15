import { Router } from "express";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";
import { desc } from "drizzle-orm";

const router = Router();

// Endpoint to create a new post
router.post("/", async (req, res) => {
  try {
    // 1. Extract the data from the frontend
    // Remember: A post needs text content AND the ID of the user who wrote it!
    const { content, userId } = req.body;

    const result = await db.insert(posts).values({
      content,
      userId
    }).returning()

    // 3. Respond to the frontend
    const newPost = result[0];

    res.status(201).json(newPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.get('/', async (req, res) => {
  try {
    const allPost = await db.select().from(posts).orderBy(desc(posts.createdAt));

    res.status(200).json(allPost)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
})

export default router;