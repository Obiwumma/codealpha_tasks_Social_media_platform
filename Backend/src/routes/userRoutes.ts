import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
import { eq } from "drizzle-orm";
import dotenv from "dotenv"


dotenv.config()

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

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password} = req.body;
    // TASK 1: Find the user in the database by their email.
    // Hint: Use db.select().from(users).where(eq(users.email, email))
    const user = await db.select().from(users).where(eq(users.email, email))
    
    if (user.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const currentUser = user[0]!

    // TASK 2: Check if the password matches using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, currentUser?.passwordHash)

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // TASK 3: Generate the VIP Wristband (JWT)
    // The first argument is the payload (what data wehide inside the wristband)
    // The second argument is your "Secret Key" (a massive password only the server knows)
    // The third argument is when the wristband expires
    const token = jwt.sign(
      { userId: currentUser.id }, 
      process.env.JWT_SECRET || "a_secure_fallback_secret", 
      { expiresIn: "7d" } // Wristband expires in 7 days
    );

    // 4. Send the wristband (and safe user data) to the frontend!
    const { passwordHash, ...safeUser } = currentUser;
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: safeUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
})

export default router