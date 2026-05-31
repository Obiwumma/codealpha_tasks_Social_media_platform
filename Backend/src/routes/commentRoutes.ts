import { Router } from "express";
import { db } from "../db/index.js";
import { comments, users } from "../db/schema.js";
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
    const { postId } = req.params;

    // Use a LEFT JOIN to combine comment data with the commenter's username
    const postComments = await db.select({
      id: comments.id,
      content: comments.content,
      userId: comments.userId,
      createdAt: comments.createdAt,
      username: users.username // Grab the exact username!
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postId, postId)); 

    res.status(200).json(postComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export default router;