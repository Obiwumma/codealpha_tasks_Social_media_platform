import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    // 1. We extract the data sent by the frontend
    const { username, email } = req.body;

    const result = await db.insert(users).values({
      username,
      email
    }).returning()

    const newUser = result[0]

    // 3. Respond to the frontend (Replace 'newUser' with whatever you name your result)
    console.log('New User Created:', newUser); 
    res.status(201).json(newUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
})

export default router