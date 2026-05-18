import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import bcrypt from "bcrypt"

const router = Router();

router.post("/", async (req, res) => {
  try {
    // 1. We extract the data sent by the frontend
    const { username, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.insert(users).values({
      username,
      email,
      passwordHash: hashedPassword
    }).returning()


    const newUser = result[0]

    // 3. Respond to the frontend (Replace 'newUser' with whatever you name your result)
    const { passwordHash, ...safeUser } = newUser;

    // 5. Respond with the safe version!
    res.status(201).json(safeUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
})

// Get all users
router.get("/", async (req, res) => {
  try {
    // YOUR TURN: Write the Drizzle query to fetch all users
    const allUsers = await db.select().from(users)
    
    // Send them back to the frontend
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router