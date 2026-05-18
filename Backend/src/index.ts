import  express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({status: "ok", message: "Social media app is live"})
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follow", followRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});