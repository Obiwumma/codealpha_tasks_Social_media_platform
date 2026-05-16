import { Router } from "express";
import { db } from "../db/index.js";
import { comments } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

const router = Router();

// Endpoint to create a new comment
router.post("/", async (req, res) => {
  try {
    // 1. Extract the data. Notice we now need a postId!
    const { content, userId, postId } = req.body;

    // 2. YOUR TURN: Write the Drizzle query to insert the comment.
    // Remember to use .returning() and grab the first item from the array!
    const result = await db.insert(comments).values({
      content, 
      userId,
      postId
    }).returning()

    const newComment = result[0]

    // 3. Respond to the frontend
    res.status(201).json(newComment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    // 1. Extract the postId from the URL (Notice it is req.params, not req.body!)
    const { postId } = req.params;

    const postComments = await db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    // 3. Send back the array of comments
    res.status(200).json(postComments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export default router;