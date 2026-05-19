import { Router } from "express";
import { db } from "../db/index.js";
import { followers } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { checkAuth, type AuthRequest } from "../middleware/authMiddleware.js";

const router = Router();

// Endpoint to FOLLOW a user
router.post("/", checkAuth,  async (req: AuthRequest, res) => {
  try {
    // 1. Extract the two IDs
    const {  followingId } = req.body;
    const followerId = req.userId;

    // A quick safety check so users can't follow themselves!
    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    // 2. YOUR TURN: Write the Drizzle query to insert the relationship into the followers table!
    // (You don't necessarily need .returning() here unless you want to send the exact database row back)
    
    const result = await db.insert(followers).values({
      followerId, followingId
    }).returning()

    const newFollow = result[0];

    // 3. Respond with success
    res.status(201).json({ message: "Successfully followed user!", newFollow });

  } catch (error) {
    console.error(error);
    // If the composite key rejects it (meaning they already follow this person), 
    // Drizzle will throw an error, which gets safely caught right here!
    res.status(500).json({ error: "Failed to follow user. You might already be following them." });
  }
});

// Endpoint to UNFOLLOW a user
router.delete("/", checkAuth,  async (req: AuthRequest, res) => {
  try {

    const { followingId } = req.body;
    const followerId = req.userId!

    // 2. YOUR TURN: Write the Drizzle query to delete the relationship!
    await db.delete(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      );

    res.status(200).json({ message: "Successfully unfollowed user!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unfollow user." });
  }
});

export default router;